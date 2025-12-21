import { memo, useCallback } from "react";
import Star from "@/components/restaurants/Star";
import { useTranslation } from "@/hooks/useTranslation";

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
    const { t } = useTranslation();
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
            <h3 className="font-semibold text-gray-800 text-base">{t('restaurants.filters.ratings')}</h3>

            {/* Min Rating */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">{t('restaurants.filters.minimumRating')}</label>
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                            key={`min-${rating}`}
                            onClick={() => handleMinRatingClick(rating)}
                            className={`transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#44BACA] focus:ring-offset-1 rounded p-0.5 ${minRating !== null && rating <= minRating
                                    ? 'opacity-100'
                                    : 'opacity-40 hover:opacity-70'
                                }`}
                            aria-label={t('restaurants.filters.setMinimumRating', { rating })}
                            title={`${t('restaurants.filters.minimum')}: ${rating} ${rating > 1 ? t('restaurants.filters.stars') : t('restaurants.filters.star')}`}
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
                            aria-label={t('restaurants.filters.clearMinimumRating')}
                        >
                            ✕
                        </button>
                    )}
                </div>
                {minRating !== null && (
                    <p className="text-xs text-gray-600">
                        {minRating} {minRating > 1 ? t('restaurants.filters.stars') : t('restaurants.filters.star')} {t('restaurants.filters.andUp')}
                    </p>
                )}
            </div>

            {/* Max Rating */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">{t('restaurants.filters.maximumRating')}</label>
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                            key={`max-${rating}`}
                            onClick={() => handleMaxRatingClick(rating)}
                            className={`transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#44BACA] focus:ring-offset-1 rounded p-0.5 ${maxRating !== null && rating <= maxRating
                                    ? 'opacity-100'
                                    : 'opacity-40 hover:opacity-70'
                                }`}
                            aria-label={t('restaurants.filters.setMaximumRating', { rating })}
                            title={`${t('restaurants.filters.maximum')}: ${rating} ${rating > 1 ? t('restaurants.filters.stars') : t('restaurants.filters.star')}`}
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
                            aria-label={t('restaurants.filters.clearMaximumRating')}
                        >
                            ✕
                        </button>
                    )}
                </div>
                {maxRating !== null && (
                    <p className="text-xs text-gray-600">
                        {maxRating} {maxRating > 1 ? t('restaurants.filters.stars') : t('restaurants.filters.star')} {t('restaurants.filters.andDown')}
                    </p>
                )}
            </div>
        </div>
    );
});

export default RatingFilter;