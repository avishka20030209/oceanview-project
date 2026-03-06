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

  // Fetch Reservations
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

  //Filtering 
  const filteredReservations = reservations.filter(
    (r) =>
      r.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.roomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toString().includes(searchTerm)
  );

  // Table Columns
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
  <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6 flex flex-col">

    {/* Header */}
    <div className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-2xl p-6 shadow-lg mb-6">
      <h1 className="text-3xl font-bold tracking-tight">
        Reservation Management
      </h1>
      <p className="text-emerald-100 mt-1">
        Manage and monitor all hotel reservations
      </p>
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
    </div>

    {/* Scrollable Card Container */}
    <div className="flex-1 overflow-y-auto pr-2 space-y-5">

      {filteredReservations.map((r) => {

        const statusStyles: Record<string, string> = {
          CONFIRMED: "bg-emerald-100 text-emerald-700 ring-emerald-300",
          PENDING: "bg-yellow-100 text-yellow-700 ring-yellow-300",
          CANCELLED: "bg-red-100 text-red-600 ring-red-300",
          CHECKED_IN: "bg-teal-100 text-teal-700 ring-teal-300",
          CHECKED_OUT: "bg-cyan-100 text-cyan-700 ring-cyan-300",
        };

        return (
          <div
            key={r.id}
            className="group relative bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 p-6 border border-emerald-100 hover:-translate-y-1"
          >
            {/* Soft Glow Hover Effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-400/0 via-teal-300/0 to-cyan-300/0 group-hover:from-emerald-400/10 group-hover:via-teal-300/10 group-hover:to-cyan-300/10 transition-all duration-500 pointer-events-none" />

            {/* Top Row */}
            <div className="flex justify-between items-start mb-5">
              <div>
                <p className="text-xs uppercase tracking-wider text-emerald-500 font-semibold">
                  Reservation
                </p>
                <p className="text-xl font-bold text-gray-800">
                  #{r.id}
                </p>
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

              {/* Guest */}
              <div>
                <p className="text-sm text-gray-400">Guest Name</p>
                <p className="text-lg font-semibold text-gray-800">
                  {r.guestName}
                </p>
              </div>

              {/* Room */}
              <div>
                <p className="text-sm text-gray-400">Room Type</p>
                <p className="font-medium text-teal-700">
                  {r.roomName}
                </p>
              </div>

              {/* Dates */}
              <div>
                <p className="text-sm text-gray-400">Stay</p>
                <p className="text-sm text-gray-700">
                  {format(new Date(r.checkIn), "MMM d, yyyy")} —{" "}
                  {format(new Date(r.checkOut), "MMM d, yyyy")}
                </p>
              </div>

              {/* Amount */}
              <div>
                <p className="text-sm text-gray-400">Amount</p>
                <p className="text-xl font-bold text-emerald-600">
                  {formatCurrency(r.amount)}
                </p>
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

              <button
                onClick={() => handleEditStatus(r)}
                className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition"
              >
                <Edit2 className="h-4 w-4" />
              </button>

              <button
                onClick={() => handleDelete(r)}
                disabled={!r.id}
                className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

          </div>
        );
      })}

      {filteredReservations.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          No reservations found.
        </div>
      )}

    </div>

    

    {/* Detail Modal */}
    <Modal
      isOpen={isDetailModalOpen}
      onClose={() => setIsDetailModalOpen(false)}
      title="Reservation Details"
      footer={
        <Button onClick={() => setIsDetailModalOpen(false)}>
          Close
        </Button>
      }
    >
      {selectedRes && (
        <div className="space-y-4 text-sm">
          <p>ID: {selectedRes.id}</p>
          <p>Guest Name: {selectedRes.guestName}</p>
          <p>Room Type: {selectedRes.roomName}</p>
          <p>
            Dates issued: {format(new Date(selectedRes.checkIn), "MMM d, yyyy")} —{" "}
            {format(new Date(selectedRes.checkOut), "MMM d, yyyy")}
          </p>
          <p>Status: {selectedRes.status}</p>
          <p>Amount: {formatCurrency(selectedRes.amount)}</p>
        </div>
      )}
    </Modal>

    {/* Edit Modal */}
    <Modal
      isOpen={isEditModalOpen}
      onClose={() => setIsEditModalOpen(false)}
      title="Update Reservation Status"
      footer={
        <>
          <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={confirmStatusChange}>
            Ok
          </Button>
        </>
      }
    >
      {selectedRes && (
        <div className="space-y-3">
          <p>Change reservation status #{selectedRes.id}</p>
          <select
            className="w-full border rounded px-3 py-2"
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
        Please confirm if you would like to proceed with canceling this reservation #{selectedRes?.id} for{" "}
        {selectedRes?.guestName}?
      </p>
    </Modal>

  </div>
);
}
