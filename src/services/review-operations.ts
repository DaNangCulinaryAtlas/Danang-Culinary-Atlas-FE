import instanceAxios from '@/helpers/axios';
import { API_ENDPOINTS } from '@/configs/api';

export interface UpdateReviewPayload {
    rating: number;
    comment: string;
    images: string[];
}

export interface UpdateReviewResponse {
    reviewId: string;
    restaurantId: string;
    rating: number;
    comment: string;
    images: string[];
    createdAt: string;
    updatedAt: string;
}

/**
 * Update an existing review
 * @param reviewId - The ID of the review to update
 * @param payload - Updated review data
 */
export const updateReview = async (
    reviewId: string,
    payload: UpdateReviewPayload
): Promise<UpdateReviewResponse> => {
    try {
        const response = await instanceAxios.put(
            API_ENDPOINTS.ADMIN.REVIEW.UPDATE(reviewId),
            payload
        );
        return response.data;
    } catch (error) {
        console.error('Error updating review:', error);
        throw error;
    }
};

/**
 * Delete a review
 * @param reviewId - The ID of the review to delete
 */
export const deleteReview = async (reviewId: string): Promise<void> => {
    try {
        await instanceAxios.delete(API_ENDPOINTS.ADMIN.REVIEW.DELETE(reviewId));
    } catch (error) {
        console.error('Error deleting review:', error);
        throw error;
    }
};
