import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon, Search } from 'lucide-react';
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
      // Convert amenities string to array for frontend
      const formatted = data.map(r => ({
        ...r,
        amenities: r.amenities ? r.amenities.split(',') : [],
        capacity: r.maxGuests // for frontend consistency
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
        // Editing: use 'updateAvailability' action for now
        params.append('action', 'updateAvailability');
        params.append('id', editingRoom.id!.toString());
        res = await fetch('/oceanview-backend/room', {
          method: 'POST',
          body: params,
        });
      } else {
        // Add new room
        params.append('action', 'add');
        res = await fetch('/oceanview-backend/room', {
          method: 'POST',
          body: params,
        });
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

      const res = await fetch('/oceanview-backend/room', {
        method: 'POST',
        body: params,
      });

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

  // Filter rooms for search
  const filteredRooms = rooms.filter(
    r =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Room Management</h1>
          <p className="text-gray-500">Manage hotel rooms, pricing, and availability.</p>
        </div>
        <Button onClick={() => handleOpenModal()} leftIcon={<Plus className="h-4 w-4" />}>
          Add Room
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search rooms by name or type..."
            className="pl-10"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map(room => (
          <Card key={room.id} noPadding className="overflow-hidden group">
            <div className="relative h-48 overflow-hidden">
              <img
                src={room.imageUrl}
                alt={room.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-3 right-3 flex gap-2">
                <Badge variant={room.available ? 'success' : 'error'}>
                  {room.available ? 'Available' : 'Unavailable'}
                </Badge>
              </div>
            </div>

            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-serif font-bold text-gray-900">{room.name}</h3>
                  <p className="text-sm text-gray-500">{room.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-ocean-deep">{formatCurrency(room.price)}</p>
                  <p className="text-xs text-gray-500">per night</p>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{room.description}</p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">Capacity: {room.capacity} guests</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(room)}
                    className="p-2 text-gray-400 hover:text-ocean-DEFAULT hover:bg-ocean-50 rounded-lg transition-colors"
                    title="Edit Room"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setRoomToDelete(room);
                      setIsDeleteModalOpen(true);
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Room"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <Card className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No rooms found</h3>
          <p className="text-gray-500 mb-6">Get started by adding your first room.</p>
          <Button onClick={() => handleOpenModal()}>Add Room</Button>
        </Card>
      )}

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
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Room Name */}
          <Input
            label="Room Name *"
            placeholder="Ocean Deluxe King"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />

          {/* Room Type & Availability */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room Type *</label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-100"
              >
                <option value="Standard">Standard</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Suite">Suite</option>
                <option value="Villa">Villa</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
              <select
                value={formData.available ? 'true' : 'false'}
                onChange={e => setFormData({ ...formData, available: e.target.value === 'true' })}
                className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-100"
              >
                <option value="true">Available</option>
                <option value="false">Unavailable</option>
              </select>
            </div>
          </div>

          {/* Price & Capacity */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price per Night (LKR) *"
              type="number"
              value={formData.price}
              onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
            />
            <Input
              label="Capacity (Guests) *"
              type="number"
              min={1}
              value={formData.capacity}
              onChange={e => setFormData({ ...formData, capacity: Number(e.target.value) })}
            />
          </div>

          {/* Image URL */}
          <Input
            label="Image URL *"
            placeholder="https://example.com/room.jpg"
            value={formData.imageUrl}
            onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
          />

          {/* Description */}
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-100 h-24"
            placeholder="Describe room features..."
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />

          {/* Amenities */}
          <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
          <div className="flex gap-2 mb-3">
            <Input
              placeholder="Add amenity (e.g., Free Wi-Fi)"
              value={newAmenity}
              onChange={e => setNewAmenity(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddAmenity())}
            />
            <Button variant="outline" onClick={handleAddAmenity}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.amenities.map(a => (
              <span key={a} className="inline-flex items-center gap-1 px-3 py-1 bg-ocean-50 text-ocean-deep rounded-full text-sm">
                {a}
                <button onClick={() => handleRemoveAmenity(a)} className="hover:text-ocean-DEFAULT">×</button>
              </span>
            ))}
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Room"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete Room</Button>
          </>
        }
      >
        <p>Are you sure you want to delete <strong>{roomToDelete?.name}</strong>? This cannot be undone.</p>
      </Modal>
    </div>
  );
}
