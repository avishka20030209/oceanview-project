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

  // --------------------------
  // Fetch reservations
  // --------------------------
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

  // --------------------------
  // Filter reservations
  // --------------------------
  const filteredReservations = reservations.filter(
    (r) =>
      r.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.roomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toString().includes(searchTerm)
  );

  // --------------------------
  // CSV Export
  // --------------------------
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

  // --------------------------
  // Table columns
  // --------------------------
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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Admin Reports</h1>

      {/* -------------------- Stats Cards -------------------- */}
      <div className="grid grid-cols-4 gap-6">
        <Card>
          <p className="text-sm text-gray-500">Total Reservations</p>
          <p className="text-xl font-bold">{stats.total}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Confirmed</p>
          <p className="text-xl font-bold">{stats.confirmed}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-xl font-bold">{stats.pending}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Revenue</p>
          <p className="text-xl font-bold text-ocean-deep">{formatCurrency(stats.revenue)}</p>
        </Card>
      </div>

      {/* -------------------- Search & Export -------------------- */}
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search reservations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/3"
        />
        <Button variant="outline" leftIcon={<Download />} onClick={exportToCSV}>
          Export CSV
        </Button>
      </div>

      {/* -------------------- Table -------------------- */}
      <Table data={filteredReservations} columns={columns} pagination totalPages={1} />
    </div>
  );
}
