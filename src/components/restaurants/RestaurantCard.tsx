import Image from "next/image";
import { Heart } from "lucide-react";
import type { Restaurant } from "@/types/restaurant";
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
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      {/* Image Section */}
      <div className="relative w-full h-59 md:h-60">
        <Image
          src={restaurant.image}
          alt={restaurant.name}
          fill
          className="object-cover hover:scale-105 transition-transform duration-500"
        />

        {/* Favorite Icon */}
        <button className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition">
          <Heart className="w-5 h-5 text-gray-700 hover:text-red-500 transition-colors" />
        </button>
      </div>

      {/* Info Section */}
      <div className="p-5 flex flex-col gap-1">
        {/* Name */}
        <h3 className="text-[#1C2B38] font-volkhov font-bold text-lg leading-tight">
          {restaurant.name}
        </h3>

        {/* Cuisine & Location */}
        <p className="text-[#778088] text-sm font-mulish">
          {restaurant.category} | {restaurant.address}
        </p>

        {/* Price */}
        <p className="text-[#44BACA] font-semibold text-[16px] mt-1">
          {restaurant.price}$
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-0.5">
            <StarRating rating={restaurant.rating} />
          </div>
          <p className="text-[#778088] text-sm">
            {restaurant.rating} ({restaurant.reviews} reviews)
          </p>
        </div>
      </div>
    </div>
  );
}