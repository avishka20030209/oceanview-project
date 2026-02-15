import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { formatCurrency } from '../../utils/format';
import { Search, Printer, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

interface Reservation {
  id: number;
  guestName: string;
  guestEmail: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  amount: number; // already includes service & VAT
  paid: boolean;
}

export function Billing() {
  const [searchId, setSearchId] = useState('');
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(false);

  // -------------------------
  // Search Reservation
  // -------------------------
  const handleSearch = async () => {
    if (!searchId) return toast.error('Enter Reservation ID or Guest Name');
    setLoading(true);

    try {
      const res = await fetch(`/oceanview-backend/reservation?action=search&query=${encodeURIComponent(searchId)}`, {
        credentials: 'include',
      });
      const data = await res.json();

      if (data.status === 'success' && data.reservation) {
        setReservation(data.reservation);
      } else {
        toast.error('Reservation not found');
        setReservation(null);
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Error fetching reservation');
      setReservation(null);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Print Invoice
  // -------------------------
  const handlePrint = () => {
    if (!reservation) return;
    window.print();
  };

  // -------------------------
  // Process Payment
  // -------------------------
  const handlePayment = async () => {
    if (!reservation) return;
    setLoading(true);

    try {
      const res = await fetch('/oceanview-backend/reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          action: 'pay',
          id: String(reservation.id),
        }),
        credentials: 'include',
      });

      const data = await res.json();
      if (data.status === 'success') {
        toast.success('Payment processed successfully');
        setReservation({ ...reservation, paid: true });
      } else {
        toast.error(data.message || 'Payment failed');
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Error processing payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="print:hidden">
        <h1 className="text-2xl font-bold text-gray-900">
          Billing & Invoicing
        </h1>
        <p className="text-gray-500">Generate invoices and process payments.</p>
      </div>

      {/* Search */}
      <div className="print:hidden flex gap-4 max-w-xl">
        <Input
          placeholder="Enter Reservation ID or Guest Name..."
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <Button
          onClick={handleSearch}
          leftIcon={<Search className="h-4 w-4" />}
          loading={loading}
        >
          Search
        </Button>
      </div>

      {/* Reservation Found */}
      {reservation && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Invoice Preview */}
          <div className="lg:col-span-2">
            <Card className="print:shadow-none print:border-none" id="invoice">
              <div className="p-8 bg-white">
                {/* Header */}
                <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-8">
                  <div>
                    <h2 className="text-3xl font-serif font-bold text-ocean-deep mb-2">
                      INVOICE
                    </h2>
                    <p className="text-gray-500">Ocean View Resort</p>
                    <p className="text-sm text-gray-400">
                      123 Coastal Road, Galle, Sri Lanka
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-gray-500">#{reservation.id}</p>
                    <p className="text-sm text-gray-400">
                      Date: {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Guest Details */}
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-gray-900 uppercase mb-2">
                    Bill To:
                  </h3>
                  <p className="font-medium">{reservation.guestName}</p>
                  <p className="text-sm text-gray-500">{reservation.guestEmail}</p>
                </div>

                {/* Line Items */}
                <table className="w-full mb-8">
                  <thead>
                    <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
                      <th className="pb-2">Description</th>
                      <th className="pb-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b border-gray-100">
                      <td className="py-4">
                        <p className="font-medium">{reservation.roomName}</p>
                        <p className="text-gray-500 text-xs">
                          {reservation.checkIn} to {reservation.checkOut}
                        </p>
                      </td>
                      <td className="py-4 text-right">{formatCurrency(reservation.amount)}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Total */}
                <div className="flex justify-end border-t border-gray-200 pt-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                    <p className="text-2xl font-bold text-ocean-deep">
                      {formatCurrency(reservation.amount)}
                    </p>
                    {reservation.paid && (
                      <p className="text-sm text-green-700 font-medium mt-1">Paid ✅</p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Actions Sidebar */}
          <div className="print:hidden space-y-6">
            <Card title="Actions">
              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full"
                  leftIcon={<Printer className="h-4 w-4" />}
                  onClick={handlePrint}
                >
                  Print Invoice
                </Button>

                <div className="border-t border-gray-100 pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <select className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 mb-4">
                    <option>Cash</option>
                    <option>Credit Card</option>
                    <option>Bank Transfer</option>
                  </select>
                  {!reservation.paid && (
                    <Button
                      className="w-full"
                      leftIcon={<CreditCard className="h-4 w-4" />}
                      onClick={handlePayment}
                      loading={loading}
                    >
                      Mark as Paid
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
