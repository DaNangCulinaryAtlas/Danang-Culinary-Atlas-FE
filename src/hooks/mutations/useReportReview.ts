import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReport } from '@/services/report';
import { toast } from 'react-toastify';
import type { CreateReportRequest } from '@/types/report';

export const useReportReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateReportRequest) => createReport(data),
        onSuccess: () => {
            toast.success('Báo cáo đánh giá đã được gửi thành công', {
                position: 'top-right',
                autoClose: 3000,
            });
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
