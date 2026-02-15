import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Reservation } from '../../types';
import { formatCurrency } from '../../utils/format';
import { format } from 'date-fns';
import { Calendar, Eye, X, CreditCard,Trash } from 'lucide-react';
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

  // ---------------------------
  // Delete booking permanently
  // ---------------------------
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
    return variants[status.toUpperCase()] || 'warning';
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
                  ? 'bg-ocean-deep text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-50'
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

                        {reservation.status.toUpperCase() === 'PENDING' && (
                          <Button
                            size="sm"
                            variant="danger"
                            leftIcon={<X className="h-4 w-4" />}
                            onClick={() => handleCancelBooking(reservation)}
                          >
                            Cancel
                          </Button>
                        )}
                          {reservation.status.toUpperCase() === 'CANCELLED' && (
                          <Button
                            size="sm"
                            variant="danger"
                            className='text-white'
                            leftIcon={<Trash className="h-4 w-4" />}
                            onClick={() => handleCancelBooking(reservation)}
                          >
                            Delete Reservation
                          </Button>
                          
                        )}

                        {reservation.status.toUpperCase() === 'CONFIRMED' && !reservation.paid && (
                          <Button
                            size="sm"
                            variant="success"
                            className='bg-emerald-500 text-white hover:bg-emerald-600'
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
  <div className="py-4 space-y-6">
    <p className="text-gray-600">Choose a payment method for your booking:</p>

    {/* Payment Method Selection */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[
        {
          name: 'Credit Card',
          
        },
        {
          name: 'PayPal',
         
        },
        {
          name: 'Cash',
          icon: (
            <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path fill="currentColor" d="M..." /> {/* Replace with real cash SVG */}
            </svg>
          ),
        },
      ].map((method) => (
        <div
          key={method.name}
          onClick={() => setPaymentMethod(method.name as any)}
          className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all shadow-sm hover:shadow-md ${
            paymentMethod === method.name
              ? 'border-ocean-DEFAULT bg-ocean-50'
              : 'border-gray-300 bg-white'
          }`}
        >
          {method.icon}
          <div className="font-medium text-gray-800">{method.name}</div>
        </div>
      ))}
    </div>

    {/* Card Details Form */}
    {paymentMethod === 'Credit Card' && (
      <div className="mt-4 p-4 border rounded-lg bg-white shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Cardholder Name</label>
          <input
            type="text"
            placeholder="John Doe"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-ocean-DEFAULT focus:border-ocean-DEFAULT sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Card Number</label>
          <input
            type="text"
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-ocean-DEFAULT focus:border-ocean-DEFAULT sm:text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
            <input
              type="text"
              placeholder="MM/YY"
              maxLength={5}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-ocean-DEFAULT focus:border-ocean-DEFAULT sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">CVV</label>
            <input
              type="password"
              placeholder="123"
              maxLength={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-ocean-DEFAULT focus:border-ocean-DEFAULT sm:text-sm"
            />
          </div>
        </div>
      </div>
    )}

    {/* Selected Summary */}
    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
      <p className="text-gray-700">
        Selected Method: <span className="font-semibold">{paymentMethod}</span>
      </p>
      {selectedReservation && (
        <p className="text-gray-900 font-bold text-lg">
          Amount to Pay: {formatCurrency(selectedReservation.amount)}
        </p>
      )}
    </div>
  </div>
</Modal>

      </div>
    </div>
  );
}
