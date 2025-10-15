import React from 'react';
import { MapPin, Star, Heart } from 'lucide-react';
import type { Restaurant } from "@/types/restaurant";

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: () => void;
  onToggleFavorite: (id: number) => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onClick,
  onToggleFavorite,
}) => {
  return (
    <div
      className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative h-40 sm:h-48 overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(restaurant.id);
          }}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
        >
          <Heart
            size={18}
            className={restaurant.isFavorite ? 'fill-cyan-500 text-cyan-500' : 'text-gray-400'}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-sm text-gray-500 mb-1">{restaurant.category}</p>
            <h3 className="font-semibold text-gray-800">{restaurant.name}</h3>
          </div>
          <span className="text-lg font-bold text-gray-800">${restaurant.price}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-600">
            <MapPin size={14} className="mr-1 text-cyan-500" />
            <span className="text-xs">{restaurant.address}</span>
          </div>
          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
            <Star size={14} className="fill-yellow-400 text-yellow-400 mr-1" />
            <span className="font-semibold text-gray-700">{restaurant.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;