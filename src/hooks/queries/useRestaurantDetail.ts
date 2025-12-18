import { useQuery } from '@tanstack/react-query';
import { getRestaurantDetail } from '@/services/restaurant';

interface RestaurantDetail {
    restaurantId: string;
    ownerAccountId: string;
    name: string;
    address: string;
    images: {
        photo: string;
        sub_photo: string[];
    };
    wardId: number;
    status: string;
    createdAt: string;
    approvalStatus: string;
    approvedByAccountId: string | null;
    approvedAt: string | null;
    rejectionReason: string | null;
    tags?: Array<{
        tagId: number;
        name: string;
    }>;
    latitude: number;
    longitude: number;
    openingHours: Record<string, string>;
    averageRating: number;
    totalReviews: number;
}

export const useRestaurantDetail = (restaurantId: string) => {
    return useQuery({
        queryKey: ['restaurantDetail', restaurantId],
        queryFn: async () => {
            const response = await getRestaurantDetail(restaurantId);
            if (!response.success || !response.data) {
                throw new Error(response.message || 'Failed to fetch restaurant');
            }
            return response.data as RestaurantDetail;
        },
        enabled: !!restaurantId,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
};
