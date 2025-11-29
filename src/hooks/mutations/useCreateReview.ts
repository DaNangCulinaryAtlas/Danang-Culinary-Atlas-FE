import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { createReview, CreateReviewPayload, CreateReviewResponse } from '@/services/review-create';

interface UseCreateReviewOptions {
  restaurantId: string;
}

export const useCreateReview = (options: UseCreateReviewOptions): UseMutationResult<CreateReviewResponse, Error, CreateReviewPayload> => {
  const queryClient = useQueryClient();
  const { restaurantId } = options;

  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => createReview(payload),
    onSuccess: () => {
      // Refetch reviews to get the newly posted review from server
      queryClient.invalidateQueries({ queryKey: ['reviews', restaurantId] });
    },
  });
};
