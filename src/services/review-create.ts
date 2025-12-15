import instanceAxios from '@/helpers/axios';

export interface CreateReviewPayload {
  restaurantId: string;
  rating: number;
  comment: string;
  images: string[];
}

export interface CreateReviewResponse {
  reviewId: string;
  reviewerAccountId: string;
  reviewerUsername: string;
  restaurantId: string;
  rating: number;
  comment: string;
  images: string[];
  createdAt: string;
}

export const createReview = async (
  payload: CreateReviewPayload
): Promise<CreateReviewResponse> => {
  try {
    console.log('📤 [createReview] Sending review to backend:', payload);
    const response = await instanceAxios.post('/reviews', payload);
    console.log('✅ [createReview] Review created successfully:', response.data);
    console.log('✅ [createReview] Backend should now broadcast this review via WebSocket to /topic/reviews');
    return response.data;
  } catch (error) {
    console.error('❌ [createReview] Error creating review:', error);
    throw error;
  }
};
