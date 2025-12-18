import Image from "next/image";
import { Heart } from "lucide-react";
import { Restaurant } from "@/types/restaurant/index";
import StarRating from "./StarRating";

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick?: () => void;
}

export default function RestaurantCard({
  restaurant,
  onClick,
}: RestaurantCardProps) {
  return (
    <div
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col h-full"
      onClick={onClick}
    >
      {/* Image Section - Fixed Height */}
      <div className="relative w-full h-48 flex-shrink-0 bg-gray-200">
        {restaurant.images.photo ? (
          <Image
            src={restaurant.images.photo}
            alt={restaurant.name}
            unoptimized={restaurant.images.photo.includes('googleusercontent.com')}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            loading="lazy"
            fill
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400 text-sm font-medium">No image</span>
          </div>
        )}
      </div>

      {/* Info Section - Fixed Layout */}
      <div className="p-5 flex flex-col gap-3 flex-grow">
        {/* Name - Single line with ellipsis */}
        <h3
          className="text-[#1C2B38] font-volkhov font-bold text-lg leading-tight truncate"
          title={restaurant.name}
        >
          {restaurant.name}
        </h3>

        {/* Address - Fixed 2 lines height */}
        <p className="text-[#778088] text-sm font-mulish line-clamp-2 h-10">
          {restaurant.address}
        </p>

        {/* Rating - Fixed position at bottom */}
        <div className="flex items-center gap-2 mt-auto pt-2">
          <div className="flex items-center gap-0.5">
            <StarRating rating={restaurant.averageRating || 0} />
          </div>
          <p className="text-[#778088] text-sm whitespace-nowrap">
            {restaurant.averageRating?.toFixed(1) || "0.0"} ({restaurant.totalReviews || 0} reviews)
          </p>
        </div>
      </div>
    </div>
  );
}