import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '../../utils/format';

interface Reservation {
  id: number;
  userId?: number;
  roomId?: number;
  guestName: string;
  guestEmail: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  status: string;
  amount: number;
  paid?: boolean;
}

export function AdminReports() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
    revenue: 0,
  });

 
  // Fetch reservations
  
  const fetchReservations = async () => {
    try {
      const res = await fetch('/oceanview-backend/reservation?action=adminAll', {
        credentials: 'include',
      });
      const data = await res.json();

      if (data.status === 'success' && Array.isArray(data.reservations)) {
        setReservations(data.reservations);

        // Dynamically compute stats from fetched reservations
        
        const total = data.reservations.length;
        const confirmed = data.reservations.filter(
          (r: Reservation) => r.status.toUpperCase() === 'CONFIRMED'
        ).length;
        const pending = data.reservations.filter(
          (r: Reservation) => r.status.toUpperCase() === 'PENDING'
        ).length;
        const revenue = data.reservations
          .filter((r: Reservation) => r.status.toUpperCase() === 'CHECKED_OUT' && r.paid)
          .reduce((sum: number, r: Reservation) => sum + (r.amount || 0), 0);

        setStats({ total, confirmed, pending, revenue });
      } else {
        toast.error(data.message || 'Failed to load reservations');
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Error fetching reservations');
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // Filter reservations
  
  const filteredReservations = reservations.filter(
    (r) =>
      r.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.roomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toString().includes(searchTerm)
  );

 
  // CSV Export
 
  const exportToCSV = () => {
    if (!filteredReservations.length)
      return toast.error('No reservations to export');

    const headers = [
      'ID',
      'Guest Name',
      'Guest Email',
      'Room Name',
      'Check In',
      'Check Out',
      'Status',
      'Amount',
    ];

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
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `admin_reservations_${new Date().toISOString()}.csv`;
    link.click();
  };

 
  // Table columns
  
  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Guest Name', accessor: 'guestName' },
    { header: 'Email', accessor: 'guestEmail' },
    { header: 'Room', accessor: 'roomName' },
    { header: 'Check In', accessor: 'checkIn' },
    { header: 'Check Out', accessor: 'checkOut' },
    { header: 'Status', accessor: 'status' },
    {
      header: 'Amount',
      accessor: (r: Reservation) => formatCurrency(r.amount),
    },
  ];

  
return (
  <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-8 space-y-8">

    {/* Header */}
    <div className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
      <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl"></div>
      <div className="relative z-10">
        <h1 className="text-3xl font-bold tracking-tight">
          Executive Reports
        </h1>
        <p className="text-emerald-100 mt-2">
          Overview of reservations, performance, and revenue
        </p>
      </div>
    </div>

    {/*Stats Section */}
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

      <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-md border border-emerald-100 hover:shadow-xl transition">
        <p className="text-sm text-gray-500">Total Reservations</p>
        <p className="text-2xl font-bold text-emerald-700 mt-1">
          {stats.total}
        </p>
      </div>

      <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-md border border-emerald-100 hover:shadow-xl transition">
        <p className="text-sm text-gray-500">Confirmed</p>
        <p className="text-2xl font-bold text-teal-600 mt-1">
          {stats.confirmed}
        </p>
      </div>

      <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-md border border-emerald-100 hover:shadow-xl transition">
        <p className="text-sm text-gray-500">Pending</p>
        <p className="text-2xl font-bold text-yellow-500 mt-1">
          {stats.pending}
        </p>
      </div>

      <div className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition">
        <p className="text-sm text-emerald-100">Revenue</p>
        <p className="text-2xl font-bold mt-1">
          {formatCurrency(stats.revenue)}
        </p>
      </div>

    </div>

    {/*Search + Export */}
    <div className="flex flex-col md:flex-row justify-between gap-4 items-center">

      <div className="flex items-center bg-white/70 backdrop-blur-lg border border-emerald-100 rounded-2xl px-4 py-3 shadow-md w-full md:w-1/3">
        <Input
          placeholder="Search reservations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-0 focus:ring-0 bg-transparent"
        />
      </div>

      <Button
        onClick={exportToCSV}
        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md"
        leftIcon={<Download size={16} />}
      >
        Export CSV
      </Button>

    </div>

    {/*Modern Table Container */}
    <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 overflow-hidden">

      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2" />

      <div className="p-6">
        <Table
          data={filteredReservations}
          columns={columns}
          pagination
          totalPages={1}
        />
      </div>

    </div>

  </div>
);
}
