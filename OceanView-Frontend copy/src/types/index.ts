export type UserRole = 'ADMIN' | 'STAFF' | 'CUSTOMER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Room {
  maxGuests: any;
  id: string;
  name: string;
  type: 'Deluxe' | 'Suite' | 'Villa' | 'Standard';
  price: number;
  capacity: number;
  amenities: string[];
  description: string;
  imageUrl: string;
  available: boolean;
}

export interface Reservation {
  id: string;
  guestName: string;
  guestEmail: string;
  roomId: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'CHECKED_IN' | 'CHECKED_OUT';
  totalAmount: number;
  createdAt: string;
}

export interface RevenueData {
  name: string;
  revenue: number;
  occupancy: number;
}