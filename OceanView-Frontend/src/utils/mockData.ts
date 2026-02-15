import { Room, Reservation, User, RevenueData } from '../types';

export const mockRooms: Room[] = [
{
  id: '101',
  name: 'Ocean Deluxe King',
  type: 'Deluxe',
  price: 45000, // LKR
  capacity: 2,
  amenities: ['Ocean View', 'King Bed', 'Balcony', 'Mini Bar', 'Free Wi-Fi'],
  description:
  'Wake up to the sound of waves in our spacious Deluxe King room featuring panoramic ocean views. Includes a private balcony for sunset watching.',
  imageUrl:
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000',
  available: true
},
{
  id: '102',
  name: 'Garden Suite',
  type: 'Suite',
  price: 65000, // LKR
  capacity: 4,
  amenities: [
  'Garden View',
  '2 Queen Beds',
  'Living Area',
  'Kitchenette',
  'Patio'],

  description:
  'Perfect for families, our Garden Suite offers direct access to the resort gardens and pool area. Features a separate living area.',
  imageUrl:
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=1000',
  available: true
},
{
  id: '103',
  name: 'Royal Villa',
  type: 'Villa',
  price: 150000, // LKR
  capacity: 6,
  amenities: [
  'Private Pool',
  'Ocean Front',
  'Butler Service',
  '3 Bedrooms',
  'Full Kitchen'],

  description:
  'The ultimate luxury experience. Our Royal Villa features a private infinity pool, dedicated butler service, and direct beach access.',
  imageUrl:
  'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=1000',
  available: false
},
{
  id: '104',
  name: 'Standard Twin',
  type: 'Standard',
  price: 25000, // LKR
  capacity: 2,
  amenities: ['Resort View', '2 Twin Beds', 'Work Desk', 'Coffee Maker'],
  description:
  'Comfortable and stylish, our Standard Twin rooms provide everything you need for a relaxing stay at an affordable rate.',
  imageUrl:
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=1000',
  available: true
}];


export const mockReservations: Reservation[] = [
{
  id: 'RES-001',
  guestName: 'Sarah Johnson',
  guestEmail: 'sarah.j@example.com',
  roomId: '101',
  roomName: 'Ocean Deluxe King',
  checkIn: '2024-06-15',
  checkOut: '2024-06-20',
  status: 'CONFIRMED',
  totalAmount: 225000,
  createdAt: '2024-05-01'
},
{
  id: 'RES-002',
  guestName: 'Michael Chen',
  guestEmail: 'm.chen@example.com',
  roomId: '103',
  roomName: 'Royal Villa',
  checkIn: '2024-06-18',
  checkOut: '2024-06-25',
  status: 'CHECKED_IN',
  totalAmount: 1050000,
  createdAt: '2024-04-15'
},
{
  id: 'RES-003',
  guestName: 'Emma Wilson',
  guestEmail: 'emma.w@example.com',
  roomId: '102',
  roomName: 'Garden Suite',
  checkIn: '2024-07-01',
  checkOut: '2024-07-05',
  status: 'PENDING',
  totalAmount: 260000,
  createdAt: '2024-06-10'
}];


export const mockUsers: User[] = [
{
  id: '1',
  name: 'Admin User',
  email: 'admin@oceanview.com',
  role: 'ADMIN',
  avatar:
  'https://ui-avatars.com/api/?name=Admin+User&background=0A2463&color=fff'
},
{
  id: '2',
  name: 'Staff Member',
  email: 'staff@oceanview.com',
  role: 'STAFF',
  avatar:
  'https://ui-avatars.com/api/?name=Staff+Member&background=3B82F6&color=fff'
}];


export const mockRevenue: RevenueData[] = [
{ name: 'Jan', revenue: 4500000, occupancy: 65 },
{ name: 'Feb', revenue: 5200000, occupancy: 70 },
{ name: 'Mar', revenue: 4800000, occupancy: 68 },
{ name: 'Apr', revenue: 6100000, occupancy: 75 },
{ name: 'May', revenue: 5500000, occupancy: 72 },
{ name: 'Jun', revenue: 7500000, occupancy: 85 },
{ name: 'Jul', revenue: 8900000, occupancy: 92 }];