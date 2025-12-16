import { useQuery } from '@tanstack/react-query';
import { getRestaurantTagsByRestaurantId } from '@/services/vendor';

export const useRestaurantTagsByRestaurantId = (restaurantId: string | undefined) => {
    return useQuery({
        queryKey: ['restaurantTags', restaurantId],
        queryFn: async () => {
            if (!restaurantId) {
                return [];
            }
            const response = await getRestaurantTagsByRestaurantId(restaurantId);
            if (!response.success) {
                throw new Error(response.message || 'Failed to fetch restaurant tags');
            }
            return response.data || [];
        },
        enabled: !!restaurantId, // Only fetch when restaurantId is provided
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
