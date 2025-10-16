import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  size?: number;
}

export default function StarRating({ rating, size = 4 }: StarRatingProps) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  // Full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Star
        key={`full-${i}`}
        className={`w-${size} h-${size} fill-yellow-400 text-yellow-400`}
        size={size * 4}
      />
    );
  }

  // Half star
  if (hasHalfStar && fullStars < 5) {
    stars.push(
      <div key="half" className="relative" style={{ width: size * 4, height: size * 4 }}>
        <Star className="text-gray-300" size={size * 4} />
        <div className="absolute inset-0 overflow-hidden w-1/2">
          <Star className="fill-yellow-400 text-yellow-400" size={size * 4} />
        </div>
      </div>
    );
  }

  // Empty stars
  const remainingStars = 5 - Math.ceil(rating);
  for (let i = 0; i < remainingStars; i++) {
    stars.push(
      <Star
        key={`empty-${i}`}
        className="text-gray-300"
        size={size * 4}
      />
    );
  }

  return <div className="flex items-center gap-0.5">{stars}</div>;
}