import { memo, useCallback } from "react";
import { useRouter } from "next/navigation";
import RestaurantCard from "@/components/restaurants/RestaurantCard";
import { Restaurant } from "@/types/restaurant/index";
import ViewMode from "@/types/view-mode";
import RestaurantGridSkeleton from "./RestaurantGridSkeleton";
import { useTranslation } from '@/hooks/useTranslation';

interface RestaurantGridProps {
    restaurants: Restaurant[];
    viewMode: ViewMode;
    loading: boolean;
    resultsPerPage: number;
}

const RestaurantGrid = memo(function RestaurantGrid({
    restaurants,
    viewMode,
    loading,
    resultsPerPage,
}: RestaurantGridProps) {
    const { t } = useTranslation();
    const router = useRouter();

    const handleRestaurantClick = useCallback((restaurantId: string) => {
        router.push(`/restaurants/${restaurantId}`);
    }, [router]);

    // Show skeleton while loading
    if (loading && restaurants.length === 0) {
        return (
            <div className={`
        ${viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "flex flex-col gap-4"
                }
      `}>
                <RestaurantGridSkeleton count={resultsPerPage} />
            </div>
        );
    }

    // Show empty state
    if (restaurants.length === 0 && !loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 min-h-[500px] flex items-center justify-center">
                <div className="text-center max-w-md mx-auto">
                    <svg
                        className="w-24 h-24 mx-auto text-gray-300 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {t('restaurants.noResults')}
                    </h3>
                    <p className="text-gray-600">
                        {t('restaurants.noResultsDescription')}
                    </p>
                </div>
            </div>
        );
    }

    // Show restaurants with loading overlay
    return (
        <div className="relative">
            {/* Loading overlay - only appears during filter changes */}
            {loading && restaurants.length > 0 && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#44BACA] mx-auto"></div>
                        <p className="mt-2 text-sm text-gray-600">{t('restaurants.loading')}</p>
                    </div>
                </div>
            )}

            <div className={`
        ${viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "flex flex-col gap-4"
                }
        ${loading ? "opacity-50 pointer-events-none" : ""}
        transition-opacity duration-200
      `}>
                {restaurants.map((restaurant) => (
                    <RestaurantCard
                        key={restaurant.restaurantId}
                        restaurant={restaurant}
                        onClick={() => handleRestaurantClick(restaurant.restaurantId)}
                    />
                ))}
            </div>
        </div>
    );
});

export default RestaurantGrid;
