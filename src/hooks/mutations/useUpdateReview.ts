import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { updateReview, UpdateReviewPayload, UpdateReviewResponse } from '@/services/review-operations';

interface UseUpdateReviewOptions {
    restaurantId: string;
}

export const useUpdateReview = (options: UseUpdateReviewOptions): UseMutationResult<UpdateReviewResponse, Error, { reviewId: string; payload: UpdateReviewPayload }> => {
    const queryClient = useQueryClient();
    const { restaurantId } = options;

    return useMutation({
        mutationFn: async ({ reviewId, payload }) => updateReview(reviewId, payload),
        onSuccess: () => {
            // Refetch reviews to get the updated data
            queryClient.invalidateQueries({ queryKey: ['reviews', restaurantId] });
        },
    });
};
