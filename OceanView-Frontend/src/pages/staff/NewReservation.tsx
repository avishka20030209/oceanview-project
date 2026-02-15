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

  // ---------------- Fetch session ----------------
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

  // ---------------- Fetch rooms ----------------
  useEffect(() => {
    fetch('/oceanview-backend/room')
      .then((res) => res.json())
      .then((data) => setRooms(data))
      .catch(() => toast.error('Failed to load rooms'));
  }, []);

  // ---------------- Check room availability ----------------
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

  // ---------------- Calculate totals ----------------
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

  // ---------------- Submit reservation ----------------
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

    // For CUSTOMER, guestName/email is auto-filled from session
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

  // ---------------- Render ----------------
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">New Reservation</h1>
        <p className="text-gray-500">Create a new booking for a guest.</p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between items-center mb-8 px-12">
        {[
          { num: 1, label: 'Room Selection', icon: Calendar },
          { num: 2, label: 'Guest Details', icon: User },
          { num: 3, label: 'Review & Confirm', icon: CheckCircle }
        ].map((s) => (
          <div
            key={s.num}
            className={`flex flex-col items-center ${step >= s.num ? 'text-ocean-DEFAULT' : 'text-gray-400'}`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 border-2 ${
                step >= s.num ? 'border-ocean-DEFAULT bg-ocean-50' : 'border-gray-200 bg-white'
              }`}
            >
              <s.icon className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium">{s.label}</span>
          </div>
        ))}
      </div>

      <Card>
        {/* Step 1: Room & Dates */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Select Room & Dates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                <select
                  className="w-full h-10 rounded-md border border-gray-300 px-3 py-2"
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
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 flex gap-4">
                <img src={selectedRoom.imageUrl} alt={selectedRoom.name} className="w-24 h-24 object-cover rounded-md" />
                <div>
                  <h3 className="font-medium text-gray-900">{selectedRoom.name}</h3>
                  <p className="text-sm text-gray-500">{selectedRoom.description}</p>
                  <p className="text-ocean-DEFAULT font-bold mt-1">{formatCurrency(selectedRoom.price)} / night</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              <Button
                onClick={checkAvailability}
                disabled={!selectedRoom || !formData.checkIn || !formData.checkOut || loadingAvailability}
              >
                {loadingAvailability ? 'Checking...' : 'Check Availability'}
              </Button>
              {availability !== null && (
                <span className={`font-medium ${availability ? 'text-green-600' : 'text-red-600'}`}>
                  {availability ? 'Available' : 'Not Available'}
                </span>
              )}
            </div>

            <div className="flex justify-end">
              <Button onClick={nextStep} disabled={!availability}>Next Step</Button>
            </div>
          </div>
        )}

        {/* Step 2: Guest Details */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Guest Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                value={formData.guestName}
                onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                disabled={session?.role === 'CUSTOMER'} // ✅ disable if customer
              />
              <Input
                label="Phone Number"
                value={formData.guestPhone}
                onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
              />
              <Input
                label="Email"
                type="email"
                value={formData.guestEmail}
                onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                disabled={session?.role === 'CUSTOMER'} // ✅ disable if customer
              />
              <Input
                label="Customer ID (Optional)"
                value={formData.guestId}
                onChange={(e) => setFormData({ ...formData, guestId: e.target.value })}
              />
            </div>
            <div className="flex justify-between">
              <Button variant="ghost" onClick={prevStep}>Back</Button>
              <Button
                onClick={nextStep}
                disabled={!formData.guestName || !formData.guestPhone || !formData.guestEmail}
              >
                Next Step
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Confirm */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Review & Confirm</h2>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-4">
              <div className="flex justify-between border-b border-gray-200 pb-4">
                <div>
                  <p className="text-sm text-gray-500">Guest</p>
                  <p className="font-medium">{formData.guestName}</p>
                  <p className="text-sm text-gray-500">{formData.guestPhone}</p>
                  <p className="text-sm text-gray-500">{formData.guestEmail}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Dates</p>
                  <p className="font-medium">{formData.checkIn} to {formData.checkOut}</p>
                </div>
              </div>

              {/* Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Room Charges ({calculateNights()} nights)</span>
                  <span>{formatCurrency(calculateRoomTotal())}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Service Charge (10%)</span>
                  <span>{formatCurrency(calculateServiceCharge())}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>VAT (15%)</span>
                  <span>{formatCurrency(calculateVAT())}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 font-bold text-ocean-deep">
                  <span>Total</span>
                  <span>{formatCurrency(calculateGrandTotal())}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="ghost" onClick={prevStep}>Back</Button>
              <Button onClick={handleSubmit} size="lg">Create Reservation</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
