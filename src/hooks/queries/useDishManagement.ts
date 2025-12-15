import { useQuery } from '@tanstack/react-query';
import {
    getPendingDishes,
    getRejectedDishes,
    getVendorRestaurantDishes,
    getDishManagementDetail
} from '@/services/dish';
import type { DishListParams } from '@/types/dish';

/**
 * Hook to fetch pending dishes (Admin)
 */
export const usePendingDishes = (params?: DishListParams) => {
    return useQuery({
        queryKey: ['pendingDishes', params],
        queryFn: () => getPendingDishes(params),
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
};

/**
 * Hook to fetch rejected dishes (Admin)
 */
export const useRejectedDishes = (params?: DishListParams) => {
    return useQuery({
        queryKey: ['rejectedDishes', params],
        queryFn: () => getRejectedDishes(params),
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
};

/**
 * Hook to fetch vendor restaurant dishes (Vendor)
 * Includes all statuses: PENDING, APPROVED, REJECTED
 */
export const useVendorRestaurantDishes = (restaurantId: string, params?: DishListParams) => {
    return useQuery({
        queryKey: ['vendorRestaurantDishes', restaurantId, params],
        queryFn: () => getVendorRestaurantDishes(restaurantId, params),
        enabled: !!restaurantId,
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
};

/**
 * Hook to fetch dish detail for management (Admin/Vendor)
 * Returns dish with all statuses
 */
export const useDishManagementDetail = (dishId: string) => {
    return useQuery({
        queryKey: ['dishManagement', dishId],
        queryFn: () => getDishManagementDetail(dishId),
        enabled: !!dishId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
