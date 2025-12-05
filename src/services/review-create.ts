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
    const response = await instanceAxios.post('/reviews', payload);
    return response.data;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};
