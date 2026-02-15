import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Reservation } from '../../types';
import { formatCurrency } from '../../utils/format';
import { format } from 'date-fns';
import { Calendar, Eye, X, CreditCard, Trash } from 'lucide-react';
import { toast } from 'sonner';

export function MyBookings() {
  const [searchTerm, setSearchTerm] = useState('');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'Credit Card' | 'PayPal' | 'Cash'>('Credit Card');

  // --------------------------- Fetch reservations ---------------------------
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await fetch('/oceanview-backend/reservation?action=my', {
          credentials: 'include',
        });
        const data = await res.json();
        if (data.status === 'error') {
          toast.error(data.message || 'Failed to fetch reservations');
        } else {
          const reservationsWithPaid = (data.reservations || []).map((r: any) => ({
            ...r,
            paid: r.paid || false,
          }));
          setReservations(reservationsWithPaid);
        }
      } catch (err: any) {
        toast.error(err.message || 'Error fetching reservations');
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  // --------------------------- Modals ---------------------------
  const handleViewDetails = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsDetailModalOpen(true);
  };

  const handleCancelBooking = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsCancelModalOpen(true);
  };

  // --------------------------- Delete booking ---------------------------
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
        toast.success('Booking deleted permanently');
        setReservations((prev) =>
          prev.filter((r) => r.id !== selectedReservation.id)
        );
      } else {
        toast.error(data.message || 'Failed to delete booking');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error deleting booking');
    } finally {
      setIsCancelModalOpen(false);
      setSelectedReservation(null);
    }
  };

  // --------------------------- Payment ---------------------------
  const handlePayNow = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setPaymentMethod('Credit Card');
    setIsPaymentModalOpen(true);
  };

  const confirmPayment = async () => {
    if (!selectedReservation) return;

    try {
      const res = await fetch('/oceanview-backend/reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          action: 'pay',
          id: String(selectedReservation.id),
          method: paymentMethod,
        }),
        credentials: 'include',
      });

      const data = await res.json();

      if (data.status === 'success') {
        toast.success(`Payment successful via ${paymentMethod}! Receipt downloaded.`);

        setReservations((prev) =>
          prev.map((r) =>
            r.id === selectedReservation.id ? { ...r, paid: true } : r
          )
        );

        const pad = (text: string, length: number) => text.padEnd(length, ' ');
        const receiptContent = `
╔════════════════════════════════════════╗
║           OCEANVIEW RESORT             ║
╠════════════════════════════════════════╣
║ Receipt #: ${pad(String(selectedReservation.id), 28)}║
║ Date: ${pad(new Date().toLocaleString(), 32)}║
╠════════════════════════════════════════╣
║ Guest Name : ${pad(selectedReservation.guestName, 26)}║
║ Room Name  : ${pad(selectedReservation.roomName, 26)}║
║ Check-In   : ${pad(format(new Date(selectedReservation.checkIn), 'MMM d, yyyy'), 26)}║
║ Check-Out  : ${pad(format(new Date(selectedReservation.checkOut), 'MMM d, yyyy'), 26)}║
║ Payment Method: ${pad(paymentMethod, 21)}║
╠════════════════════════════════════════╣
║ Amount Paid     : ${pad(formatCurrency(selectedReservation.amount), 20)}║
║ Payment Status  : PAID ✅${' '.repeat(16)}║
╠════════════════════════════════════════╣
║ Thank you for choosing OceanView Resort! ║
║ We hope you had a pleasant stay.        ║
╚════════════════════════════════════════╝
`;

        const blob = new Blob([receiptContent], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `receipt_${selectedReservation.id}.txt`;
        link.click();
      } else {
        toast.error(data.message || 'Payment failed');
      }
    } catch (err: any) {
      toast.error(err.message || 'Payment error');
    } finally {
      setIsPaymentModalOpen(false);
      setSelectedReservation(null);
    }
  };

  // --------------------------- Status Badge ---------------------------
  const getStatusVariant = (status: string): 'success' | 'warning' | 'error' | 'info' | 'default' => {
    const variants: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
      CONFIRMED: 'success',
      PENDING: 'warning',
      CANCELLED: 'error',
      CHECKED_IN: 'info',
      CHECKED_OUT: 'default',
    };
    return variants[status.toUpperCase()] || 'warning';
  };

  // --------------------------- Filter by search ---------------------------
  const filteredReservations = reservations.filter((res) =>
    res.roomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    res.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(res.id).includes(searchTerm)
  );

  if (loading) return <div className="p-12 text-center">Loading your bookings...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-ocean-deep mb-2">My Bookings</h1>
          <p className="text-gray-600">View and manage your reservations</p>
        </div>

        {/* Full-width Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by room name, guest name, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-ocean-DEFAULT focus:border-ocean-DEFAULT sm:text-sm"
          />
        </div>

        {/* Bookings List as Cards */}
        {filteredReservations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReservations.map((reservation) => (
              <Card key={reservation.id} noPadding className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-serif font-bold text-gray-900">{reservation.roomName}</h3>
                    <Badge variant={getStatusVariant(reservation.status)}>
                      {reservation.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 flex flex-col gap-1">
                    <span>ID: {reservation.id}</span>
                    <span>Guest: {reservation.guestName}</span>
                    <span>
                      <Calendar className="inline h-4 w-4 mr-1" />
                      {format(new Date(reservation.checkIn), 'MMM d, yyyy')} → {format(new Date(reservation.checkOut), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-ocean-deep">{formatCurrency(reservation.amount)}</div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" leftIcon={<Eye className="h-4 w-4" />} onClick={() => handleViewDetails(reservation)}>View Details</Button>

                    {reservation.status.toUpperCase() === 'PENDING' && (
                      <Button size="sm" variant="danger" leftIcon={<X className="h-4 w-4" />} onClick={() => handleCancelBooking(reservation)}>Cancel</Button>
                    )}

                    {reservation.status.toUpperCase() === 'CANCELLED' && (
                      <Button size="sm" variant="danger" leftIcon={<Trash className="h-4 w-4" />} onClick={() => handleCancelBooking(reservation)}>Delete Reservation</Button>
                    )}

                    {reservation.status.toUpperCase() === 'CONFIRMED' && !reservation.paid && (
                      <Button size="sm" variant="success" className="bg-emerald-500 text-white hover:bg-emerald-600" leftIcon={<CreditCard className="h-4 w-4" />} onClick={() => handlePayNow(reservation)}>Pay Now</Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-500 mb-6">You don't have any reservations matching your search.</p>
            <Button onClick={() => window.location.href = '/customer/rooms'}>Browse Rooms</Button>
          </Card>
        )}

        {/* Modals remain the same */}
        {/* Details Modal */}
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title="Booking Details"
          footer={<Button onClick={() => setIsDetailModalOpen(false)}>Close</Button>}
        >
          {selectedReservation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Reservation ID</p>
                  <p className="font-medium font-mono">{selectedReservation.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge variant={getStatusVariant(selectedReservation.status)}>
                    {selectedReservation.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Guest Name</p>
                  <p className="font-medium">{selectedReservation.guestName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Check In</p>
                  <p className="font-medium">{format(new Date(selectedReservation.checkIn), 'MMM d, yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Check Out</p>
                  <p className="font-medium">{format(new Date(selectedReservation.checkOut), 'MMM d, yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Room Name</p>
                  <p className="font-medium">{selectedReservation.roomName}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-2xl font-bold text-ocean-deep">{formatCurrency(selectedReservation.amount)}</p>
                {selectedReservation.paid && (
                  <p className="text-sm text-green-700 font-medium mt-1">Paid ✅</p>
                )}
              </div>
            </div>
          )}
        </Modal>

        {/* Cancel Modal */}
        <Modal
          isOpen={isCancelModalOpen}
          onClose={() => setIsCancelModalOpen(false)}
          title="Cancel Booking"
          footer={
            <>
              <Button variant="ghost" onClick={() => setIsCancelModalOpen(false)}>Keep Booking</Button>
              <Button variant="danger" onClick={confirmCancel}>Yes, Delete Permanently</Button>
            </>
          }
        >
          <div className="py-4">
            <p className="text-gray-600 mb-4">
              Are you sure you want to <strong>permanently delete</strong> your booking for <strong>{selectedReservation?.roomName}</strong>?
            </p>
            <div className="bg-red-50 border border-red-100 rounded-lg p-4">
              <p className="text-sm text-red-800">
                <strong>Note:</strong> This action is irreversible. Once deleted, the booking cannot be recovered.
              </p>
            </div>
          </div>
        </Modal>

        {/* Payment Modal */}
        <Modal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          title="Select Payment Method"
          footer={
            <>
              <Button variant="ghost" onClick={() => setIsPaymentModalOpen(false)}>Cancel</Button>
              <Button variant="success" onClick={confirmPayment}>
                Pay {selectedReservation ? formatCurrency(selectedReservation.amount) : ''}
              </Button>
            </>
          }
        >
          {/* Payment modal content unchanged */}
          {/* ... same as before ... */}
        </Modal>
      </div>
    </div>
  );
}
