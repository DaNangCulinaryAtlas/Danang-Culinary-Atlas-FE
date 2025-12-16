import { useQueries } from '@tanstack/react-query';
import { getDishDetail } from '@/services/dish';
import { getRestaurantDetail } from '@/services/restaurant';
import { useRecommendedDishes, useRecommendedRestaurants } from './useRecommendations';

/**
 * Hook to fetch recommended dishes with their full details
 * Uses the recommendation API and then fetches details for each dish
 */
export const useRecommendedDishesWithDetails = (userId: string, hour: number, k: number = 4) => {
    // First, get the recommendations
    const { data: recommendationsData, isLoading: isLoadingRecommendations } = useRecommendedDishes(userId, hour, k);

    // Extract dish IDs from recommendations
    const dishIds = recommendationsData?.recommendations?.map(rec => rec.id) || [];

    // Fetch details for each recommended dish
    const dishQueries = useQueries({
        queries: dishIds.map((dishId) => ({
            queryKey: ['dishDetail', dishId],
            queryFn: async () => {
                const response = await getDishDetail(dishId);
                if (!response.success || !response.data) {
                    throw new Error(response.message || 'Failed to fetch dish');
                }
                return response.data;
            },
            enabled: !!dishId,
            staleTime: 5 * 60 * 1000,
        })),
    });

    const isLoading = isLoadingRecommendations || dishQueries.some(query => query.isLoading);
    const isError = dishQueries.some(query => query.isError);
    const dishes = dishQueries
        .filter(query => query.data)
        .map(query => query.data);

    return {
        data: dishes,
        isLoading,
        isError,
        recommendations: recommendationsData,
    };
};

/**
 * Hook to fetch recommended restaurants with their full details
 * Uses the recommendation API and then fetches details for each restaurant
 */
export const useRecommendedRestaurantsWithDetails = (userId: string, hour: number, k: number = 4) => {
    // First, get the recommendations
    const { data: recommendationsData, isLoading: isLoadingRecommendations } = useRecommendedRestaurants(userId, hour, k);

    // Extract restaurant IDs from recommendations
    const restaurantIds = recommendationsData?.recommendations?.map(rec => rec.id) || [];

    // Fetch details for each recommended restaurant
    const restaurantQueries = useQueries({
        queries: restaurantIds.map((restaurantId) => ({
            queryKey: ['restaurantDetail', restaurantId],
            queryFn: async () => {
                const response = await getRestaurantDetail(restaurantId);
                if (!response.success || !response.data) {
                    throw new Error(response.message || 'Failed to fetch restaurant');
                }
                return response.data;
            },
            enabled: !!restaurantId,
            staleTime: 5 * 60 * 1000,
        })),
    });

    const isLoading = isLoadingRecommendations || restaurantQueries.some(query => query.isLoading);
    const isError = restaurantQueries.some(query => query.isError);
    const restaurants = restaurantQueries
        .filter(query => query.data)
        .map(query => query.data);

    return {
        data: restaurants,
        isLoading,
        isError,
        recommendations: recommendationsData,
    };
};
