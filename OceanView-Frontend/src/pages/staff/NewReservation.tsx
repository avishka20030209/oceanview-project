import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { toast } from 'sonner';
import { Calendar, User, CheckCircle } from 'lucide-react';

// Utility to format LKR
const formatCurrency = (amount: number) =>
  `LKR ${amount.toLocaleString('en-LK', { minimumFractionDigits: 2 })}`;

interface SessionData {
  userId: number;
  fullName: string;
  email: string;
  role: string; // "CUSTOMER" or "STAFF"
}

export function NewReservation() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [rooms, setRooms] = useState<any[]>([]);
  const [availability, setAvailability] = useState<boolean | null>(null);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [session, setSession] = useState<SessionData | null>(null);

  const [formData, setFormData] = useState({
    roomId: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    guestName: '',
    guestPhone: '',
    guestEmail: '',
    guestId: '',
    specialRequests: ''
  });

  const selectedRoom = rooms.find((r) => r.id === parseInt(formData.roomId));

  //  Fetch session
  useEffect(() => {
    fetch('/oceanview-backend/user?action=session', { credentials: 'include' })
      .then((res) => res.json())
      .then((data: SessionData) => {
        setSession(data);
        if (data.role === 'CUSTOMER') {
          setFormData((prev) => ({
            ...prev,
            guestName: data.fullName,
            guestEmail: data.email
          }));
        }
      })
      .catch(() => toast.error('Failed to load user session'));
  }, []);

  // Fetch rooms 
  useEffect(() => {
    fetch('/oceanview-backend/room')
      .then((res) => res.json())
      .then((data) => setRooms(data))
      .catch(() => toast.error('Failed to load rooms'));
  }, []);

  // Check room availability 
  const checkAvailability = () => {
    if (!selectedRoom || !formData.checkIn || !formData.checkOut) return;
    setLoadingAvailability(true);

    const params = new URLSearchParams();
    params.append('roomId', String(selectedRoom.id));
    params.append('checkIn', formData.checkIn);
    params.append('checkOut', formData.checkOut);

    fetch('/oceanview-backend/room/checkAvailability?' + params.toString(), {
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((data) => {
        setLoadingAvailability(false);
        if (typeof data.available === 'boolean') {
          setAvailability(data.available);
          if (!data.available) toast.error('Selected room is not available for these dates');
          else toast.success('Room is available!');
        } else {
          toast.error(data.error || 'Failed to check availability');
        }
      })
      .catch(() => {
        setLoadingAvailability(false);
        toast.error('Error checking availability');
      });
  };

  // Calculate totals

  const calculateNights = () => {
    if (!selectedRoom || !formData.checkIn || !formData.checkOut) return 0;
    const start = new Date(formData.checkIn);
    const end = new Date(formData.checkOut);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const calculateRoomTotal = () => {
    const nights = calculateNights();
    return nights > 0 && selectedRoom ? nights * selectedRoom.price : 0;
  };

  const calculateServiceCharge = () => calculateRoomTotal() * 0.1; // 10%
  const calculateVAT = () => calculateRoomTotal() * 0.15; // 15%
  const calculateGrandTotal = () => calculateRoomTotal() + calculateServiceCharge() + calculateVAT();

  // Submit reservation
  const handleSubmit = () => {
    if (!selectedRoom || availability === false) {
      toast.error('Cannot submit: room not available');
      return;
    }

    const params = new URLSearchParams();
    params.append('action', 'add');
    params.append('roomName', selectedRoom.name);
    params.append('checkIn', formData.checkIn);
    params.append('checkOut', formData.checkOut);
    params.append('amount', String(calculateGrandTotal()));
    params.append('guestName', formData.guestName);
    params.append('guestPhone', formData.guestPhone || '');
    params.append('guestEmail', formData.guestEmail);
    params.append('guestId', formData.guestId || '');

    fetch('/oceanview-backend/reservation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          toast.success('Reservation created successfully!');
          navigate(session?.role === 'CUSTOMER' ? '/customer/dashboard' : '/staff/dashboard');
        } else {
          toast.error(data.message || 'Failed to create reservation');
        }
      })
      .catch(() => toast.error('Error creating reservation'));
  };

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  return (
  <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6 flex justify-center">
    <div className="w-full max-w-5xl space-y-8">

      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-2xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold tracking-tight">New Reservation</h1>
        <p className="text-emerald-100 mt-1">
          Create a new booking with our tropical luxury system.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between items-center px-6">
        {[
          { num: 1, label: 'Room Selection', icon: Calendar },
          { num: 2, label: 'Guest Details', icon: User },
          { num: 3, label: 'Review & Confirm', icon: CheckCircle }
        ].map((s) => (
          <div key={s.num} className="flex flex-col items-center">
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-full border-2 transition-all duration-300
              ${
                step >= s.num
                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg'
                  : 'border-emerald-200 bg-white text-emerald-400'
              }`}
            >
              <s.icon className="h-5 w-5" />
            </div>
            <span
              className={`text-sm mt-2 font-medium ${
                step >= s.num ? 'text-emerald-700' : 'text-gray-400'
              }`}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Main Card */}
      <div className="group relative bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 p-8 border border-emerald-100">

        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-400/0 via-teal-300/0 to-cyan-300/0 group-hover:from-emerald-400/10 group-hover:via-teal-300/10 group-hover:to-cyan-300/10 transition-all duration-500 pointer-events-none" />

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-8">
            <h2 className="text-xl font-bold text-teal-900">
              Select Room & Dates
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-teal-800 mb-2">
                  Room Type
                </label>
                <select
                  className="w-full h-12 rounded-xl border border-emerald-200 px-4 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                  value={formData.roomId}
                  onChange={(e) => {
                    setFormData({ ...formData, roomId: e.target.value });
                    setAvailability(null);
                  }}
                >
                  <option value="">Select a room...</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name} - {formatCurrency(room.price)}/night
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Check In"
                  type="date"
                  value={formData.checkIn}
                  onChange={(e) => {
                    setFormData({ ...formData, checkIn: e.target.value });
                    setAvailability(null);
                  }}
                />
                <Input
                  label="Check Out"
                  type="date"
                  value={formData.checkOut}
                  onChange={(e) => {
                    setFormData({ ...formData, checkOut: e.target.value });
                    setAvailability(null);
                  }}
                />
              </div>
            </div>

            {selectedRoom && (
              <div className="flex gap-6 p-6 bg-emerald-50 rounded-2xl border border-emerald-200">
                <img
                  src={selectedRoom.imageUrl}
                  alt={selectedRoom.name}
                  className="w-28 h-28 object-cover rounded-xl shadow"
                />
                <div>
                  <h3 className="font-bold text-teal-900 text-lg">
                    {selectedRoom.name}
                  </h3>
                  <p className="text-sm text-teal-700">
                    {selectedRoom.description}
                  </p>
                  <p className="font-bold text-emerald-600 mt-2">
                    {formatCurrency(selectedRoom.price)} / night
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              <Button
                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-6"
                onClick={checkAvailability}
                disabled={!selectedRoom || !formData.checkIn || !formData.checkOut || loadingAvailability}
              >
                {loadingAvailability ? 'Checking...' : 'Check Availability'}
              </Button>

              {availability !== null && (
                <span
                  className={`font-semibold ${
                    availability ? 'text-emerald-600' : 'text-red-500'
                  }`}
                >
                  {availability ? 'Room Available' : 'Not Available'}
                </span>
              )}
            </div>

            <div className="flex justify-end">
              <Button
                className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl px-8"
                onClick={nextStep}
                disabled={!availability}
              >
                Next one
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-8">
            <h2 className="text-xl font-bold text-teal-900">
              Guest Information
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                value={formData.guestName}
                onChange={(e) =>
                  setFormData({ ...formData, guestName: e.target.value })
                }
                disabled={session?.role === 'CUSTOMER'}
              />

              <Input
                label="Phone Number"
                value={formData.guestPhone}
                onChange={(e) =>
                  setFormData({ ...formData, guestPhone: e.target.value })
                }
              />

              <Input
                label="Email"
                type="email"
                value={formData.guestEmail}
                onChange={(e) =>
                  setFormData({ ...formData, guestEmail: e.target.value })
                }
                disabled={session?.role === 'CUSTOMER'}
              />

              <Input
                label="Customer ID (Optional)"
                value={formData.guestId}
                onChange={(e) =>
                  setFormData({ ...formData, guestId: e.target.value })
                }
              />
            </div>

            <div className="flex justify-between">
              <Button
                variant="ghost"
                className="text-emerald-600"
                onClick={prevStep}
              >
                Back
              </Button>

              <Button
                className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl px-8"
                onClick={nextStep}
                disabled={!formData.guestName || !formData.guestPhone || !formData.guestEmail}
              >
                Next one
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-8">
            <h2 className="text-xl font-bold text-teal-900">
              Review & Confirm
            </h2>

            <div className="bg-emerald-50 p-8 rounded-2xl border border-emerald-200 space-y-6">

              <div className="flex justify-between border-b border-emerald-200 pb-4">
                <div>
                  <p className="text-sm text-teal-700">Guest</p>
                  <p className="font-bold text-teal-900">{formData.guestName}</p>
                  <p className="text-sm text-teal-700">{formData.guestPhone}</p>
                  <p className="text-sm text-teal-700">{formData.guestEmail}</p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-teal-700">Dates</p>
                  <p className="font-bold text-teal-900">
                    {formData.checkIn} → {formData.checkOut}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-teal-800">
                <div className="flex justify-between">
                  <span>Room Charges ({calculateNights()} nights)</span>
                  <span>{formatCurrency(calculateRoomTotal())}</span>
                </div>

                <div className="flex justify-between">
                  <span>Service Charge (10%)</span>
                  <span>{formatCurrency(calculateServiceCharge())}</span>
                </div>

                <div className="flex justify-between">
                  <span>VAT (15%)</span>
                  <span>{formatCurrency(calculateVAT())}</span>
                </div>

                <div className="flex justify-between border-t border-emerald-300 pt-3 font-bold text-lg text-emerald-700">
                  <span>Total</span>
                  <span>{formatCurrency(calculateGrandTotal())}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                variant="ghost"
                className="text-emerald-600"
                onClick={prevStep}
              >
                Back
              </Button>

              <Button
                className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:opacity-90 text-white rounded-xl px-10 py-3 shadow-lg"
                onClick={handleSubmit}
              >
                Create Reservation
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  </div>
);

}
