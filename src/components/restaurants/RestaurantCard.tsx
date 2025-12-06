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
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            fill
            className="object-cover hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400 text-sm font-medium">No image</span>
          </div>
        )}

        {/* Favorite Icon */}
        <button
          className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition"
          onClick={(e) => {
            e.stopPropagation();
            // Handle favorite toggle
          }}
        >
          <Heart className="w-5 h-5 text-gray-700 hover:text-red-500 transition-colors" />
        </button>
      </div>

      {/* Info Section - Fixed Layout */}
      <div className="p-5 flex flex-col gap-3 flex-grow">
        {/* Name - Fixed 2 lines height */}
        <h3 className="text-[#1C2B38] font-volkhov font-bold text-lg leading-tight line-clamp-2 h-14">
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