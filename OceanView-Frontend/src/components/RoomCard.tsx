import React from 'react';
import { Users, Wifi, Wind, Coffee, ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Room } from '../types';
import { formatCurrency } from '../utils/format';

interface RoomCardProps {
  room: Room;
  onBook: (room: Room) => void;
}

export function RoomCard({ room, onBook }: RoomCardProps) {
  const iconMap: Record<string, React.ReactNode> = {
    'Wi-Fi': <Wifi className="h-4 w-4" />,
    AC: <Wind className="h-4 w-4" />,
    Coffee: <Coffee className="h-4 w-4" />,
  };

  const amenitiesList = Array.isArray(room.amenities)
    ? room.amenities
    : room.amenities?.split(',').map((a) => a.trim()) || [];

  return (
    <Card noPadding className="overflow-hidden flex flex-col h-full group">
      <div className="relative h-64 overflow-hidden">
        <img
          src={room.imageUrl}
          alt={room.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-ocean-deep shadow-sm">
          {formatCurrency(room.price)}{' '}
          <span className="text-xs font-normal text-gray-600">/ night</span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-serif font-bold text-gray-900">{room.name}</h3>
        </div>

        <p className="text-gray-500 text-sm mb-6 line-clamp-2 flex-1">{room.description}</p>

        <div className="space-y-4">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-ocean-DEFAULT" />
              <span>Up to {room.capacity} Guests</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {amenitiesList.slice(0, 3).map((amenity: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined, index: React.Key | null | undefined) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 rounded text-xs text-gray-600 border border-gray-100"
              >
                {iconMap[amenity] || <span className="h-1.5 w-1.5 rounded-full bg-ocean-light" />}
                {amenity}
              </span>
            ))}

            {amenitiesList.length > 3 && (
              <span className="px-2 py-1 bg-gray-50 rounded text-xs text-gray-500 border border-gray-100">
                +{amenitiesList.length - 3} more
              </span>
            )}
          </div>

          <Button
            onClick={() => onBook(room)}
            className="w-full mt-4"
            rightIcon={<ArrowRight className="h-4 w-4" />}
            disabled={!room.available}
          >
            {room.available ? 'View Details' : 'Not Available'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
