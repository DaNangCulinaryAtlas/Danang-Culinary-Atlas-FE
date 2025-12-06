import instanceAxios from '@/helpers/axios';
import type { ApiResponse } from '@/types/response';

// Get dish detail by ID
export const getDishDetail = async (dishId: string): Promise<ApiResponse> => {
    try {
        const response = await instanceAxios.get(`/dishes/${dishId}`);
        return {
            success: true,
            data: response.data,
            message: response.data?.message || 'Dish detail fetched successfully'
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch dish detail',
            data: null
        };
    }
};
