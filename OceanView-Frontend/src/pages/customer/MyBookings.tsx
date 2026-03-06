import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Reservation } from '../../types';
import { formatCurrency } from '../../utils/format';
import { format } from 'date-fns';
import {
  Calendar,
  Eye,
  X,
  CreditCard,
  Trash,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';

export function MyBookings() {
  const [filter, setFilter] =
    useState<'all' | 'upcoming' | 'past' | 'cancelled'>('all');

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const [paymentMethod, setPaymentMethod] =
    useState<'Credit Card' | 'PayPal' | 'Cash'>('Credit Card');

  const [loading, setLoading] = useState(true);

  // ---------------- FETCH BOOKINGS ----------------
  useEffect(() => {
    fetch('/oceanview-backend/reservation?action=my', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'error') {
          toast.error(data.message);
        } else {
          setReservations(
            (data.reservations || []).map((r: any) => ({
              ...r,
              paid: r.paid || false,
            }))
          );
        }
      })
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false));
  }, []);

  // ---------------- FILTER ----------------
  const filteredReservations = reservations.filter(res => {
    const today = new Date();
    const checkIn = new Date(res.checkIn);
    const status = res.status.toUpperCase();

    if (filter === 'upcoming') return checkIn >= today && status !== 'CANCELLED';
    if (filter === 'past') return checkIn < today || status === 'CHECKED_OUT';
    if (filter === 'cancelled') return status === 'CANCELLED';
    return true;
  });

  // ---------------- STATUS BADGE ----------------
  const getStatusVariant = (status: string) => {
    const map: any = {
      CONFIRMED: 'success',
      PENDING: 'warning',
      CANCELLED: 'error',
      CHECKED_IN: 'info',
      CHECKED_OUT: 'default',
    };
    return map[status.toUpperCase()] || 'warning';
  };

  // ---------------- HANDLERS ----------------
  const handleViewDetails = (res: Reservation) => {
    setSelectedReservation(res);
    setIsDetailModalOpen(true);
  };

  const handleCancelBooking = (res: Reservation) => {
    setSelectedReservation(res);
    setIsCancelModalOpen(true);
  };

  const confirmCancel = async () => {
    if (!selectedReservation) return;

    try {
      const res = await fetch('/oceanview-backend/reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          action: 'delete',
          reservationId: String(selectedReservation.id),
        }),
        credentials: 'include',
      });

      const data = await res.json();

      if (data.status === 'success') {
        toast.success('Booking deleted');
        setReservations(prev =>
          prev.filter(r => r.id !== selectedReservation.id)
        );
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error('Delete failed');
    } finally {
      setIsCancelModalOpen(false);
      setSelectedReservation(null);
    }
  };

  const handlePayNow = (res: Reservation) => {
    setSelectedReservation(res);
    setPaymentMethod('Credit Card');
    setIsPaymentModalOpen(true);
  };

  // ---------------- UI ----------------
  if (loading) return <div className="p-12 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">

        <h1 className="text-3xl font-serif font-bold mb-6 text-ocean-deep">
          My Bookings
        </h1>

        {/* FILTER */}
        <div className="flex gap-2 mb-8">
          {['all', 'upcoming', 'past', 'cancelled'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === f
                  ? 'bg-ocean-deep text-white'
                  : 'bg-white border hover:bg-gray-50'
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredReservations.map(res => (
            <Card key={res.id} className="p-6 space-y-4">

              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold">{res.roomName}</h3>
                <Badge variant={getStatusVariant(res.status)}>
                  {res.status.replace('_', ' ')}
                </Badge>
              </div>

              <div className="text-sm text-gray-600 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {format(new Date(res.checkIn), 'MMM d')} →{' '}
                {format(new Date(res.checkOut), 'MMM d, yyyy')}
              </div>

              <div className="text-2xl font-bold text-ocean-deep">
                {formatCurrency(res.amount)}
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Eye className="h-4 w-4" />}
                  onClick={e => {
                    e.stopPropagation();
                    handleViewDetails(res);
                  }}
                >
                  Details
                </Button>

                {res.status === 'PENDING' && (
                  <Button
                    size="sm"
                    variant="danger"
                    leftIcon={<X className="h-4 w-4" />}
                    onClick={e => {
                      e.stopPropagation();
                      handleCancelBooking(res);
                    }}
                  >
                    Cancel
                  </Button>
                )}

                {res.status === 'CONFIRMED' && !res.paid && (
                  <Button
                    size="sm"
                    variant="success"
                    leftIcon={<CreditCard className="h-4 w-4" />}
                    onClick={e => {
                      e.stopPropagation();
                      handlePayNow(res);
                    }}
                  >
                    Pay
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* ---------------- MODALS ---------------- */}

        {/* DETAILS */}
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title="Booking Details"
          footer={<Button onClick={() => setIsDetailModalOpen(false)}>Close</Button>}
        >
          {selectedReservation && (
            <div className="space-y-3">
              <p><strong>Room:</strong> {selectedReservation.roomName}</p>
              <p><strong>Check-in:</strong> {format(new Date(selectedReservation.checkIn), 'PPP')}</p>
              <p><strong>Check-out:</strong> {format(new Date(selectedReservation.checkOut), 'PPP')}</p>
              <p className="text-xl font-bold text-ocean-deep">
                {formatCurrency(selectedReservation.amount)}
              </p>
              {selectedReservation.paid && (
                <p className="text-green-600 flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" /> Paid
                </p>
              )}
            </div>
          )}
        </Modal>

        {/* CANCEL */}
        <Modal
          isOpen={isCancelModalOpen}
          onClose={() => setIsCancelModalOpen(false)}
          title="Delete Booking"
          footer={
            <>
              <Button variant="ghost" onClick={() => setIsCancelModalOpen(false)}>
                Keep
              </Button>
              <Button variant="danger" onClick={confirmCancel}>
                Delete
              </Button>
            </>
          }
        >
          <p>
            Permanently delete booking for{' '}
            <strong>{selectedReservation?.roomName}</strong>?
          </p>
        </Modal>

        {/* PAYMENT */}
        <Modal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          title="Payment"
          footer={
            <Button variant="success">
              Pay {selectedReservation && formatCurrency(selectedReservation.amount)}
            </Button>
          }
        >
          <div className="space-y-4">
            <p>Select payment method:</p>

            {['Credit Card', 'PayPal', 'Cash'].map(m => (
              <div
                key={m}
                onClick={() => setPaymentMethod(m as any)}
                className={`p-3 border rounded-lg cursor-pointer ${
                  paymentMethod === m
                    ? 'border-ocean-DEFAULT bg-ocean-50'
                    : 'hover:bg-gray-50'
                }`}
              >
                {m}
              </div>
            ))}
          </div>
        </Modal>
      </div>
    </div>
  );
}