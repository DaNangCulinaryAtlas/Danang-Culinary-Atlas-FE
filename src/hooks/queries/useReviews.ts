import { useQuery } from '@tanstack/react-query';
import { getReviewsByRatingRange, getReviewById } from '@/services/review';

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
