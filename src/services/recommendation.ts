import axios, { AxiosResponse, AxiosError } from 'axios';
import { ApiResponse } from '@/types/response';
import { RecommendationRequest, RecommendationResponse } from '@/types/recommendation';

const RECOMMENDATION_BASE_URL = 'https://iloveuhiuhiu-danang-food-recsys.hf.space/api/v1';

export const getRecommendations = async (
    params: RecommendationRequest
): Promise<ApiResponse<RecommendationResponse>> => {
    try {
        const response: AxiosResponse<RecommendationResponse> = await axios.post(
            `${RECOMMENDATION_BASE_URL}/recommend`,
            {
                hour: params.hour,
                k: params.k,
                target_type: params.target_type,
                user_id: params.user_id
            }
        );

        return {
            success: true,
            data: response.data,
            message: 'Fetched recommendations successfully'
        };
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        return {
            success: false,
            message: axiosError.response?.data?.message || 'Failed to fetch recommendations',
            error: axiosError.message
        };
    }
};
