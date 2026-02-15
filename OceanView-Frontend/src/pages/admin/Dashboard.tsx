import React, { useEffect, useState, useCallback } from 'react';
import { DollarSign, Users, Calendar, BedDouble } from 'lucide-react';
import { StatCard } from '../../components/StatCard';
import { Card } from '../../components/ui/Card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
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

  // --------------------------
  // Fetch all reservations
  // --------------------------
  const fetchReservations = useCallback(async () => {
    try {
      const res = await fetch('/oceanview-backend/reservation?action=adminAll', {
        credentials: 'include',
      });
      const data = await res.json();

      if (data.status === 'success' && Array.isArray(data.reservations)) {
        setReservations(data.reservations);
      } else {
        console.warn('Unexpected API response:', data);
        setReservations([]);
      }
    } catch (err: any) {
      console.error('Error fetching reservations:', err.message);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  // --------------------------
  // Remove a reservation locally (after deletion)
  // --------------------------
  const removeReservation = (id: number) => {
    setReservations((prev) => prev.filter((r) => r.id !== id));
  };

  // --------------------------
  // Stats Calculations
  // --------------------------
  const confirmedBookings = reservations.filter(
    (r) => r.status.toUpperCase() === 'CONFIRMED'
  ).length;

  const pendingBookings = reservations.filter(
    (r) => r.status.toUpperCase() === 'PENDING'
  ).length;

  const activeBookings = confirmedBookings + pendingBookings;

  const revenue = reservations
    .filter((r) => r.status.toUpperCase() === 'CHECKED_OUT' && r.paid)
    .reduce((sum, r) => sum + (r.amount || 0), 0);

  const occupancyRate = totalRooms > 0 ? Math.round((activeBookings / totalRooms) * 100) : 0;

  const totalGuests = reservations.length;

  // --------------------------
  // Revenue Chart Data
  // --------------------------
  const revenueByDate: { [key: string]: number } = {};
  reservations.forEach((r) => {
    if (!r.checkIn) return;
    const date = format(new Date(r.checkIn), 'yyyy-MM-dd');
    revenueByDate[date] = (revenueByDate[date] || 0) + (r.amount || 0);
  });

  const revenueChartData = Object.entries(revenueByDate)
    .map(([date, rev]) => ({ name: date, revenue: rev }))
    .sort((a, b) => (a.name > b.name ? 1 : -1));

  // --------------------------
  // Recent Activity
  // --------------------------
  const recentActivity = [...reservations]
    .sort((a, b) => new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime())
    .slice(0, 5);

  if (loading) return <div className="p-12 text-center">Loading dashboard...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back, here's what's happening today.</p>
      </div>

      {/* -------------------- Stats Cards -------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(revenue)}
          icon={DollarSign}
          trend={{ value: 0, isPositive: true }}
          description="Confirmed bookings revenue"
          color="blue"
        />

        <StatCard
          title="Active Bookings"
          value={activeBookings.toString()}
          icon={Calendar}
          trend={{ value: 0, isPositive: true }}
          description="Currently active"
          color="purple"
        />

        <StatCard
          title="Occupancy Rate"
          value={`${occupancyRate}%`}
          icon={BedDouble}
          trend={{ value: 0, isPositive: occupancyRate >= 50 }}
          description={`${totalRooms - activeBookings} rooms available`}
          color="orange"
        />

        <StatCard
          title="Total Guests"
          value={totalGuests.toString()}
          icon={Users}
          trend={{ value: 0, isPositive: true }}
          description="Total bookings"
          color="green"
        />
      </div>

      {/* -------------------- Charts & Recent Activity -------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2" title="Revenue Overview">
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  tickFormatter={(val) => `LKR ${(val / 1000).toFixed(1)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  formatter={(value: number) => [`LKR ${value.toLocaleString()}`, 'Revenue']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Recent Activity">
          <div className="space-y-6">
            {recentActivity.length > 0 ? (
              recentActivity.map((r) => (
                <div key={r.id} className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-ocean-50 flex items-center justify-center flex-shrink-0 text-ocean-DEFAULT text-xs font-bold">
                    {r.guestName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      New reservation confirmed
                    </p>
                    <p className="text-xs text-gray-500">
                      {r.guestName} booked {r.roomName}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {format(new Date(r.checkIn), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No recent activity</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
