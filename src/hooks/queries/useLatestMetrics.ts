import { useQuery } from '@tanstack/react-query';
import { getLatestMetrics } from '@/services/recommendation';

export const useLatestMetrics = () => {
    return useQuery({
        queryKey: ['latest-metrics'],
        queryFn: async () => {
            const response = await getLatestMetrics();
            if (!response.success || !response.data) {
                throw new Error(response.message || 'Failed to fetch latest metrics');
            }
            return response.data;
        },
        refetchInterval: 60000, // Refetch every 60 seconds
        staleTime: 30000,
    });
};
