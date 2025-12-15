import { useQuery } from '@tanstack/react-query';
import { getVendorOverview } from '@/services/vendor';

export const useVendorOverview = () => {
    return useQuery({
        queryKey: ['vendorOverview'],
        queryFn: async () => {
            const response = await getVendorOverview();
            if (!response.success) {
                throw new Error(response.message || 'Failed to fetch vendor overview');
            }
            return response.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: true,
    });
};
