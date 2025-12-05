import { useInfiniteQuery } from '@tanstack/react-query';
import { getRestaurantReviews } from '@/services/review';

export const useRestaurantReviews = (restaurantId: string, pageSize: number = 10) => {
    return useInfiniteQuery({
        queryKey: ['reviews', restaurantId],
        queryFn: async ({ pageParam = 0 }) => {
            const response = await getRestaurantReviews(
                restaurantId,
                pageParam,
                pageSize,
                'createdAt',
                'desc'
            );
            return response;
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.last) return undefined;
            return lastPage.number + 1;
        },
        initialPageParam: 0,
    });
};
