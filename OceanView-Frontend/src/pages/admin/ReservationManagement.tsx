import React, { useEffect, useState } from 'react';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Search, Eye, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { formatCurrency } from '../../utils/format';

interface Reservation {
  id: number;
  userId: number;
  guestName: string;
  roomId: number;
  roomName: string;
  checkIn: string;
  checkOut: string;
  status: string;
  amount: number;
}

export function ReservationManagement() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [editStatus, setEditStatus] = useState('');

  // ---------------- Fetch Reservations ----------------
  const fetchReservations = async () => {
    try {
      const res = await fetch('/oceanview-backend/reservation?action=adminAll', {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch reservations');
      const data = await res.json();
      if (data.status === 'success') {
        setReservations(data.reservations);
      } else {
        toast.error(data.message || 'Failed to load reservations');
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // ---------------- Actions ----------------
  const handleViewDetails = (res: Reservation) => {
    setSelectedRes(res);
    setIsDetailModalOpen(true);
  };

  const handleEditStatus = (res: Reservation) => {
    setSelectedRes(res);
    setEditStatus(res.status);
    setIsEditModalOpen(true);
  };

  const handleDelete = (res: Reservation) => {
    setSelectedRes(res);
    setIsDeleteModalOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedRes || selectedRes.id == null) return;

    try {
      const payload = new URLSearchParams();
      payload.append('action', 'updateStatus');
      payload.append('id', String(selectedRes.id));
      payload.append('status', editStatus);

      const res = await fetch('/oceanview-backend/reservation', {
        method: 'POST',
        body: payload,
        credentials: 'include',
      });
      const result = await res.json();
      if (result.status === 'success') {
        toast.success('Status updated successfully');
        fetchReservations();
        setIsEditModalOpen(false);
        setSelectedRes(null);
      } else {
        toast.error(result.message || 'Update failed');
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const confirmDelete = async () => {
    if (!selectedRes || selectedRes.id == null) {
      toast.error('Invalid reservation selected.');
      return;
    }

    try {
      const payload = new URLSearchParams();
      payload.append('action', 'delete');
      payload.append('reservationId', String(selectedRes.id));

      const res = await fetch('/oceanview-backend/reservation', {
        method: 'POST',
        body: payload,
        credentials: 'include',
      });

      const result = await res.json();
      if (result.status === 'success') {
        toast.success('Reservation deleted successfully');
        fetchReservations();
        setIsDeleteModalOpen(false);
        setSelectedRes(null);
      } else {
        toast.error(result.message || 'Delete failed');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error deleting reservation');
    }
  };

  // ---------------- Filtering ----------------
  const filteredReservations = reservations.filter(
    (r) =>
      r.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.roomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toString().includes(searchTerm)
  );

  // ---------------- Table Columns ----------------
  const columns = [
    { header: 'ID', accessor: (r: Reservation) => <span className="font-mono text-xs">{r.id}</span> },
    { header: 'Guest', accessor: (r: Reservation) => <span>{r.guestName}</span> },
    { header: 'Room', accessor: (r: Reservation) => <span>{r.roomName}</span> },
    {
      header: 'Dates',
      accessor: (r: Reservation) => (
        <div>
          <div>{format(new Date(r.checkIn), 'MMM d, yyyy')}</div>
          <div className="text-gray-400 text-xs">to {format(new Date(r.checkOut), 'MMM d, yyyy')}</div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (r: Reservation) => {
        const variants: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
          CONFIRMED: 'success',
          PENDING: 'warning',
          CANCELLED: 'error',
          CHECKED_IN: 'info',
          CHECKED_OUT: 'info',
        };
        return <Badge variant={variants[r.status]}>{r.status.replace('_', ' ')}</Badge>;
      },
    },
    {
      header: 'Amount',
      accessor: (r: Reservation) => <span className="font-medium">{formatCurrency(r.amount)}</span>,
    },
    {
      header: 'Actions',
      accessor: (r: Reservation) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleViewDetails(r)}
            className="p-1 text-gray-400 hover:text-ocean-DEFAULT"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleEditStatus(r)}
            className="p-1 text-gray-400 hover:text-blue-500"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(r)}
            className="p-1 text-gray-400 hover:text-red-500"
            disabled={!r.id} // disables if id is null/undefined
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reservation Management</h1>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <Search className="h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by guest, room, or ID..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <Table data={filteredReservations} columns={columns} pagination totalPages={1} />

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Reservation Details"
        footer={<Button onClick={() => setIsDetailModalOpen(false)}>Close</Button>}
      >
        {selectedRes && (
          <div className="space-y-4">
            <div>
              <p>ID: {selectedRes.id}</p>
              <p>Guest: {selectedRes.guestName}</p>
              <p>Room: {selectedRes.roomName}</p>
              <p>
                Dates: {selectedRes.checkIn} to {selectedRes.checkOut}
              </p>
              <p>Status: {selectedRes.status}</p>
              <p>Amount: {formatCurrency(selectedRes.amount)}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Reservation Status"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmStatusChange}>Save</Button>
          </>
        }
      >
        {selectedRes && (
          <div className="space-y-2">
            <p>Change status for reservation #{selectedRes.id}</p>
            <select
              className="w-full border rounded px-2 py-1"
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
            >
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CHECKED_IN">Checked In</option>
              <option value="CHECKED_OUT">Checked Out</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Reservation"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              disabled={!selectedRes || !selectedRes.id}
            >
              Delete
            </Button>
          </>
        }
      >
        <p>
          Are you sure you want to delete reservation #{selectedRes?.id} for {selectedRes?.guestName}?
        </p>
      </Modal>
    </div>
  );
}
