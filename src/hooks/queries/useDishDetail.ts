import { useQuery } from '@tanstack/react-query';
import { getDishDetail } from '@/services/dish';

interface DishDetail {
    dishId: string;
    restaurantId: string;
    restaurantName: string | null;
    name: string;
    images: string[] | null;
    description: string;
    price: number;
    status: 'AVAILABLE' | 'UNAVAILABLE';
    approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
    approvedByAccountId: string | null;
    approvedAt: string | null;
    rejectionReason: string | null;
}

export const useDishDetail = (dishId: string) => {
    return useQuery({
        queryKey: ['dishDetail', dishId],
        queryFn: async () => {
            const response = await getDishDetail(dishId);
            if (!response.success || !response.data) {
                throw new Error(response.message || 'Failed to fetch dish');
            }
            return response.data as DishDetail;
        },
        enabled: !!dishId,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
};

export type { DishDetail };
