import React, { useEffect, useState } from 'react';
import { RoomCard } from '../../components/RoomCard';
import { Input } from '../../components/ui/Input';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Room } from '../../types';
import { toast } from 'sonner';

export function RoomSearch() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Room[]>([]);

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

  // Search with suggestions
  useEffect(() => {
    if (!searchQuery) {
      setFilteredRooms(rooms);
      setSuggestions([]);
      return;
    }

    const queryLower = searchQuery.toLowerCase();

    // Filter rooms based on search query
    const filtered = rooms.filter((room) =>
      room.name.toLowerCase().includes(queryLower)
    );
    setFilteredRooms(filtered);

    // Suggestions with image
    const suggestionList = rooms
      .filter((room) => room.name.toLowerCase().includes(queryLower))
      .slice(0, 5);
    setSuggestions(suggestionList);
  }, [searchQuery, rooms]);

  const handleViewDetails = (room: Room) => {
    navigate(`/customer/rooms/${room.id}`);
  };

  return (
    <div className="min-h-screen bg-emerald-50 py-12 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-teal-900 mb-4">
            Find Your Perfect Stay
          </h1>
          <p className="text-teal-800/80 max-w-2xl mx-auto">
            Browse our collection of luxury rooms, suites, and villas.
          </p>
        </div>

        {/* Full-width Search Bar */}
        <div className="relative max-w-3xl mx-auto mb-12">
          <Input
            placeholder="Search rooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-12"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-600 h-5 w-5" />

          {/* Search Suggestions */}
          {suggestions.length > 0 && (
            <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1">
              {suggestions.map((room) => (
                <div
                  key={room.id}
                  className="flex items-center gap-3 p-3 cursor-pointer hover:bg-teal-50"
                  onClick={() => handleViewDetails(room)}
                >
                  <img
                    src={room.imageUrl}
                    alt={room.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <span className="text-teal-900 font-medium">{room.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onBook={handleViewDetails}
              />
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100 col-span-full">
              <p className="text-gray-500 mb-4">No rooms match your search.</p>
              <button
                className="px-6 py-2 border border-teal-600 text-teal-600 rounded hover:bg-teal-50 "
                onClick={() => {
                  setSearchQuery('');
                  setFilteredRooms(rooms);
                }}
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
