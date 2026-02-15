import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Reservation } from '../../types';
import { formatCurrency } from '../../utils/format';
import { format } from 'date-fns';
import { Calendar, Eye, X, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

export function MyBookings() {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past' | 'cancelled'>('all');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'Credit Card' | 'PayPal' | 'Cash'>('Credit Card');

  // ---------------------------
  // Fetch user's reservations
  // ---------------------------
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

  // ---------------------------
  // Filter reservations
  // ---------------------------
  const filteredReservations = reservations.filter((res) => {
    const today = new Date();
    const checkIn = new Date(res.checkIn);
    const status = res.status.toUpperCase();
    if (filter === 'upcoming') return checkIn >= today && status !== 'CANCELLED';
    if (filter === 'past') return checkIn < today || status === 'CHECKED_OUT';
    if (filter === 'cancelled') return status === 'CANCELLED';
    return true;
  });

  // ---------------------------
  // Modals
  // ---------------------------
  const handleViewDetails = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsDetailModalOpen(true);
  };

  const handleCancelBooking = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsCancelModalOpen(true);
  };

  const confirmCancel = async () => {
    if (!selectedReservation) return;

    try {
      const res = await fetch('/oceanview-backend/reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          action: 'updateStatus',
          id: String(selectedReservation.id),
          status: 'CANCELLED',
        }),
        credentials: 'include',
      });
      const data = await res.json();

      if (data.status === 'success') {
        toast.success('Booking cancelled successfully');
        setReservations((prev) =>
          prev.map((r) =>
            r.id === selectedReservation.id ? { ...r, status: 'CANCELLED' } : r
          )
        );
      } else {
        toast.error(data.message || 'Failed to cancel booking');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error cancelling booking');
    } finally {
      setIsCancelModalOpen(false);
      setSelectedReservation(null);
    }
  };

  // ---------------------------
  // Payment flow
  // ---------------------------
  const handlePayNow = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setPaymentMethod('Credit Card'); // default
    setIsPaymentModalOpen(true);
  };

  const confirmPayment = async () => {
    if (!selectedReservation) return;

    try {
      // Simulate sending payment method to backend
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

        // Beautified receipt
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

  // ---------------------------
  // Status Badge
  // ---------------------------
  const getStatusVariant = (
    status: string
  ): 'success' | 'warning' | 'error' | 'info' | 'default' => {
    const variants: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
      CONFIRMED: 'success',
      PENDING: 'warning',
      CANCELLED: 'error',
      CHECKED_IN: 'info',
      CHECKED_OUT: 'default',
    };
    return variants[status.toUpperCase()] || 'default';
  };

  if (loading) return <div className="p-12 text-center">Loading your bookings...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-ocean-deep mb-2">My Bookings</h1>
          <p className="text-gray-600">View and manage your reservations</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { key: 'all', label: 'All Bookings' },
            { key: 'upcoming', label: 'Upcoming' },
            { key: 'past', label: 'Past' },
            { key: 'cancelled', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                filter === tab.key
                  ? 'bg-ocean-DEFAULT text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredReservations.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {filteredReservations.map((reservation) => (
              <Card key={reservation.id} noPadding className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-serif font-bold text-gray-900">{reservation.roomName}</h3>
                        <Badge variant={getStatusVariant(reservation.status)}>
                          {reservation.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {format(new Date(reservation.checkIn), 'MMM d, yyyy')}
                          </span>
                          <span className="mx-1">→</span>
                          <span>{format(new Date(reservation.checkOut), 'MMM d, yyyy')}</span>
                        </div>
                        <div className="font-mono text-xs text-gray-400">ID: {reservation.id}</div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-ocean-deep">{formatCurrency(reservation.amount)}</p>
                        <p className="text-xs text-gray-500">Total Amount</p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          leftIcon={<Eye className="h-4 w-4" />}
                          onClick={() => handleViewDetails(reservation)}
                        >
                          View Details
                        </Button>

                        {reservation.status.toUpperCase() === 'CONFIRMED' && (
                          <Button
                            size="sm"
                            variant="danger"
                            leftIcon={<X className="h-4 w-4" />}
                            onClick={() => handleCancelBooking(reservation)}
                          >
                            Cancel
                          </Button>
                        )}

                        {reservation.status.toUpperCase() === 'CHECKED_OUT' && !reservation.paid && (
                          <Button
                            size="sm"
                            variant="success"
                            leftIcon={<CreditCard className="h-4 w-4" />}
                            onClick={() => handlePayNow(reservation)}
                          >
                            Pay Now
                          </Button>
                        )}
                      </div>
                    </div>
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
            <p className="text-gray-500 mb-6">
              You don't have any {filter !== 'all' ? filter : ''} reservations yet.
            </p>
            <Button onClick={() => window.location.href = '/customer/rooms'}>Browse Rooms</Button>
          </Card>
        )}

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
                  <p className="font-medium">
                    {format(new Date(selectedReservation.checkIn), 'MMM d, yyyy')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Check Out</p>
                  <p className="font-medium">
                    {format(new Date(selectedReservation.checkOut), 'MMM d, yyyy')}
                  </p>
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
              <Button variant="danger" onClick={confirmCancel}>Yes, Cancel Booking</Button>
            </>
          }
        >
          <div className="py-4">
            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel your booking for <strong>{selectedReservation?.roomName}</strong>?
            </p>
            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Cancellation is free up to 24 hours before check-in. After that, cancellation fees may apply.
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
              <Button variant="success" onClick={confirmPayment}>Confirm Payment</Button>
            </>
          }
        >
          <div className="py-4 space-y-4">
            <p className="text-gray-600">Choose a payment method for your booking:</p>
            <div className="flex flex-col gap-2">
              {['Credit Card', 'PayPal', 'Cash'].map((method) => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method as any)}
                  className={`px-4 py-2 rounded-lg border ${
                    paymentMethod === method ? 'bg-ocean-DEFAULT text-white border-ocean-DEFAULT' : 'bg-white text-gray-700 border-gray-300'
                  } text-left`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>
        </Modal>

      </div>
    </div>
  );
}
