import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteReview } from '@/services/review';
import { toast } from 'sonner';

export const useDeleteReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (reviewId: string) => deleteReview(reviewId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reviews'] });
            toast.success('Review deleted successfully');
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message;
            if (errorMessage?.includes('foreign key constraint') || errorMessage?.includes('still referenced')) {
                toast.error('Cannot delete review: This review has related reports. Please resolve or delete the reports first.');
            } else {
                toast.error(errorMessage || 'Failed to delete review');
            }
        },
    });
};
