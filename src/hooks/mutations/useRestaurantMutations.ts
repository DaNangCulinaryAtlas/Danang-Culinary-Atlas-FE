import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRestaurant, updateRestaurant, deleteRestaurant, CreateRestaurantPayload, UpdateRestaurantPayload } from '@/services/vendor';
import { toast } from 'sonner';

export const useCreateRestaurant = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateRestaurantPayload) => {
            const response = await createRestaurant(payload);
            if (!response.success) {
                throw new Error(response.message || 'Failed to create restaurant');
            }
            return response.data;
        },
        onSuccess: () => {
            toast.success('Quán ăn đã được tạo thành công!', {
                description: 'Quán ăn của bạn đang chờ phê duyệt từ admin.'
            });
            // Invalidate vendor restaurants and overview queries
            queryClient.invalidateQueries({ queryKey: ['vendorRestaurants'] });
            queryClient.invalidateQueries({ queryKey: ['vendorOverview'] });
        },
        onError: (error: Error) => {
            toast.error('Không thể tạo quán ăn', {
                description: error.message || 'Vui lòng thử lại sau.'
            });
        }
    });
};

export const useUpdateRestaurant = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ restaurantId, payload }: { restaurantId: string; payload: UpdateRestaurantPayload }) => {
            console.log('Updating restaurant with payload:', { restaurantId, payload }); // Debug log
            const response = await updateRestaurant(restaurantId, payload);
            if (!response.success) {
                console.error('Update failed:', response); // Debug log
                throw new Error(response.message || 'Failed to update restaurant');
            }
            return response.data;
        },
        onSuccess: (data, variables) => {
            toast.success('Quán ăn đã được cập nhật thành công!', {
                description: 'Thông tin quán ăn đã được cập nhật.'
            });
            // Invalidate vendor restaurants and overview queries
            queryClient.invalidateQueries({ queryKey: ['vendorRestaurants'] });
            queryClient.invalidateQueries({ queryKey: ['vendorOverview'] });
            // Invalidate restaurant tags for the updated restaurant
            queryClient.invalidateQueries({ queryKey: ['restaurantTags', variables.restaurantId] });
        },
        onError: (error: Error) => {
            console.error('Update error:', error); // Debug log
            toast.error('Không thể cập nhật quán ăn', {
                description: error.message || 'Vui lòng thử lại sau.'
            });
        }
    });
};

export const useDeleteRestaurant = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (restaurantId: string) => {
            const response = await deleteRestaurant(restaurantId);
            if (!response.success) {
                throw new Error(response.message || 'Failed to delete restaurant');
            }
            return response.data;
        },
        onSuccess: () => {
            toast.success('Quán ăn đã được xóa thành công!', {
                description: 'Quán ăn đã bị xóa khỏi hệ thống.'
            });
            // Invalidate vendor restaurants and overview queries
            queryClient.invalidateQueries({ queryKey: ['vendorRestaurants'] });
            queryClient.invalidateQueries({ queryKey: ['vendorOverview'] });
        },
        onError: (error: Error) => {
            toast.error('Không thể xóa quán ăn', {
                description: error.message || 'Vui lòng thử lại sau.'
            });
        }
    });
};
