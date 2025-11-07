import StarRating from '@/components/restaurants/StarRating';
import { Button } from '@/components/ui/button';
import type { Restaurant } from '@/types/restaurant';
import Image from 'next/image';

interface PopupCardProps {
  restaurant: Restaurant;
  onClose: () => void;
}

export default function PopupCard({ restaurant, onClose }: PopupCardProps) {

  return (
    <div>
      {/* Image */}
      <div className="relative h-40 w-full">
        <Image
          width={320}
          height={160}
          src={restaurant.images.photo || '/images/danang-find-restaurant.jpg'}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors flex items-center justify-center"
        >
          <span className="text-gray-600 font-bold text-xl leading-none">×</span>
        </Button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 text-gray-900">
          {restaurant.name}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {restaurant.address}
        </p>

        {/* Rating and additional info */}
        <div className="flex items-center gap-4 mb-3">
          {restaurant.averageRating && (
            <div className="flex items-center gap-1">
              <StarRating rating={restaurant.averageRating} />
              <span className="font-semibold text-gray-900">{restaurant.averageRating}</span>
              {restaurant.totalReviews && (
                <span className="text-xs text-gray-500">({restaurant.totalReviews})</span>
              )}
            </div>
          )}
        </div>
        {/* View Details Button */}
        <Button variant="ghost" className="w-full bg-[#44BACA] text-white font-medium py-2 rounded-lg">
          Xem chi tiết
        </Button>
      </div>
    </div>
  );
}