import React, { useState, useEffect } from 'react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Search, Eye, Download } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { formatCurrency } from '../../utils/format';
import { Reservation } from '../../types';

export function ReservationSearch() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Fetch Reservations
  const fetchReservations = async () => {
    try {
      const res = await fetch('/oceanview-backend/reservation?action=adminAll', {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.status === 'success') {
        setReservations(data.reservations || []);
      } else {
        toast.error(data.message || 'Failed to load reservations');
        setReservations([]);
      }
    } catch (err: any) {
      toast.error(err.message || 'Server error');
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // Actions 
  const handleViewDetails = (res: Reservation) => {
    setSelectedRes(res);
    setIsDetailModalOpen(true);
  };

  //  Filtering 
  const filteredReservations = reservations.filter(
    (r) =>
      r.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.roomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toString().includes(searchTerm)
  );

  //  Export CSV 
  const exportToCSV = () => {
    if (!filteredReservations.length) {
      toast.error('No reservations to export');
      return;
    }
    const headers = ['ID', 'Guest Name', 'Email', 'Room', 'Check In', 'Check Out', 'Status', 'Amount'];
    const rows = filteredReservations.map((r) => [
      r.id,
      r.guestName,
      r.guestEmail,
      r.roomName,
      r.checkIn,
      r.checkOut,
      r.status,
      r.amount,
    ]);
    const csvContent = [headers, ...rows].map((e) => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reservations_${new Date().toISOString()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Status Styles
  const statusStyles: Record<string, string> = {
    CONFIRMED: "bg-emerald-100 text-emerald-700 ring-emerald-300",
    PENDING: "bg-yellow-100 text-yellow-700 ring-yellow-300",
    CANCELLED: "bg-red-100 text-red-600 ring-red-300",
    CHECKED_IN: "bg-teal-100 text-teal-700 ring-teal-300",
    CHECKED_OUT: "bg-cyan-100 text-cyan-700 ring-cyan-300",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6 flex flex-col">

      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-2xl p-6 shadow-lg mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Reservation Search</h1>
        <p className="text-emerald-100 mt-1">Find and view booking details</p>
      </div>

      {/* Search */}
      <div className="backdrop-blur-lg bg-white/70 border border-emerald-100 rounded-2xl shadow-md p-4 flex items-center gap-3 mb-6">
        <div className="bg-emerald-100 p-2 rounded-lg">
          <Search className="h-4 w-4 text-emerald-600" />
        </div>
        <Input
          placeholder="Search by guest, room, or reservation ID..."
          className="border-0 focus:ring-0 bg-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="outline" onClick={exportToCSV}>
          <Download className="h-4 w-4 mr-2" /> Export CSV
        </Button>
      </div>

      {/* Reservation Cards */}
      <div className="flex-1 overflow-y-auto space-y-5 pr-2">
        {filteredReservations.length > 0 ? (
          filteredReservations.map((r) => (
            <div
              key={r.id}
              className="group relative bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 p-6 border border-emerald-100 hover:-translate-y-1"
            >
              {/* Soft Glow Hover */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-400/0 via-teal-300/0 to-cyan-300/0 group-hover:from-emerald-400/10 group-hover:via-teal-300/10 group-hover:to-cyan-300/10 transition-all duration-500 pointer-events-none" />

              {/* Top Row */}
              <div className="flex justify-between items-start mb-5">
                <div>
                  <p className="text-xs uppercase tracking-wider text-emerald-500 font-semibold">Reservation</p>
                  <p className="text-xl font-bold text-gray-800">#{r.id}</p>
                </div>
                <span
                  className={`px-3 py-1 text-xs rounded-full font-medium ring-1 ${
                    statusStyles[r.status] || "bg-gray-100 text-gray-600 ring-gray-200"
                  }`}
                >
                  {r.status.replace("_", " ")}
                </span>
              </div>

              {/* Main Content */}
              <div className="grid md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-gray-400">Guest</p>
                  <p className="text-lg font-semibold text-gray-800">{r.guestName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Room</p>
                  <p className="font-medium text-teal-700">{r.roomName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Stay</p>
                  <p className="text-sm text-gray-700">
                    {format(new Date(r.checkIn), "MMM d, yyyy")} — {format(new Date(r.checkOut), "MMM d, yyyy")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total</p>
                  <p className="text-xl font-bold text-emerald-600">{formatCurrency(r.amount)}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 border-t pt-4 mt-6">
                <button
                  onClick={() => handleViewDetails(r)}
                  className="p-2 rounded-full bg-teal-100 hover:bg-teal-200 text-teal-700 transition"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-gray-400">No reservations found.</div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Reservation Details"
        footer={<Button onClick={() => setIsDetailModalOpen(false)}>Close</Button>}
      >
        {selectedRes && (
          <div className="space-y-4 text-sm">
            <p>ID: {selectedRes.id}</p>
            <p>Guest: {selectedRes.guestName}</p>
            <p>Room: {selectedRes.roomName}</p>
            <p>
              Dates: {format(new Date(selectedRes.checkIn), "MMM d, yyyy")} —{" "}
              {format(new Date(selectedRes.checkOut), "MMM d, yyyy")}
            </p>
            <p>Status: {selectedRes.status}</p>
            <p>Amount: {formatCurrency(selectedRes.amount)}</p>
          </div>
        )}
      </Modal>

    </div>
  );
}