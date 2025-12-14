import { useQuery } from '@tanstack/react-query';
import { getRestaurantTags } from '@/services/location';

export const useRestaurantTags = () => {
    return useQuery({
        queryKey: ['restaurantTags'],
        queryFn: async () => {
            const response = await getRestaurantTags();
            if (!response.success) {
                throw new Error(response.message || 'Failed to fetch restaurant tags');
            }
            return response.data || [];
        },
        staleTime: 1000 * 60 * 60, // 1 hour
    });
};
