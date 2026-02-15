import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { ArrowLeft, Check, Users, Info } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import { toast } from 'sonner';
import { Modal } from '../../components/ui/Modal';
import { Room } from '../../types';

const SERVICE_CHARGE_RATE = 0.10;
const VAT_RATE = 0.18;

export function RoomDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showConfirmBooking, setShowConfirmBooking] = useState(false);
  const [afterLoginBooking, setAfterLoginBooking] = useState(false);

  // TODO: Replace with real session userId
  const userId = 1;

  // ---------------- FETCH ROOM ----------------
  useEffect(() => {
    fetch('/oceanview-backend/room')
      .then(res => res.json())
      .then((data: Room[]) => {
        const roomId = Number(id);
        setRoom(data.find(r => r.id === roomId) || null);
      })
      .catch(err => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  // ---------------- RESET AVAILABILITY ON DATE CHANGE ----------------
  useEffect(() => {
    setIsAvailable(null);
  }, [checkIn, checkOut]);

  // ---------------- NIGHTS ----------------
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    if (end <= start) return 0;

    const diff = end.getTime() - start.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, [checkIn, checkOut]);

  // ---------------- BILL ----------------
  const bill = useMemo(() => {
    if (!room || nights <= 0) return null;

    const base = room.price * nights;
    const serviceCharge = base * SERVICE_CHARGE_RATE;
    const vat = (base + serviceCharge) * VAT_RATE;
    const total = Math.round(base + serviceCharge + vat);

    return { nights, base, serviceCharge, vat, total };
  }, [room, nights]);

  // ---------------- AVAILABILITY ----------------
  const handleCheckAvailability = () => {
    if (!checkIn || !checkOut) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    if (nights <= 0) {
      toast.error('Check-out must be after check-in');
      return;
    }

    // Here we simulate availability as always true for demo
    setCheckingAvailability(true);
    setTimeout(() => {
      setIsAvailable(true);
      setCheckingAvailability(false);
    }, 500);
  };

  // ---------------- BOOKING ----------------
  const handleBookNow = async () => {
    if (!room || !bill) return;

    try {
      const formData = new URLSearchParams();
      formData.append('action', 'add');
      formData.append('userId', String(userId));
      formData.append('roomId', String(room.id));
      formData.append('roomName', room.name);
      formData.append('guestName', 'Guest');
      formData.append('checkIn', checkIn);
      formData.append('checkOut', checkOut);
      formData.append('status', 'PENDING');
      formData.append('amount', String(bill.total));

      const res = await fetch('/oceanview-backend/reservation', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const data = await res.json();

      if (data.status === 'error' && data.message.includes('log in')) {
        setShowLoginModal(true);
        setAfterLoginBooking(true);
        return;
      }

      if (data.status === 'success') {
        toast.success('Booking confirmed!');
        navigate('/customer/my-bookings');
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error('Booking failed');
    }
  };

  useEffect(() => {
    if (afterLoginBooking) {
      setAfterLoginBooking(false);
      handleBookNow();
    }
  }, [afterLoginBooking]);

  // ---------------- UI STATES ----------------
  if (loading) return <div className="p-12 text-center">Loading...</div>;
  if (!room) return <div className="p-12 text-center">Room not found</div>;

  const amenitiesList = room.amenities.split(',').map(a => a.trim());

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* LEFT SIDE DETAILS */}
        <div className="space-y-6">
          <h1 className="text-4xl font-serif font-bold">{room.name}</h1>
          <div className="flex items-center gap-3 text-gray-500">
            <span className="px-2 py-1 bg-ocean-50 text-ocean-deep rounded text-xs font-semibold">
              {room.type}
            </span>
            <Users className="h-4 w-4" />
            {room.maxGuests} Guests
          </div>
          <p className="text-gray-700">{room.description}</p>

          <h3 className="text-xl font-bold mt-6">Amenities</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {amenitiesList.map(a => (
              <div key={a} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <Check className="h-4 w-4 text-ocean-DEFAULT" />
                <span className="text-sm">{a}</span>
              </div>
            ))}
          </div>

          {/* AVAILABILITY & BILL */}
          <Card className="mt-6 p-6">
            <h3 className="text-xl font-bold mb-4">Check Availability</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Input
                label="Check-in"
                type="date"
                value={checkIn}
                onChange={e => setCheckIn(e.target.value)}
              />
              <Input
                label="Check-out"
                type="date"
                min={checkIn}
                value={checkOut}
                onChange={e => setCheckOut(e.target.value)}
              />
            </div>

            <Button
              className="w-full mb-4"
              onClick={handleCheckAvailability}
              disabled={checkingAvailability}
            >
              {checkingAvailability ? 'Checking...' : 'Check Availability'}
            </Button>

            {isAvailable !== null && (
              <div className={`p-4 rounded ${isAvailable ? 'bg-green-50' : 'bg-red-50'}`}>
                {isAvailable ? (
                  <>
                    <p className="flex items-center gap-2 text-green-700 font-medium">
                      <Check className="h-4 w-4" /> Room Available
                    </p>

                    {/* BILL */}
                    {bill && (
                      <div className="mt-4 space-y-2 text-sm bg-white p-4 rounded shadow">
                        <div className="flex justify-between">
                          <span>Room ({bill.nights} nights)</span>
                          <span>{formatCurrency(bill.base)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Service Charge (10%)</span>
                          <span>{formatCurrency(bill.serviceCharge)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>VAT (18%)</span>
                          <span>{formatCurrency(bill.vat)}</span>
                        </div>
                        <div className="flex justify-between font-bold border-t pt-2">
                          <span>Total</span>
                          <span>{formatCurrency(bill.total)}</span>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="flex items-center gap-2 text-red-700">
                    <Info className="h-4 w-4" /> Not available
                  </p>
                )}
              </div>
            )}

            {isAvailable && (
              <Button
                className="w-full mt-4"
                onClick={() => setShowConfirmBooking(true)}
              >
                Book Now
              </Button>
            )}
          </Card>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="rounded-3xl overflow-hidden shadow-2xl">
          <img
            src={room.imageUrl}
            alt={room.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* CONFIRM BOOKING MODAL */}
      <Modal
        isOpen={showConfirmBooking}
        onClose={() => setShowConfirmBooking(false)}
        title="Confirm Booking"
        size="sm"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setShowConfirmBooking(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowConfirmBooking(false);
                handleBookNow();
              }}
            >
              Confirm
            </Button>
          </div>
        }
      >
        <p className="text-center py-4">
          Please confirm your booking for <strong>{room.name}</strong> from <strong>{checkIn}</strong> to <strong>{checkOut}</strong>.
        </p>
      </Modal>

      {/* LOGIN MODAL */}
      <Modal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="Login Required"
        size="sm"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setShowLoginModal(false)}>Cancel</Button>
            <Button onClick={() => navigate('/login')}>Go to Login</Button>
          </div>
        }
      >
        <div className="text-center py-4">
          <Users className="h-10 w-10 mx-auto text-ocean-DEFAULT mb-3" />
          <p>You need to login to continue booking.</p>
        </div>
      </Modal>
    </div>
  );
}
