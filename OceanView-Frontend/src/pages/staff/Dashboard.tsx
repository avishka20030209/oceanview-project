import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, Clock, Search, ArrowRight } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Reservation {
  id: number;
  guestName: string;
  roomName: string;
  status: string;
  checkIn: string;
  checkOut: string;
  amount: number;
}

export function StaffDashboard() {
  const navigate = useNavigate();

  const [quickSearch, setQuickSearch] = useState('');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  /*  FETCH RESERVATIONS */
  const fetchReservations = async () => {
    try {
      setLoading(true);
      const res = await fetch('/oceanview-backend/reservation?action=adminAll');
      const data = await res.json();

      if (data.status === 'success') {
        setReservations(data.reservations || []);
      } else {
        toast.error(data.message || 'Failed to load reservations');
      }
    } catch (err: any) {
      toast.error(err.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  /*  QUICK SEARCH */

  const handleQuickSearch = () => {
    if (!quickSearch.trim()) {
      toast.error('Please enter a name or ID');
      return;
    }

    const found = reservations.find(
      r =>
        r.id.toString() === quickSearch.trim() ||
        r.guestName.toLowerCase().includes(quickSearch.toLowerCase())
    );

    if (found) {
      navigate(`/staff/reservation/${found.id}`);
      toast.success('Reservation found!');
      setQuickSearch('');
    } else {
      toast.error('No reservation found');
    }
  };

  /*  TODAY CHECK-INS  */
  const todayCheckIns = reservations
    .filter(r => r.status === 'CONFIRMED')
    .slice(0, 3);

 

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6 flex flex-col space-y-8">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-2xl p-6 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Staff Dashboard</h1>
            <p className="text-emerald-100 mt-1">
              Welcome back! Here’s your tropical overview.
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{format(new Date(), 'h:mm a')}</p>
            <p className="text-sm text-emerald-100">
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: 'Arrivals Today',
            value: reservations.filter(r => r.status === 'CONFIRMED').length,
            icon: Calendar,
            color: 'text-emerald-500'
          },
          {
            title: 'Departures Today',
            value: reservations.filter(r => r.status === 'CHECKED_OUT').length,
            icon: CheckCircle,
            color: 'text-teal-500'
          },
          {
            title: 'Pending Requests',
            value: reservations.filter(r => r.status === 'PENDING').length,
            icon: Clock,
            color: 'text-lime-500'
          }
        ].map(stat => (
          <div
            key={stat.title}
            className="bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 border border-emerald-100 hover:-translate-y-1"
          >
            <div className="flex items-center gap-4">
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
              <div>
                <p className="text-sm text-gray-400">{stat.title}</p>
                <p className="text-xl font-bold text-gray-800">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MAIN SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">

          {/* QUICK SEARCH */}
          <div className="bg-white rounded-3xl shadow-md p-6 border border-emerald-100">
            <h3 className="text-teal-900 font-bold mb-4">Quick Search</h3>
            <div className="flex gap-3">
              <Input
                placeholder="Enter guest name or ID..."
                className="flex-1 rounded-xl border-emerald-200 focus:ring-emerald-400"
                value={quickSearch}
                onChange={e => setQuickSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleQuickSearch()}
              />
              <Button
                onClick={handleQuickSearch}
                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-6"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* TODAY CHECK-INS */}
          <div className="bg-white rounded-3xl shadow-md p-6 border border-emerald-100">
            <h3 className="text-teal-900 font-bold mb-4">Today's Check-ins</h3>

            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : todayCheckIns.length === 0 ? (
              <p className="text-gray-500">No arrivals today.</p>
            ) : (
              <div className="space-y-4">
                {todayCheckIns.map(res => (
                  <div
                    key={res.id}
                    className="flex items-center justify-between p-4 rounded-2xl border border-emerald-100 shadow-sm hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        {res.guestName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-teal-900">{res.guestName}</p>
                        <p className="text-xs text-teal-600">
                          {res.roomName} • {res.id}
                        </p>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      className="text-teal-700 border-teal-200 hover:bg-teal-50 rounded-xl"
                      onClick={async () => {
                        try {
                          const resp = await fetch(
                            `/oceanview-backend/reservation?action=updateStatus&id=${res.id}&status=CHECKED_IN`,
                            { method: 'POST' }
                          );
                          const result = await resp.json();

                          if (result.status === 'success') {
                            toast.success('Checked in successfully');
                            fetchReservations();
                          } else {
                            toast.error(result.message || 'Failed to check in');
                          }
                        } catch (err: any) {
                          toast.error(err.message);
                        }
                      }}
                    >
                      Check In
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

       
        <div className="space-y-6">

          {/* QUICK ACTIONS */}
          <div className="bg-white rounded-3xl shadow-md p-6 border border-emerald-100">
            <h3 className="text-teal-900 font-bold mb-4">Quick Actions</h3>

            <div className="space-y-3">
              <Button
                onClick={() => navigate('/staff/new-reservation')}
                className="w-full justify-between bg-teal-500 hover:bg-teal-600 text-white rounded-xl"
              >
                New Reservation <ArrowRight className="h-4 w-4" />
              </Button>

              <Button
                onClick={() => navigate('/staff/billing')}
                className="w-full justify-between bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl"
              >
                Create Invoice <ArrowRight className="h-4 w-4" />
              </Button>

              <Button
                onClick={() => navigate('/staff/search')}
                className="w-full justify-between bg-lime-500 hover:bg-lime-600 text-white rounded-xl"
              >
                Search Records <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* STAFF NOTICE */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-3xl shadow-lg p-6">
            <h3 className="font-bold text-lg mb-2">Staff Notice</h3>
            <p className="text-emerald-100 text-sm mb-4">
              Pool maintenance is scheduled for tomorrow morning (8 AM - 11 AM).
              Please inform guests.
            </p>
            <div className="text-xs text-emerald-200">
              Posted by Admin • 2 hours ago
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
