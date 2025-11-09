import { memo, useCallback } from "react";
import Star from "@/components/restaurants/Star";

interface RatingFilterProps {
    minRating: number | null;
    maxRating: number | null;
    onChange: (minRating: number | null, maxRating: number | null) => void;
}

const RatingFilter = memo(function RatingFilter({
    minRating,
    maxRating,
    onChange,
}: RatingFilterProps) {
    const handleMinRatingClick = useCallback((rating: number) => {
        // If clicking the same rating, clear it
        if (minRating === rating) {
            onChange(null, maxRating);
        } else {
            // If selecting a min rating higher than current max, adjust max
            if (maxRating !== null && rating > maxRating) {
                onChange(rating, rating);
            } else {
                onChange(rating, maxRating);
            }
        }
    }, [minRating, maxRating, onChange]);

    const handleMaxRatingClick = useCallback((rating: number) => {
        // If clicking the same rating, clear it
        if (maxRating === rating) {
            onChange(minRating, null);
        } else {
            // If selecting a max rating lower than current min, adjust min
            if (minRating !== null && rating < minRating) {
                onChange(rating, rating);
            } else {
                onChange(minRating, rating);
            }
        }
    }, [minRating, maxRating, onChange]);

    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 text-base">Ratings</h3>

            {/* Min Rating */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Minimum Rating</label>
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                            key={`min-${rating}`}
                            onClick={() => handleMinRatingClick(rating)}
                            className={`transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#44BACA] focus:ring-offset-1 rounded p-0.5 ${minRating !== null && rating <= minRating
                                    ? 'opacity-100'
                                    : 'opacity-40 hover:opacity-70'
                                }`}
                            aria-label={`Set minimum rating to ${rating} stars`}
                            title={`Minimum: ${rating} star${rating > 1 ? 's' : ''}`}
                        >
                            <div className="w-5 h-5">
                                <Star filled={minRating !== null && rating <= minRating} />
                            </div>
                        </button>
                    ))}
                    {minRating !== null && (
                        <button
                            onClick={() => onChange(null, maxRating)}
                            className="ml-2 text-xs text-gray-500 hover:text-[#44BACA] transition"
                            aria-label="Clear minimum rating"
                        >
                            ✕
                        </button>
                    )}
                </div>
                {minRating !== null && (
                    <p className="text-xs text-gray-600">
                        {minRating} star{minRating > 1 ? 's' : ''} & up
                    </p>
                )}
            </div>

            {/* Max Rating */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Maximum Rating</label>
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                            key={`max-${rating}`}
                            onClick={() => handleMaxRatingClick(rating)}
                            className={`transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#44BACA] focus:ring-offset-1 rounded p-0.5 ${maxRating !== null && rating <= maxRating
                                    ? 'opacity-100'
                                    : 'opacity-40 hover:opacity-70'
                                }`}
                            aria-label={`Set maximum rating to ${rating} stars`}
                            title={`Maximum: ${rating} star${rating > 1 ? 's' : ''}`}
                        >
                            <div className="w-5 h-5">
                                <Star filled={maxRating !== null && rating <= maxRating} />
                            </div>
                        </button>
                    ))}
                    {maxRating !== null && (
                        <button
                            onClick={() => onChange(minRating, null)}
                            className="ml-2 text-xs text-gray-500 hover:text-[#44BACA] transition"
                            aria-label="Clear maximum rating"
                        >
                            ✕
                        </button>
                    )}
                </div>
                {maxRating !== null && (
                    <p className="text-xs text-gray-600">
                        {maxRating} star{maxRating > 1 ? 's' : ''} & down
                    </p>
                )}
            </div>
        </div>
    );
});

export default RatingFilter;