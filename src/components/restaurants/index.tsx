import Image from "next/image";
import { Heart } from "lucide-react";

interface RestaurantCardProps {
  image: string;
  name: string;
  cuisine: string;
  location: string;
  priceRange: string;
  rating: number;
  reviewCount: number;
}

export default function RestaurantCard({
  image,
  name,
  cuisine,
  location,
  priceRange,
  rating,
  reviewCount,
}: RestaurantCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer">
      {/* Image Section */}
      <div className="relative w-full h-59 md:h-60">
        <Image
          src={image}
          alt={name}
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
          {name}
        </h3>

        {/* Cuisine & Location */}
        <p className="text-[#778088] text-sm font-mulish">
          {cuisine} | {location}
        </p>

        {/* Price */}
        <p className="text-[#44BACA] font-semibold text-[16px] mt-1">
          {priceRange}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(rating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                } fill-current`}
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
          </div>
          <p className="text-[#778088] text-sm">
            ({reviewCount.toLocaleString()} reviews)
          </p>
        </div>
      </div>
    </div>
  );
}
