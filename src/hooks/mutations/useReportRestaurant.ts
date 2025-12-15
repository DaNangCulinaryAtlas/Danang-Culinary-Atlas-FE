import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRestaurantReport } from '@/services/report';
import { toast } from 'react-toastify';
import type { CreateReportRequest } from '@/types/report';

export const useReportRestaurant = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateReportRequest) => createRestaurantReport(data),
        onSuccess: () => {
            toast.success('Báo cáo của bạn đã được gửi thành công', {
                position: 'top-right',
                autoClose: 3000,
            });
            // Optionally invalidate related queries if needed
            // queryClient.invalidateQueries({ queryKey: ['reports'] });
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Không thể gửi báo cáo. Vui lòng thử lại sau.';
            toast.error(errorMessage, {
                position: 'top-right',
                autoClose: 3000,
            });
        },
    });
};
