import React, { useState, useEffect } from 'react';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Reservation } from '../../types';
import { format } from 'date-fns';
import { Search, Eye, Filter, Download } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import { Modal } from '../../components/ui/Modal';
import { toast } from 'sonner';

export function ReservationSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch reservations from backend
  useEffect(() => {
    fetch('/oceanview-backend/reservation?action=adminAll', {
      credentials: 'include' // include session cookies if needed
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success' && Array.isArray(data.reservations)) {
          setReservations(data.reservations);
        } else {
          setReservations([]);
          toast.error('No reservations found');
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error('Failed to load reservations');
      });
  }, []);

  const filteredReservations = reservations.filter(
    (res) =>
      res.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.id.toString().includes(searchTerm)
  );

  const columns = [
    {
      header: 'ID',
      accessor: (res: Reservation) => (
        <span className="font-mono text-xs text-gray-500">{res.id}</span>
      )
    },
    {
      header: 'Guest',
      accessor: (res: Reservation) => (
        <div>
          <div className="font-medium text-gray-900">{res.guestName}</div>
          <div className="text-xs text-gray-500">{res.guestEmail}</div>
        </div>
      )
    },
    {
      header: 'Room',
      accessor: 'roomName'
    },
    {
      header: 'Dates',
      accessor: (res: Reservation) => (
        <div className="text-sm">
          <div>{format(new Date(res.checkIn), 'MMM d')}</div>
          <div className="text-gray-400 text-xs">
            to {format(new Date(res.checkOut), 'MMM d')}
          </div>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: (res: Reservation) => {
        const variants: Record<
          string,
          'success' | 'warning' | 'error' | 'info' | 'default'
        > = {
          CONFIRMED: 'success',
          PENDING: 'warning',
          CANCELLED: 'error',
          CHECKED_IN: 'info',
          CHECKED_OUT: 'default'
        };
        return (
          <Badge variant={variants[res.status]}>
            {res.status.replace('_', ' ')}
          </Badge>
        );
      }
    },
    {
      header: 'Actions',
      accessor: (res: Reservation) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSelectedRes(res);
            setIsModalOpen(true);
          }}
        >
          <Eye className="h-4 w-4" />
        </Button>
      )
    }
  ];
  const exportToCSV = () => {
  if (!filteredReservations.length) {
    toast.error('No reservations to export');
    return;
  }

  // Create CSV header
  const headers = [
    'ID',
    'Guest Name',
    'Guest Email',
    'Room Name',
    'Check In',
    'Check Out',
    'Status',
    'Amount'
  ];

  // Map data rows
  const rows = filteredReservations.map((res) => [
    res.id,
    res.guestName,
    res.guestEmail,
    res.roomName,
    res.checkIn,
    res.checkOut,
    res.status,
    res.amount
  ]);

  // Combine header + rows
  const csvContent =
    [headers, ...rows].map((e) => e.join(',')).join('\n');

  // Create blob and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `reservations_${new Date().toISOString()}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Search Reservations
          </h1>
          <p className="text-gray-500">Find and view booking details.</p>
        </div>
        <Button
  variant="outline"
  leftIcon={<Download className="h-4 w-4" />}
  onClick={exportToCSV}
>
  Export CSV
</Button>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by guest name, ID, or room..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="secondary" leftIcon={<Filter className="h-4 w-4" />}>
          Filters
        </Button>
      </div>

      <Table data={filteredReservations} columns={columns} pagination totalPages={1} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Reservation Details"
        footer={<Button onClick={() => setIsModalOpen(false)}>Close</Button>}
      >
        {selectedRes && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Reservation ID</p>
                <p className="font-medium">{selectedRes.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Badge variant="info">{selectedRes.status}</Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500">Guest Name</p>
                <p className="font-medium">{selectedRes.guestName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{selectedRes.guestEmail}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Check In</p>
                <p className="font-medium">{selectedRes.checkIn}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Check Out</p>
                <p className="font-medium">{selectedRes.checkOut}</p>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-xl font-bold text-ocean-deep">
                {formatCurrency(selectedRes.amount)}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
