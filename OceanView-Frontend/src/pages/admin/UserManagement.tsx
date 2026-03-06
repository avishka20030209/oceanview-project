import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { toast } from 'sonner';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  avatar?: string;
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'STAFF',
    phone: '',
    password: ''
  });

  const fetchUsers = async () => {
    try {
      const res = await fetch('/oceanview-backend/user');
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();

      const mapped: User[] = data.map((u: any) => ({
        id: u.id,
        name: u.fullName,
        email: u.email,
        role: u.role,
        phone: u.phone,
      }));

      setUsers(mapped);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || '',
        password: ''
      });
    } else {
      setEditingUser(null);
      setFormData({ name: '', email: '', role: 'STAFF', phone: '', password: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || (!editingUser && !formData.password)) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      let res: Response;
      const payload = new URLSearchParams();
      payload.append('fullName', formData.name);
      payload.append('email', formData.email);
      payload.append('role', formData.role);
      payload.append('phone', formData.phone);

      if (!editingUser) payload.append('password', formData.password);

      if (editingUser) {
        payload.append('id', editingUser.id.toString());
        res = await fetch(`/oceanview-backend/user?action=update`, {
          method: 'POST',
          body: payload
        });
      } else {
        res = await fetch(`/oceanview-backend/user?action=register`, {
          method: 'POST',
          body: payload
        });
      }

      const result = await res.json();
      if (result.status === 'success') {
        toast.success(editingUser ? 'User updated successfully' : 'User added successfully');
        setIsModalOpen(false);
        fetchUsers();
      } else {
        toast.error(result.message || 'Operation failed');
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      const res = await fetch(
        `/oceanview-backend/user?action=delete&id=${userToDelete.id}`,
        { method: 'POST' }
      );

      const result = await res.json();
      if (result.status === 'success') {
        toast.success('User deleted successfully');
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
        fetchUsers();
      } else {
        toast.error(result.message || 'Delete failed');
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-8 space-y-8">

      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight">
            User Management
          </h1>
          <p className="text-emerald-100 mt-2">
            Manage resort staff and administrative access
          </p>
        </div>
      </div>

      {/*Stats*/}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-md border border-emerald-100">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">
            {users.length}
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-md border border-emerald-100">
          <p className="text-sm text-gray-500">Admins</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">
            {users.filter(u => u.role === 'ADMIN').length}
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-md border border-emerald-100">
          <p className="text-sm text-gray-500">Staff</p>
          <p className="text-2xl font-bold text-teal-600 mt-1">
            {users.filter(u => u.role === 'STAFF').length}
          </p>
        </div>

      </div>

      {/* 🌴 Search + Add Button */}
      <div className="flex flex-col md:flex-row justify-between gap-4 items-center">

        <div className="flex items-center bg-white/70 backdrop-blur-lg border border-emerald-100 rounded-2xl px-4 py-3 shadow-md w-full md:w-1/3">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-0 focus:ring-0 bg-transparent"
          />
        </div>

        <Button
          onClick={() => handleOpenModal()}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md"
          leftIcon={<Plus size={16} />}
        >
          Add User
        </Button>

      </div>

      {/* 🌊 Users Grid */}
      <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 p-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl p-6 shadow-md border border-emerald-100 hover:shadow-xl transition"
            >
              <h2 className="text-lg font-semibold text-emerald-900">
                {user.name}
              </h2>
              <p className="text-sm text-gray-600 mt-1">{user.email}</p>

              <span
                className={`inline-block mt-3 px-3 py-1 text-xs rounded-full font-semibold ${
                  user.role === 'ADMIN'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {user.role}
              </span>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => handleOpenModal(user)}
                  className="p-2 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition"
                >
                  <Edit2 size={16} />
                </button>

                <button
                  onClick={() => {
                    setUserToDelete(user);
                    setIsDeleteModalOpen(true);
                  }}
                  className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

        </div>

      </div>

      {/* Modals unchanged */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Edit User' : 'Add User'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>
              {editingUser ? 'Save Changes' : 'Create User'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Full Name" value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <Input label="Email" type="email" value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <Input label="Phone" value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          {!editingUser && (
            <Input label="Password" type="password" value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          )}
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full h-10 rounded-md border border-emerald-200 px-3 text-sm"
          >
            <option value="STAFF">Staff</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete User"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </>
        }
      >
        <p>
          Are you sure you want to delete <strong>{userToDelete?.name}</strong>?
        </p>
      </Modal>

    </div>
  );
}
