import { useQuery } from '@tanstack/react-query';
import { getRestaurants, searchRestaurants, searchRestaurantsByName } from '@/services/restaurant';
import { GetRestaurantsParams } from '@/types/restaurant/index';

/**
 * Hook to fetch all restaurants with pagination and filtering
 */
export function useRestaurants(params: GetRestaurantsParams, enabled: boolean = true) {
    return useQuery({
        queryKey: ['restaurants', params],
        queryFn: async () => {
            const response = await getRestaurants(params);
            if (!response.success) {
                throw new Error(response.message || 'Failed to fetch restaurants');
            }
            return response.data;
        },
        enabled, // Only run query if enabled
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    });
}

/**
 * Hook to search restaurants with filters
 */
export function useSearchRestaurants(params: GetRestaurantsParams, enabled: boolean = true) {
    return useQuery({
        queryKey: ['search-restaurants', params],
        queryFn: async () => {
            const response = await searchRestaurants(params);
            if (!response.success) {
                throw new Error(response.message || 'Failed to search restaurants');
            }
            return response.data;
        },
        enabled, // Only run query if enabled
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}

/**
 * Hook to search restaurants by name
 */
export function useSearchRestaurantsByName(
    searchQuery: string,
    params: Omit<GetRestaurantsParams, 'search'>,
    enabled: boolean = true
) {
    return useQuery({
        queryKey: ['search-restaurants-by-name', searchQuery, params],
        queryFn: async () => {
            const response = await searchRestaurantsByName({
                ...params,
                name: searchQuery,
            });
            if (!response.success) {
                throw new Error(response.message || 'Failed to search restaurants');
            }
            return response.data;
        },
        enabled: enabled && !!searchQuery.trim(),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}
