import { useQuery } from '@tanstack/react-query';
import {
    getVendorRestaurantDishes,
    VendorDishItem,
    VendorDishListParams,
    VendorDishListResponse
} from '@/services/vendor';

export interface UseVendorDishesParams extends VendorDishListParams {
    restaurantId: string | null;
    enabled?: boolean;
}

export function useVendorDishes({
    restaurantId,
    page = 0,
    size = 10,
    sortBy = 'name',
    sortDirection = 'asc',
    enabled = true
}: UseVendorDishesParams) {
    const query = useQuery({
        queryKey: ['vendorRestaurantDishes', restaurantId, page, size, sortBy, sortDirection],
        queryFn: async () => {
            if (!restaurantId) {
                throw new Error('Restaurant ID is required');
            }
            const response = await getVendorRestaurantDishes(restaurantId, {
                page,
                size,
                sortBy,
                sortDirection,
            });
            if (!response.success || !response.data) {
                throw new Error(response.message || 'Failed to fetch vendor dishes');
            }
            return response.data;
        },
        enabled: enabled && !!restaurantId,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });

    return {
        dishes: query.data?.content ?? [],
        totalPages: query.data?.totalPages ?? 0,
        totalElements: query.data?.totalElements ?? 0,
        currentPage: query.data?.number ?? 0,
        pageSize: query.data?.size ?? size,
        isFirst: query.data?.first ?? true,
        isLast: query.data?.last ?? true,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        error: query.error?.message || null,
        refetch: query.refetch,
    };
}

// Hook to get dishes filtered by approval status
export function useVendorDishesByStatus({
    restaurantId,
    page = 0,
    size = 10,
    sortBy = 'name',
    sortDirection = 'asc',
    enabled = true
}: UseVendorDishesParams) {
    const query = useQuery({
        queryKey: ['vendorRestaurantDishes', restaurantId, page, size, sortBy, sortDirection],
        queryFn: async () => {
            if (!restaurantId) {
                throw new Error('Restaurant ID is required');
            }
            const response = await getVendorRestaurantDishes(restaurantId, {
                page,
                size,
                sortBy,
                sortDirection,
            });
            if (!response.success || !response.data) {
                throw new Error(response.message || 'Failed to fetch vendor dishes');
            }
            return response.data;
        },
        enabled: enabled && !!restaurantId,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    const dishes = query.data?.content ?? [];

    // Filter dishes by approval status
    const pendingDishes = dishes.filter(dish => dish.approvalStatus === 'PENDING');
    const approvedDishes = dishes.filter(dish => dish.approvalStatus === 'APPROVED');
    const rejectedDishes = dishes.filter(dish => dish.approvalStatus === 'REJECTED');

    return {
        allDishes: dishes,
        pendingDishes,
        approvedDishes,
        rejectedDishes,
        totalPages: query.data?.totalPages ?? 0,
        totalElements: query.data?.totalElements ?? 0,
        currentPage: query.data?.number ?? 0,
        pageSize: query.data?.size ?? size,
        isFirst: query.data?.first ?? true,
        isLast: query.data?.last ?? true,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        error: query.error?.message || null,
        refetch: query.refetch,
    };
}

export type { VendorDishItem, VendorDishListResponse };
