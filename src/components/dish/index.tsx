import Image from "next/image";
import StarRating from "../restaurants/StarRating";
import type { Dish } from "@/types/dish";
import { useRouter } from "next/navigation";
interface DishCardProps {
  dish: Dish;
}

export default function DishCard({ dish }:  DishCardProps ) {
  const router = useRouter();
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
      onClick={()=> router.push(`/dishes/${dish.title.replace(/\s+/g, '-').toLowerCase()}`)}
    >
      {/* Image Section */}
      <div className="relative w-full h-48 md:h-56 overflow-hidden">
        <Image
          src={dish.image}
          alt={dish.title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col justify-between flex-grow">
        {/* Title */}
        <h2 className="text-[#1C2B38] font-volkhov font-bold text-[14px] md:text-[16px] mb-2 leading-tight">
          {dish.title}
        </h2>

        {/* Description */}
        <p className="text-[#778088] font-mulish text-[12px] md:text-sm mb-4 leading-relaxed line-clamp-3">
          {dish.description}
        </p>

        {/* Rating and Price Row */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          {/* Rating Section */}
          <div>
            <div className="flex items-center gap-0.5 mb-1">
              <StarRating rating={4.8} />
            </div>
            <p className="text-[#778088] text-xs font-medium">
              ({dish.reviewCount} reviews)
            </p>
          </div>

          {/* Price Section */}
          <div className="flex flex-col text-center">
            <p className="text-[#44BACA] text-[17px] font-bold">${dish.price}</p>
            <p className="text-[#778088] text-xs">per person</p>
          </div>
        </div>
      </div>
    </div>
  );
}