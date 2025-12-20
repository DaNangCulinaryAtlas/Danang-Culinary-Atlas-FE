import { useQuery } from '@tanstack/react-query';
import { getHealthCheck } from '@/services/recommendation';

export const useRecommendationHealth = () => {
    return useQuery({
        queryKey: ['recommendation-health'],
        queryFn: async () => {
            const response = await getHealthCheck();
            if (!response.success || !response.data) {
                throw new Error(response.message || 'Failed to fetch health status');
            }
            return response.data;
        },
        refetchInterval: 30000, // Refetch every 30 seconds
        staleTime: 10000,
    });
};
