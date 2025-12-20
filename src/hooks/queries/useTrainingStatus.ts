import { useQuery } from '@tanstack/react-query';
import { getTrainingStatus } from '@/services/recommendation';

export const useTrainingStatus = () => {
    return useQuery({
        queryKey: ['training-status'],
        queryFn: async () => {
            const response = await getTrainingStatus();
            if (!response.success || !response.data) {
                throw new Error(response.message || 'Failed to fetch training status');
            }
            return response.data;
        },
        refetchInterval: 10000, // Refetch every 10 seconds
        staleTime: 5000,
    });
};
