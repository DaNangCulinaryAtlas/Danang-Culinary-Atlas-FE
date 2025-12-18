import React from 'react';
import { MapPin, Star } from 'lucide-react';
import Image from 'next/image';
import type { Restaurant } from '@/types/restaurant';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick?: () => void;
}

const RestaurantMapCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onClick,
}) => {
  return (
    <div
      className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer flex flex-col h-full"
      onClick={onClick}
    >
      {/* Image - Fixed Height */}
      <div className="relative h-40 sm:h-48 overflow-hidden flex-shrink-0 bg-gray-200">
        {restaurant.images.photo ? (
          <Image
            width={400}
            height={192}
            src={restaurant.images.photo}
            alt={restaurant.name}
            unoptimized={restaurant.images.photo.includes('googleusercontent.com')}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400 text-sm font-medium">No image</span>
          </div>
        )}
      </div>

      {/* Content - Fixed Layout */}
      <div className="p-4 flex flex-col gap-3 flex-grow">
        {/* Name - Fixed 2 lines height */}
        <div className="h-12">
          <h3 className="font-semibold text-gray-800 text-base line-clamp-2 leading-tight">
            {restaurant.name}
          </h3>
        </div>

        {/* Bottom Section - Fixed at bottom */}
        <div className="flex flex-col gap-2 mt-auto">
          {/* Address - Fixed 1 line */}
          <div className="flex items-center text-gray-600 min-h-[20px]">
            <MapPin size={14} className="mr-1 text-cyan-500 flex-shrink-0" />
            <span className="text-xs line-clamp-1">{restaurant.address}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center justify-between">
            <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
              <Star size={14} className="fill-yellow-400 text-yellow-400 mr-1" />
              <span className="font-semibold text-gray-700 text-sm">
                {restaurant.averageRating?.toFixed(1) || "0.0"}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              ({restaurant.totalReviews || 0} reviews)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantMapCard;