import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRestaurant, CreateRestaurantPayload } from '@/services/vendor';
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
