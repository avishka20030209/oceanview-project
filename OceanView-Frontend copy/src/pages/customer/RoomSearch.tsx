import React, { useEffect, useState } from 'react';
import { RoomCard } from '../../components/RoomCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Filter, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Room } from '../../types';
import { toast } from 'sonner';

export function RoomSearch() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filter States
  const [priceRange, setPriceRange] = useState(200000);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  // Fetch rooms from backend
  useEffect(() => {
    fetch('/oceanview-backend/room')
      .then((res) => res.json())
      .then((data: Room[]) => {
        setRooms(data);
        setFilteredRooms(data);
      })
      .catch((err) => toast.error('Failed to fetch rooms: ' + err.message));
  }, []);

  // Apply filters
  useEffect(() => {
    let result = rooms;

    // Filter by Price
    result = result.filter((room) => room.price <= priceRange);

    // Filter by Type
    if (selectedTypes.length > 0) {
      result = result.filter((room) => selectedTypes.includes(room.type));
    }

    setFilteredRooms(result);
  }, [priceRange, selectedTypes, rooms]);

  const handleTypeChange = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleCheckAvailability = async () => {
    if (!checkIn || !checkOut) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    try {
      const availabilityPromises = rooms.map(async (room) => {
        const res = await fetch(
          `/oceanview-backend/room/checkAvailability?roomName=${encodeURIComponent(
            room.name
          )}&checkIn=${checkIn}&checkOut=${checkOut}`
        );
        const data = await res.json();
        return { ...room, available: data.available };
      });

      const updatedRooms = await Promise.all(availabilityPromises);
      setFilteredRooms(updatedRooms.filter((r) => r.available));
    } catch (err: any) {
      toast.error('Error checking availability: ' + err.message);
    }
  };

  const handleViewDetails = (room: Room) => {
    navigate(`/customer/rooms/${room.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-ocean-deep mb-4">
            Find Your Perfect Stay
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse our collection of luxury rooms, suites, and villas.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-12 -mt-6 border border-gray-100 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <Input
              label="Check In"
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />

            <Input
              label="Check Out"
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />

            <Select
              label="Guests"
              options={[
                { value: '1', label: '1 Guest' },
                { value: '2', label: '2 Guests' },
                { value: '3', label: '3 Guests' },
                { value: '4', label: '4+ Guests' },
              ]}
            />

            <Button
              className="h-10"
              leftIcon={<Search className="h-4 w-4" />}
              onClick={handleCheckAvailability}
            >
              Check Availability
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div
            className={`lg:w-64 flex-shrink-0 ${
              filtersOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="bg-white p-6 rounded-xl border border-gray-200 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif font-bold text-lg">Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    setPriceRange(200000);
                    setSelectedTypes([]);
                  }}
                >
                  Reset
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-900 mb-3 block">
                    Max Price (LKR)
                  </label>
                  <input
                    type="range"
                    className="w-full accent-ocean-DEFAULT"
                    min="10000"
                    max="200000"
                    step="5000"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>10k</span>
                    <span>{priceRange.toLocaleString()}</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900 mb-3 block">
                    Room Type
                  </label>
                  <div className="space-y-2">
                    {['Standard', 'Deluxe', 'Suite', 'Villa'].map((type) => (
                      <label
                        key={type}
                        className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-ocean-DEFAULT focus:ring-ocean-light"
                          checked={selectedTypes.includes(type)}
                          onChange={() => handleTypeChange(type)}
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Room Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">{filteredRooms.length} rooms found</p>
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden"
                onClick={() => setFiltersOpen(!filtersOpen)}
                leftIcon={<Filter className="h-4 w-4" />}
              >
                Filters
              </Button>
            </div>

            {filteredRooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredRooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    onBook={handleViewDetails}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                <p className="text-gray-500">No rooms match your criteria.</p>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setPriceRange(200000);
                    setSelectedTypes([]);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
