import { Button } from '@/components/ui/button';
import type { Restaurant } from '@/types/restaurant';

interface PopupCardProps {
  restaurant: Restaurant;
  onClose: () => void;
}

export default function PopupCard({ restaurant, onClose }: PopupCardProps) {
  return (
    <div className="p-4 min-w-[280px] bg-white rounded-xl shadow-xl">
      {/* Image */}
      <div className="relative">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-48 object-cover rounded-lg"
        />
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs font-semibold">
          ★ {restaurant.rating || '4.5'}
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="mt-3">
        <h3 className="font-bold text-lg text-gray-800 line-clamp-1">
          {restaurant.name}
        </h3>
        
        <p className="text-gray-600 text-sm mt-1">
          {restaurant.category || 'Vietnamese'}
        </p>

        <div className="flex items-center justify-between mt-2">
          <span className="text-green-600 font-semibold text-sm">
            ★ {restaurant.rating || '4.5'} ({restaurant.reviews || '123'} reviews)
          </span>
          <span className="text-gray-500 text-sm font-medium">
            {restaurant.price || '$$'}
          </span>
        </div>

        {/* Address */}
        <p className="text-gray-500 text-sm mt-2 truncate">
          📍 {restaurant.address || '123 Beach Road, Da Nang'}
        </p>

        {/* Action Button */}
        <Button 
          onClick={onClose}
          className="w-full mt-3 bg-[#44BACA] text-white py-2 rounded-lg font-semibold transition-colors"
        >
          View Details →
        </Button>
      </div>
    </div>
  );
}