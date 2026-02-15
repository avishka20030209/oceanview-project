import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, Clock, Search, ArrowRight } from 'lucide-react';
import { StatCard } from '../../components/StatCard';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
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

  // ---------------- Fetch reservations from backend ----------------
  const fetchReservations = async () => {
    try {
      const res = await fetch('/oceanview-backend/reservation?action=adminAll');
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

  // ---------------- Quick Search ----------------
  const handleQuickSearch = () => {
    if (!quickSearch.trim()) return;

    const found = reservations.find(
      (r) =>
        r.id.toString() === quickSearch ||
        r.guestName.toLowerCase().includes(quickSearch.toLowerCase())
    );

    if (found) {
      navigate(`/staff/reservation/${found.id}`);
      toast.success('Reservation found!');
    } else {
      toast.error('No reservation found with that ID or Name');
    }
  };

  // ---------------- Today's Check-ins ----------------
  const todayCheckIns = reservations
    .filter((r) => r.status === 'CONFIRMED')
    .slice(0, 3);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Dashboard</h1>
          <p className="text-gray-500">
            Good morning! Here's your daily overview.
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-serif font-bold text-ocean-deep">
            {format(new Date(), 'h:mm a')}
          </p>
          <p className="text-sm text-gray-500">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Arrivals Today"
          value={reservations.filter((r) => r.status === 'CONFIRMED').length.toString()}
          icon={Calendar}
          color="blue"
        />
        <StatCard
          title="Departures Today"
          value={reservations.filter((r) => r.status === 'CHECKED_OUT').length.toString()}
          icon={CheckCircle}
          color="orange"
        />
        <StatCard
          title="Pending Requests"
          value={reservations.filter((r) => r.status === 'PENDING').length.toString()}
          icon={Clock}
          color="purple"
        />
      </div>

      {/* Quick Search & Check-ins */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Search */}
          <Card
            title="Quick Search"
            description="Find a reservation by guest name or confirmation number"
          >
            <div className="flex gap-3">
              <Input
                placeholder="Enter guest name or ID..."
                className="flex-1"
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleQuickSearch()}
              />
              <Button
                leftIcon={<Search className="h-4 w-4" />}
                onClick={handleQuickSearch}
              >
                Search
              </Button>
            </div>
          </Card>

          {/* Today's Check-ins */}
          <Card title="Today's Check-ins">
            <div className="space-y-4">
              {todayCheckIns.map((res) => (
                <div
                  key={res.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-ocean-100 text-ocean-deep flex items-center justify-center font-bold">
                      {res.guestName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{res.guestName}</p>
                      <p className="text-xs text-gray-500">
                        {res.roomName} • {res.id}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
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
          </Card>
        </div>

        {/* Quick Actions / Notices */}
        <div className="space-y-6">
          <Card title="Quick Actions">
            <div className="space-y-3">
              <Button
                className="w-full justify-between"
                variant="secondary"
                onClick={() => navigate('/staff/new-reservation')}
              >
                New Reservation <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                className="w-full justify-between"
                variant="secondary"
                onClick={() => navigate('/staff/billing')}
              >
                Create Invoice <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                className="w-full justify-between"
                variant="secondary"
                onClick={() => navigate('/staff/search')}
              >
                Search Records <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>

          <Card className="bg-ocean-deep text-white">
            <h3 className="font-serif font-bold text-lg mb-2">Staff Notice</h3>
            <p className="text-ocean-100 text-sm mb-4">
              Pool maintenance is scheduled for tomorrow morning (8 AM - 11 AM). Please inform guests.
            </p>
            <div className="text-xs text-ocean-300">
              Posted by Admin • 2 hours ago
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
