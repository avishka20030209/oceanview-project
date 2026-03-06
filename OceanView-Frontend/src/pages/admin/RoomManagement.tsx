import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { toast } from 'sonner';
import { Room } from '../../types';
import { formatCurrency } from '../../utils/format';

export function RoomManagement() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Standard' as 'Deluxe' | 'Suite' | 'Villa' | 'Standard',
    price: 0,
    capacity: 1,
    amenities: [] as string[],
    description: '',
    imageUrl: '',
    available: true,
  });
  const [newAmenity, setNewAmenity] = useState('');

  // Fetch rooms from backend
  const fetchRooms = async () => {
    try {
      const res = await fetch('/oceanview-backend/room');
      if (!res.ok) throw new Error('Failed to fetch rooms');
      const data: Room[] = await res.json();
      const formatted = data.map(r => ({
        ...r,
        amenities: r.amenities ? r.amenities.split(',') : [],
        capacity: r.maxGuests,
      }));
      setRooms(formatted);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Open Add/Edit Modal
  const handleOpenModal = (room?: Room) => {
    if (room) {
      setEditingRoom(room);
      setFormData({
        name: room.name,
        type: room.type as any,
        price: room.price,
        capacity: room.capacity || room.maxGuests,
        amenities: room.amenities || [],
        description: room.description,
        imageUrl: room.imageUrl,
        available: room.available,
      });
    } else {
      setEditingRoom(null);
      setFormData({
        name: '',
        type: 'Standard',
        price: 0,
        capacity: 1,
        amenities: [],
        description: '',
        imageUrl: '',
        available: true,
      });
    }
    setNewAmenity('');
    setIsModalOpen(true);
  };

  // Add / Remove amenity
  const handleAddAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData({ ...formData, amenities: [...formData.amenities, newAmenity.trim()] });
      setNewAmenity('');
    }
  };
  const handleRemoveAmenity = (amenity: string) => {
    setFormData({ ...formData, amenities: formData.amenities.filter(a => a !== amenity) });
  };

  // Submit Add/Edit
  const handleSubmit = async () => {
    if (!formData.name || !formData.imageUrl || formData.price <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const params = new URLSearchParams();
      params.append('name', formData.name);
      params.append('price', formData.price.toString());
      params.append('available', formData.available.toString());
      params.append('maxGuests', formData.capacity.toString());
      params.append('imageUrl', formData.imageUrl);
      params.append('description', formData.description);
      params.append('amenities', formData.amenities.join(','));

      let res: Response;
      if (editingRoom) {
        params.append('action', 'updateAvailability');
        params.append('id', editingRoom.id!.toString());
        res = await fetch('/oceanview-backend/room', { method: 'POST', body: params });
      } else {
        params.append('action', 'add');
        res = await fetch('/oceanview-backend/room', { method: 'POST', body: params });
      }

      const result = await res.json();
      if (result.status === 'success') {
        toast.success(result.message);
        setIsModalOpen(false);
        fetchRooms();
      } else {
        toast.error(result.message);
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // Delete room
  const handleDelete = async () => {
    if (!roomToDelete) return;
    try {
      const params = new URLSearchParams();
      params.append('action', 'delete');
      params.append('id', roomToDelete.id!.toString());
      const res = await fetch('/oceanview-backend/room', { method: 'POST', body: params });
      const result = await res.json();
      if (result.status === 'success') {
        toast.success(result.message);
        setIsDeleteModalOpen(false);
        setRoomToDelete(null);
        fetchRooms();
      } else {
        toast.error(result.message);
      }
    } catch (err: any) {
      toast.error('Failed to delete room');
    }
  };

  const filteredRooms = rooms.filter(
    r =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6 flex flex-col">

      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-2xl p-6 shadow-lg mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Room Management</h1>
        <p className="text-emerald-100 mt-1">Manage hotel rooms, pricing, and availability</p>
      </div>

      {/* Search + Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="backdrop-blur-lg bg-white/70 border border-emerald-100 rounded-2xl shadow-md p-4 flex items-center gap-3 flex-1 max-w-md">
          <div className="bg-emerald-100 p-2 rounded-lg">
            <Plus className="h-4 w-4 text-emerald-600" />
          </div>
          <Input
            placeholder="Search rooms by name or type..."
            className="border-0 focus:ring-0 bg-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Button
          onClick={() => handleOpenModal()}
          className="bg-teal-600 hover:bg-teal-700 text-white rounded-2xl px-4 py-2 shadow-md transition"
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Add Room
        </Button>
      </div>

      {/* Rooms Grid */}
      <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map(room => {
          const statusStyles: Record<string, string> = {
            true: "bg-emerald-100 text-emerald-700 ring-emerald-300",
            false: "bg-red-100 text-red-600 ring-red-300",
          };
          return (
            <div
              key={room.id}
              className="group relative bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 p-6 border border-emerald-100 hover:-translate-y-1"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-400/0 via-teal-300/0 to-cyan-300/0 group-hover:from-emerald-400/10 group-hover:via-teal-300/10 group-hover:to-cyan-300/10 transition-all duration-500 pointer-events-none" />

              {/* Image */}
              <div className="relative h-48 overflow-hidden rounded-2xl mb-4">
                <img
                  src={room.imageUrl}
                  alt={room.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ring-1 ${
                      statusStyles[room.available] || "bg-gray-100 text-gray-600 ring-gray-200"
                    }`}
                  >
                    {room.available ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>

              {/* Room Info */}
              <h3 className="text-lg font-bold text-gray-800 mb-1">{room.name}</h3>
              <p className="text-sm text-teal-700 mb-2">{room.type}</p>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{room.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Capacity: {room.capacity}</span>
                <span className="text-lg font-bold text-emerald-600">{formatCurrency(room.price)}</span>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => handleOpenModal(room)}
                  className="p-2 rounded-full bg-teal-100 hover:bg-teal-200 text-teal-700 transition"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => { setRoomToDelete(room); setIsDeleteModalOpen(true); }}
                  className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredRooms.length === 0 && (
          <div className="text-center py-20 text-gray-400 col-span-full">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="h-8 w-8 text-gray-400" />
            </div>
            No rooms found. Add a new room to get started.
          </div>
        )}
      </div>

     
      {/* Add/Edit Modal */}
      <Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title={editingRoom ? 'Edit Room' : 'Add New Room'}
  size="lg"
  footer={
    <>
      <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
      <Button onClick={handleSubmit}>{editingRoom ? 'Save Changes' : 'Add Room'}</Button>
    </>
  }
>
  <div className="space-y-4 text-sm">

    {/* Room Name */}
    <div>
      <label className="block mb-1 font-medium text-gray-700">Room Name</label>
      <Input
        placeholder="Enter room name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
    </div>

    {/* Room Type */}
    <div>
      <label className="block mb-1 font-medium text-gray-700">Room Type</label>
      <select
        className="w-full border rounded px-3 py-2"
        value={formData.type}
        onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
      >
        <option value="Standard">Standard</option>
        <option value="Deluxe">Deluxe</option>
        <option value="Suite">Suite</option>
        <option value="Villa">Villa</option>
      </select>
    </div>

    {/* Price & Capacity */}
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block mb-1 font-medium text-gray-700">Price</label>
        <Input
          type="number"
          placeholder="Price per night"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
        />
      </div>
      <div>
        <label className="block mb-1 font-medium text-gray-700">Capacity</label>
        <Input
          type="number"
          placeholder="Max guests"
          value={formData.capacity}
          onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
        />
      </div>
    </div>

    {/* Description */}
    <div>
      <label className="block mb-1 font-medium text-gray-700">Description</label>
      <textarea
        className="w-full border rounded px-3 py-2 resize-none"
        placeholder="Room description"
        rows={3}
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      />
    </div>

    {/* Amenities */}
    <div>
      <label className="block mb-1 font-medium text-gray-700">Amenities</label>
      <div className="flex gap-2 mb-2">
        <Input
          placeholder="Add amenity"
          value={newAmenity}
          onChange={(e) => setNewAmenity(e.target.value)}
        />
        <Button onClick={handleAddAmenity}>Add</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {formData.amenities.map(a => (
          <Badge key={a} variant="info" onClick={() => handleRemoveAmenity(a)} className="cursor-pointer">
            {a} ×
          </Badge>
        ))}
      </div>
    </div>

    {/* Image URL */}
    <div>
      <label className="block mb-1 font-medium text-gray-700">Image URL</label>
      <Input
        placeholder="Enter image URL"
        value={formData.imageUrl}
        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
      />
    </div>

    {/* Availability */}
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={formData.available}
        onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
        id="availableCheckbox"
      />
      <label htmlFor="availableCheckbox" className="text-gray-700 font-medium">
        Available
      </label>
    </div>

  </div>
</Modal>

    </div>
  );
}
