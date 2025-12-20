import { useQuery } from '@tanstack/react-query';
import { getTrainingHistory } from '@/services/recommendation';

export const useTrainingHistory = () => {
    return useQuery({
        queryKey: ['training-history'],
        queryFn: async () => {
            const response = await getTrainingHistory();
            if (!response.success || !response.data) {
                throw new Error(response.message || 'Failed to fetch training history');
            }
            return response.data;
        },
        refetchInterval: 60000, // Refetch every 60 seconds
        staleTime: 30000,
    });
};
