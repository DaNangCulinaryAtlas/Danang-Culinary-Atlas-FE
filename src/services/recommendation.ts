import axios, { AxiosResponse, AxiosError } from 'axios';
import { ApiResponse } from '@/types/response';
import {
    RecommendationRequest,
    RecommendationResponse,
    HealthCheckResponse,
    TrainingStatusResponse,
    LatestMetricsResponse,
    TrainingHistoryResponse,
    TrainingTriggerResponse
} from '@/types/recommendation';

const RECOMMENDATION_BASE_URL = process.env.NEXT_PUBLIC_RECOMMENDATION_API_URL || 'https://iloveuhiuhiu-danang-food-recsys.hf.space';

export const getRecommendations = async (
    params: RecommendationRequest
): Promise<ApiResponse<RecommendationResponse>> => {
    try {
        const response: AxiosResponse<RecommendationResponse> = await axios.post(
            `${RECOMMENDATION_BASE_URL}/api/v1/recommend`,
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

// Health Check
export const getHealthCheck = async (): Promise<ApiResponse<HealthCheckResponse>> => {
    try {
        const response: AxiosResponse<HealthCheckResponse> = await axios.get(
            `${RECOMMENDATION_BASE_URL}/`
        );

        return {
            success: true,
            data: response.data,
            message: 'Health check successful'
        };
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        return {
            success: false,
            message: axiosError.response?.data?.message || 'Health check failed',
            error: axiosError.message
        };
    }
};

// Training Status
export const getTrainingStatus = async (): Promise<ApiResponse<TrainingStatusResponse>> => {
    try {
        const response: AxiosResponse<TrainingStatusResponse> = await axios.get(
            `${RECOMMENDATION_BASE_URL}/training/status`
        );

        return {
            success: true,
            data: response.data,
            message: 'Training status fetched successfully'
        };
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        return {
            success: false,
            message: axiosError.response?.data?.message || 'Failed to fetch training status',
            error: axiosError.message
        };
    }
};

// Latest Metrics
export const getLatestMetrics = async (): Promise<ApiResponse<LatestMetricsResponse>> => {
    try {
        const response: AxiosResponse<LatestMetricsResponse> = await axios.get(
            `${RECOMMENDATION_BASE_URL}/training/metrics`
        );

        return {
            success: true,
            data: response.data,
            message: 'Latest metrics fetched successfully'
        };
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        return {
            success: false,
            message: axiosError.response?.data?.message || 'Failed to fetch latest metrics',
            error: axiosError.message
        };
    }
};

// Training History
export const getTrainingHistory = async (): Promise<ApiResponse<TrainingHistoryResponse>> => {
    try {
        const response: AxiosResponse<TrainingHistoryResponse> = await axios.get(
            `${RECOMMENDATION_BASE_URL}/training/history`
        );

        return {
            success: true,
            data: response.data,
            message: 'Training history fetched successfully'
        };
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        return {
            success: false,
            message: axiosError.response?.data?.message || 'Failed to fetch training history',
            error: axiosError.message
        };
    }
};

// Trigger Training
export const triggerTraining = async (): Promise<ApiResponse<TrainingTriggerResponse>> => {
    try {
        const response: AxiosResponse<TrainingTriggerResponse> = await axios.post(
            `${RECOMMENDATION_BASE_URL}/training/trigger`
        );

        return {
            success: true,
            data: response.data,
            message: 'Training triggered successfully'
        };
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        return {
            success: false,
            message: axiosError.response?.data?.message || 'Failed to trigger training',
            error: axiosError.message
        };
    }
};
