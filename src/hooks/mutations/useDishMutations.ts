import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    createDish,
    updateDish,
    updateDishStatus,
    approveDish
} from '@/services/dish';
import type {
    CreateDishRequest,
    UpdateDishRequest,
    DishApprovalRequest,
    UpdateDishStatusRequest
} from '@/types/dish';
import { ApiResponse } from '@/types/response';

/**
 * Create Dish Mutation Hook
 * Creates a new dish for a restaurant
 */
export function useCreateDish() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateDishRequest) => {
            const response = await createDish(data);
            if (!response.success) {
                throw new Error(response.message || 'Failed to create dish');
            }
            return response;
        },
        onSuccess: (data, variables) => {
            // Invalidate relevant queries
            queryClient.invalidateQueries({ queryKey: ['dishes'] });
            queryClient.invalidateQueries({ queryKey: ['pendingDishes'] });
            queryClient.invalidateQueries({ queryKey: ['vendorRestaurantDishes', variables.restaurantId] });
        },
    });
}

/**
 * Update Dish Mutation Hook
 * Updates an existing dish's information
 */
export function useUpdateDish() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ dishId, data }: { dishId: string; data: UpdateDishRequest }) => {
            const response = await updateDish(dishId, data);
            if (!response.success) {
                throw new Error(response.message || 'Failed to update dish');
            }
            return response;
        },
        onSuccess: (data, variables) => {
            // Invalidate relevant queries
            queryClient.invalidateQueries({ queryKey: ['dishes'] });
            queryClient.invalidateQueries({ queryKey: ['dish', variables.dishId] });
            queryClient.invalidateQueries({ queryKey: ['dishManagement', variables.dishId] });
            queryClient.invalidateQueries({ queryKey: ['vendorRestaurantDishes'] });
        },
    });
}

/**
 * Update Dish Status Mutation Hook
 * Updates dish availability status (AVAILABLE/OUT_OF_STOCK)
 */
export function useUpdateDishStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ dishId, data }: { dishId: string; data: UpdateDishStatusRequest }) => {
            const response = await updateDishStatus(dishId, data);
            if (!response.success) {
                throw new Error(response.message || 'Failed to update dish status');
            }
            return response;
        },
        onSuccess: (data, variables) => {
            // Invalidate relevant queries
            queryClient.invalidateQueries({ queryKey: ['dishes'] });
            queryClient.invalidateQueries({ queryKey: ['dish', variables.dishId] });
            queryClient.invalidateQueries({ queryKey: ['dishManagement', variables.dishId] });
            queryClient.invalidateQueries({ queryKey: ['vendorRestaurantDishes'] });
        },
    });
}

/**
 * Approve/Reject Dish Mutation Hook (Admin only)
 * Approves or rejects a pending dish
 */
export function useApproveDish() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ dishId, data }: { dishId: string; data: DishApprovalRequest }) => {
            const response = await approveDish(dishId, data);
            if (!response.success) {
                throw new Error(response.message || 'Failed to update dish approval status');
            }
            return response;
        },
        onSuccess: (data, variables) => {
            // Invalidate all dish-related queries
            queryClient.invalidateQueries({ queryKey: ['dishes'] });
            queryClient.invalidateQueries({ queryKey: ['pendingDishes'] });
            queryClient.invalidateQueries({ queryKey: ['rejectedDishes'] });
            queryClient.invalidateQueries({ queryKey: ['dish', variables.dishId] });
            queryClient.invalidateQueries({ queryKey: ['dishManagement', variables.dishId] });
            queryClient.invalidateQueries({ queryKey: ['vendorRestaurantDishes'] });
        },
    });
}
