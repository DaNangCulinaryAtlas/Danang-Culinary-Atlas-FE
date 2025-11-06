import { API_ENDPOINTS } from '@/configs/api';
import { GetRestaurantsParams } from '@/types/restaurant/index';
import  { AxiosResponse, AxiosError } from 'axios';  
import instanceAxios from '@/helpers/axios';
import { ApiResponse } from '@/types/response';

export const getRestaurants = async (
    params: GetRestaurantsParams
  ): Promise<ApiResponse> => {
    try {
      const response: AxiosResponse = await instanceAxios.get(
        API_ENDPOINTS.RESTAURANT.LIST,
        { params }
      );
  
      return {
        success: true,
        data: response.data,
        message: 'Fetched restaurants successfully'
      };
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Failed to fetch restaurants',
        error: axiosError.message
      };
    }
}