import { useQuery } from '@tanstack/react-query';
import { getRestaurantDishes } from '@/services/restaurant';

export interface RestaurantDish {
    dishId: string;
    restaurantId: string;
    restaurantName: string | null;
    name: string;
    images: string[] | null;
    description: string;
    price: number;
    status: 'AVAILABLE' | 'UNAVAILABLE';
    approvalStatus: 'APPROVED' | 'PENDING' | 'REJECTED';
    approvedByAccountId: string | null;
    approvedAt: string | null;
    rejectionReason: string | null;
}

export interface RestaurantDishesResponse {
    content: RestaurantDish[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}

export interface UseRestaurantDishesParams {
    restaurantId: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    enabled?: boolean;
}

export const useRestaurantDishes = (params: UseRestaurantDishesParams) => {
    const { enabled = true, ...queryParams } = params;

    return useQuery({
        queryKey: ['restaurant-dishes', params.restaurantId, queryParams],
        queryFn: async () => {
            const response = await getRestaurantDishes(queryParams);
            if (!response.success || !response.data) {
                throw new Error(response.message || 'Failed to fetch restaurant dishes');
            }
            return response.data as RestaurantDishesResponse;
        },
        enabled: enabled && !!params.restaurantId,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
};
