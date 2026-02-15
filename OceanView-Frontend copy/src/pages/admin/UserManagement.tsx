import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { toast } from 'sonner';

interface User {
  id: number;
  name: string; // mapped from fullName
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
    password: '' // NEW: password for new user
  });

  // Fetch all users from backend
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
        avatar: `https://ui-avatars.com/api/?name=${u.fullName}&background=random`
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
        password: '' // leave empty when editing
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
      const res = await fetch(`/oceanview-backend/user?action=delete&id=${userToDelete.id}`, {
        method: 'POST'
      });
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

  const columns = [
    {
      header: 'User',
      accessor: (user: User) => (
        <div className="flex items-center gap-3">
          <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full" />
          <div>
            <div className="font-medium text-gray-900">{user.name}</div>
            <div className="text-xs text-gray-500">{user.email}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Role',
      accessor: (user: User) => (
        <Badge variant={user.role === 'ADMIN' ? 'info' : 'success'}>{user.role}</Badge>
      )
    },
    {
      header: 'Actions',
      accessor: (user: User) => (
        <div className="flex gap-2">
          <button onClick={() => handleOpenModal(user)} className="p-1 text-gray-400 hover:text-ocean-DEFAULT transition-colors">
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              setUserToDelete(user);
              setIsDeleteModalOpen(true);
            }}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500">Manage system access and staff roles.</p>
        </div>
        <Button onClick={() => handleOpenModal()} leftIcon={<Plus className="h-4 w-4" />}>
          Add User
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users by name or email..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Table data={filteredUsers} columns={columns} />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Edit User' : 'Add New User'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{editingUser ? 'Save Changes' : 'Create User'}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Input
            label="Phone"
            placeholder="0123456789"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          {!editingUser && (
            <Input
              label="Password"
              type="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-100"
            >
              <option value="STAFF">Staff</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete User"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete User</Button>
          </>
        }
      >
        <p className="text-gray-600">
          Are you sure you want to delete <strong>{userToDelete?.name}</strong>? This cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
