import { useQuery } from '@tanstack/react-query';
import { getRecommendations } from '@/services/recommendation';
import { RecommendationRequest } from '@/types/recommendation';

export const useRecommendations = (params: RecommendationRequest) => {
    return useQuery({
        queryKey: ['recommendations', params.target_type, params.user_id, params.hour, params.k],
        queryFn: async () => {
            const result = await getRecommendations(params);
            if (!result.success || !result.data) {
                throw new Error(result.message || 'Failed to fetch recommendations');
            }
            return result.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 2,
    });
};

export const useRecommendedDishes = (userId: string, hour: number, k: number = 4) => {
    return useRecommendations({
        user_id: userId,
        hour,
        k,
        target_type: 'dish'
    });
};

export const useRecommendedRestaurants = (userId: string, hour: number, k: number = 4) => {
    return useRecommendations({
        user_id: userId,
        hour,
        k,
        target_type: 'restaurant'
    });
};
