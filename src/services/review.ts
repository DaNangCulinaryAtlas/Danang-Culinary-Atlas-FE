import instanceAxios from '@/helpers/axios';
import { API_ENDPOINTS } from '@/configs/api';

export interface Review {
    reviewId: string;
    reviewerAccountId: string;
    reviewerUsername: string;
    restaurantId: string;
    dishId: string | null;
    rating: number;
    comment: string;
    images: string[];
    createdAt: string;
    vendorReply: string | null;
    repliedAt: string | null;
    hasOpenReport: boolean;
}

export interface ReviewsResponse {
    content: Review[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            sorted: boolean;
            empty: boolean;
            unsorted: boolean;
        };
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    totalPages: number;
    totalElements: number;
    last: boolean;
    size: number;
    number: number;
    sort: {
        sorted: boolean;
        empty: boolean;
        unsorted: boolean;
    };
    numberOfElements: number;
    first: boolean;
    empty: boolean;
}

export const getRestaurantReviews = async (
    restaurantId: string,
    page: number = 0,
    size: number = 10,
    sortBy: string = 'createdAt',
    sortDirection: string = 'desc'
): Promise<ReviewsResponse> => {
    try {
        const response = await instanceAxios.get(
            `/restaurants/${restaurantId}/reviews`,
            {
                params: {
                    page,
                    size,
                    sortBy,
                    sortDirection,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching reviews:', error);
        throw error;
    }
};
