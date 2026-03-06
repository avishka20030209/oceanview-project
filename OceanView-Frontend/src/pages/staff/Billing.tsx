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
  amount: number;
  paid: boolean;
}

export function Billing() {
  const [searchId, setSearchId] = useState('');
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(false);

  // Search / Payment / Print logic remains unchanged

  const handleSearch = async () => {
    if (!searchId.trim()) {
      toast.error('Enter Reservation ID or Guest Name');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `/oceanview-backend/reservation?action=search&query=${encodeURIComponent(searchId)}`,
        { credentials: 'include' }
      );
      const data = await res.json();
      if (data.status === 'success' && data.reservation) {
        setReservation(data.reservation);
      } else {
        toast.error(data.message || 'Reservation not found');
        setReservation(null);
      }
    } catch (err) {
      toast.error('Error fetching reservation');
      setReservation(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (!reservation) return;
    document.title = `Invoice-${reservation.id}`;
    window.print();
  };

  const handlePayment = async () => {
    if (!reservation) return;
    setLoading(true);
    try {
      const res = await fetch('/oceanview-backend/reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          action: 'pay',
          reservationId: String(reservation.id),
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
    } catch (err) {
      toast.error('Error processing payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex flex-col space-y-6 animate-fade-in">

      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-2xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold">Billing & Invoicing</h1>
        <p className="text-emerald-100 mt-1">Generate invoices and process payments</p>
      </div>

      {/* Search */}
      <div className="flex gap-3 print:hidden max-w-xl">
        <div className="bg-emerald-100 p-2 rounded-lg flex items-center">
          <Search className="h-4 w-4 text-emerald-600" />
        </div>
        <Input
          placeholder="Enter Reservation ID or Guest Name..."
          className="border-0 focus:ring-0 bg-white/70 rounded-2xl flex-1"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <Button
          onClick={handleSearch}
          loading={loading}
          className="bg-teal-600 text-white hover:bg-teal-700"
        >
          Search
        </Button>
      </div>

      {reservation && (
        <div className="grid lg:grid-cols-3 gap-6">
       
          {/* INVOICE CARD */}
         
          <Card
            id="invoice"
            className="lg:col-span-2 relative bg-white rounded-3xl shadow-md p-6 hover:shadow-2xl transition-all"
          >
            {/* PAID Watermark */}
            {reservation.paid && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-6xl font-bold text-green-600 opacity-10 rotate-[-30deg]">
                  PAID
                </span>
              </div>
            )}

            {/* Header */}
            <div className="flex justify-between items-start mb-6 border-b border-gray-200 pb-4">
              <div>
                <h2 className="text-3xl font-serif font-bold text-ocean-deep">INVOICE</h2>
                <p className="text-gray-600 mt-1">Ocean View Resort</p>
                <p className="text-sm text-gray-400">123 Coastal Road, Galle, Sri Lanka</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-gray-600">#{reservation.id}</p>
                <p className="text-sm text-gray-400">Date: {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            {/* Guest Info */}
            <div className="mb-6 grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Guest Name</p>
                <p className="font-medium text-gray-800">{reservation.guestName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="font-medium text-gray-800">{reservation.guestEmail}</p>
              </div>
            </div>

            {/* Line Items */}
            <table className="w-full mb-6 border-t border-gray-100">
              <thead>
                <tr className="text-sm text-gray-500">
                  <th className="py-2 text-left">Description</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-4">
                    <p className="font-medium">{reservation.roomName}</p>
                    <p className="text-xs text-gray-500">
                      {reservation.checkIn} → {reservation.checkOut}
                    </p>
                  </td>
                  <td className="py-4 text-right">{formatCurrency(reservation.amount)}</td>
                </tr>
              </tbody>
            </table>

            {/* Total */}
            <div className="flex justify-end border-t border-gray-200 pt-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-2xl font-bold text-ocean-deep">{formatCurrency(reservation.amount)}</p>
                {reservation.paid && (
                  <p className="text-sm text-green-700 font-medium mt-1">Payment Completed</p>
                )}
              </div>
            </div>
          </Card>

        
          {/* ACTIONS SIDEBAR */}
          
          <Card className="space-y-4 print:hidden p-6 rounded-3xl shadow-md hover:shadow-2xl transition-all">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Actions</h3>

            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              leftIcon={<Printer className="h-4 w-4" />}
              onClick={handlePrint}
            >
              Print / Save PDF
            </Button>

            {!reservation.paid && (
              <>
                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Payment Method
                  </label>
                  <select className="w-full h-10 rounded-md border border-gray-300 px-3">
                    <option>Cash</option>
                    <option>Credit Card</option>
                    <option>Bank Transfer</option>
                  </select>

                  <Button
                    className="w-full flex items-center justify-center gap-2"
                    leftIcon={<CreditCard className="h-4 w-4" />}
                    onClick={handlePayment}
                    loading={loading}
                  >
                    Mark as Paid
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}