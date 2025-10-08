import Image from "next/image";

interface DishCardProps {
  image: string;
  title: string;
  description: string;
  rating: number;
  reviewCount: number;
  price: number;
}

export default function DishCard({ image, title, description, rating, reviewCount, price }: DishCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
      {/* Image Section */}
      <div className="relative w-full h-48 md:h-56 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col justify-between flex-grow">
        {/* Title */}
        <h2 className="text-[#1C2B38] font-volkhov font-bold text-[14px] md:text-[16px] mb-2 leading-tight">
          {title}
        </h2>

        {/* Description */}
        <p className="text-[#778088] font-mulish text-[12px] md:text-sm mb-4 leading-relaxed line-clamp-3">
          {description}
        </p>

        {/* Rating and Price Row */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          {/* Rating Section */}
          <div>
            <div className="flex items-center gap-1 mb-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-4 h-4 fill-current ${
                    star <= rating ? "text-orange-400" : "text-[#778088]"
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <p className="text-[#778088] text-xs font-medium">
              {reviewCount} reviews
            </p>
          </div>

          {/* Price Section */}
          <div className="flex flex-col text-center">
            <p className="text-[#44BACA] text-[17px] font-bold">${price}</p>
            <p className="text-[#778088] text-xs">per person</p>
          </div>
        </div>
      </div>
    </div>
  );
}
