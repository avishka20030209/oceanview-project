import React, { useEffect, useState, useCallback } from 'react';
import { DollarSign, Users, Calendar, BedDouble } from 'lucide-react';
import { StatCard } from '../../components/StatCard';
import { Card } from '../../components/ui/Card';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { format } from 'date-fns';
import { formatCurrency } from '../../utils/format';

interface Reservation {
  id: number;
  userId?: number;
  roomId?: number;
  guestName: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  status: string;
  amount: number;
  paid?: boolean;
}

export function AdminDashboard() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const totalRooms = 60; // total rooms in your hotel

  const fetchReservations = useCallback(async () => {
    try {
      const res = await fetch('/oceanview-backend/reservation?action=adminAll', {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.status === 'success' && Array.isArray(data.reservations)) {
        setReservations(data.reservations);
      } else {
        setReservations([]);
      }
    } catch (err: any) {
      console.error(err.message);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  // Stats Calculations
  const confirmedBookings = reservations.filter((r) => r.status.toUpperCase() === 'CONFIRMED').length;
  const pendingBookings = reservations.filter((r) => r.status.toUpperCase() === 'PENDING').length;
  const activeBookings = confirmedBookings + pendingBookings;
  const revenue = reservations.filter((r) => r.status.toUpperCase() === 'CHECKED_OUT' && r.paid)
    .reduce((sum, r) => sum + (r.amount || 0), 0);
  const occupancyRate = totalRooms > 0 ? Math.round((activeBookings / totalRooms) * 100) : 0;
  const totalGuests = reservations.length;

  // Pie chart data
  const bookingData = [
    { name: 'Confirmed', value: confirmedBookings, color: '#10B981' },
    { name: 'Pending', value: pendingBookings, color: '#14B8A6' },
    { name: 'Other', value: totalRooms - activeBookings, color: '#6EE7B7' },
  ];

  // Revenue chart data
  const revenueByDate: { [key: string]: number } = {};
  reservations.forEach((r) => {
    if (!r.checkIn) return;
    const date = format(new Date(r.checkIn), 'yyyy-MM-dd');
    revenueByDate[date] = (revenueByDate[date] || 0) + (r.amount || 0);
  });

  const revenueChartData = Object.entries(revenueByDate)
    .map(([date, rev]) => ({ date, revenue: rev }))
    .sort((a, b) => (a.date > b.date ? 1 : -1));

  const recentActivity = [...reservations]
    .sort((a, b) => new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime())
    .slice(0, 5);

  if (loading) return <div className="p-12 text-center text-teal-700">Loading dashboard...</div>;

  return (
   <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6 flex flex-col space-y-8">

  {/* Header */}
  <div className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-2xl p-6 shadow-lg mb-6">
    <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
    <p className="text-emerald-100 mt-1">Welcome back! Here's your Ocean View dashboard.</p>
  </div>

  {/* Stats Cards */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {[
      { title: 'Total Revenue', value: formatCurrency(revenue), icon: DollarSign, description: 'Confirmed bookings revenue', color: 'emerald' },
      { title: 'Active Bookings', value: activeBookings.toString(), icon: Calendar, description: 'Currently active', color: 'teal' },
      { title: 'Occupancy Rate', value: `${occupancyRate}%`, icon: BedDouble, description: `${totalRooms - activeBookings} rooms available`, color: 'lime' },
      { title: 'Total Guests', value: totalGuests.toString(), icon: Users, description: 'Total bookings', color: 'emerald' },
    ].map((stat) => (
      <div key={stat.title} className="group relative bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 p-6 border border-emerald-100 hover:-translate-y-1">
        {/* Soft Glow Hover Effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-400/0 via-teal-300/0 to-cyan-300/0 group-hover:from-emerald-400/10 group-hover:via-teal-300/10 group-hover:to-cyan-300/10 transition-all duration-500 pointer-events-none" />
        <div className="flex items-center gap-4">
          <stat.icon className={`h-8 w-8 text-${stat.color}-500`} />
          <div>
            <p className="text-sm text-gray-400">{stat.title}</p>
            <p className="text-xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
          </div>
        </div>
      </div>
    ))}
  </div>

  {/* Charts and Recent Activities */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* Booking Pie Chart */}
    <div className="group relative bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 p-6 border border-emerald-100 hover:-translate-y-1">
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-400/0 via-teal-300/0 to-cyan-300/0 group-hover:from-emerald-400/10 group-hover:via-teal-300/10 group-hover:to-cyan-300/10 transition-all duration-500 pointer-events-none" />
      <h3 className="text-teal-900 font-bold mb-4">Bookings Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={bookingData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={(entry) => `${entry.name}: ${entry.value}`}>
            {bookingData.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>

    {/* Revenue Bar Chart */}
    <div className="group relative bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 p-6 border border-emerald-100 hover:-translate-y-1">
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-400/0 via-teal-300/0 to-cyan-300/0 group-hover:from-emerald-400/10 group-hover:via-teal-300/10 group-hover:to-cyan-300/10 transition-all duration-500 pointer-events-none" />
      <h3 className="text-teal-900 font-bold mb-4">Revenue Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={revenueChartData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#D1FAE5" />
          <XAxis dataKey="date" tick={{ fill: '#065F46', fontSize: 12 }} />
          <YAxis tick={{ fill: '#065F46', fontSize: 12 }} tickFormatter={(val) => `LKR ${(val / 1000).toFixed(1)}k`} />
          <Tooltip formatter={(value: number) => [`LKR ${value.toLocaleString()}`, 'Revenue']} />
          <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>

    {/* Recent Activities */}
    <div className="group relative bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 p-6 border border-emerald-100 hover:-translate-y-1">
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-400/0 via-teal-300/0 to-cyan-300/0 group-hover:from-emerald-400/10 group-hover:via-teal-300/10 group-hover:to-cyan-300/10 transition-all duration-500 pointer-events-none" />
      <h3 className="text-teal-900 font-bold mb-4">Recent Activities</h3>
      <div className="space-y-4">
        {recentActivity.length > 0 ? (
          recentActivity.map((r) => (
            <div key={r.id} className="group relative flex gap-4 items-center p-3 rounded-2xl bg-white hover:shadow-lg transition-all">
              <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-800 font-bold">
                {r.guestName.split(' ').map((n) => n[0]).join('').toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-teal-900 font-medium text-sm group-hover:text-teal-800">
                  New reservation confirmed
                </p>
                <p className="text-teal-800 text-xs">{r.guestName} booked {r.roomName}</p>
                <p className="text-teal-600 text-xs mt-1">{format(new Date(r.checkIn), 'MMM d, yyyy')}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-teal-500 text-sm text-center py-4">No recent activity</p>
        )}
      </div>
    </div>
  </div>
</div>

  );
}
