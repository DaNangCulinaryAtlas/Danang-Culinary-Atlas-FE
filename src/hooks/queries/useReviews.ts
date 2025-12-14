import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getReviewsByRatingRange, getReviewById, getRestaurantReviewsByRatingRange, replyToReview } from '@/services/review';

export const useReviewsByRatingRange = (
    minRating: number,
    maxRating: number,
    page: number = 0,
    size: number = 10,
    sortBy: string = 'createdAt',
    sortDirection: string = 'desc'
) => {
    return useQuery({
        queryKey: ['reviews', 'rating-range', minRating, maxRating, page, size, sortBy, sortDirection],
        queryFn: () => getReviewsByRatingRange(minRating, maxRating, page, size, sortBy, sortDirection),
    });
};

export const useReviewDetail = (reviewId: string | null) => {
    return useQuery({
        queryKey: ['review', reviewId],
        queryFn: () => getReviewById(reviewId!),
        enabled: !!reviewId,
    });
};

export const useRestaurantReviewsByRatingRange = (
    restaurantId: string | null,
    minRating: number,
    maxRating: number,
    page: number = 0,
    size: number = 10,
    sortBy: string = 'createdAt',
    sortDirection: string = 'desc'
) => {
    return useQuery({
        queryKey: ['restaurant-reviews', restaurantId, 'rating-range', minRating, maxRating, page, size, sortBy, sortDirection],
        queryFn: () => getRestaurantReviewsByRatingRange(restaurantId!, minRating, maxRating, page, size, sortBy, sortDirection),
        enabled: !!restaurantId,
    });
};

export const useReplyReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ reviewId, vendorReply }: { reviewId: string; vendorReply: string }) =>
            replyToReview(reviewId, vendorReply),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['restaurant-reviews'] });
            queryClient.invalidateQueries({ queryKey: ['reviews'] });
        },
    });
};
