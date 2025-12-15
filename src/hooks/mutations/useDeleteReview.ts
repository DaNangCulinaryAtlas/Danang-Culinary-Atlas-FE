import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { deleteReview } from '@/services/review-operations';

interface UseDeleteReviewOptions {
    restaurantId: string;
}

export const useDeleteReview = (options: UseDeleteReviewOptions): UseMutationResult<void, Error, string> => {
    const queryClient = useQueryClient();
    const { restaurantId } = options;

    return useMutation({
        mutationFn: (reviewId: string) => deleteReview(reviewId),
        onSuccess: () => {
            // Refetch reviews after deletion
            queryClient.invalidateQueries({ queryKey: ['reviews', restaurantId] });
        },
    });
};
