import { API_ENDPOINTS } from '@/configs/api';
import { getRestaurantsForMapParams, GetRestaurantsParams } from '@/types/restaurant/index';
import { AxiosResponse, AxiosError } from 'axios';
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

export const searchRestaurants = async (
  params: GetRestaurantsParams
): Promise<ApiResponse> => {
  try {
    // Build query string manually to handle cuisineTypes array properly
    const queryParams = new URLSearchParams();

    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);
    if (params.minRating !== undefined) queryParams.append('minRating', params.minRating.toString());
    if (params.maxRating !== undefined) queryParams.append('maxRating', params.maxRating.toString());
    if (params.search) queryParams.append('search', params.search);

    // Add each cuisine type as a separate parameter
    if (params.cuisineTypes && params.cuisineTypes.length > 0) {
      params.cuisineTypes.forEach(cuisineType => {
        queryParams.append('cuisineTypes', cuisineType);
      });
    }

    const response: AxiosResponse = await instanceAxios.get(
      `${API_ENDPOINTS.RESTAURANT.SEARCH}?${queryParams.toString()}`
    );

    return {
      success: true,
      data: response.data,
      message: 'Searched restaurants successfully'
    };
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>;
    return {
      success: false,
      message: axiosError.response?.data?.message || 'Failed to search restaurants',
      error: axiosError.message
    };
  }
}

export const searchRestaurantsByName = async (
  params: GetRestaurantsParams & { name: string }
): Promise<ApiResponse> => {
  try {
    const queryParams = new URLSearchParams();

    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);
    if (params.name) queryParams.append('name', params.name);

    const response: AxiosResponse = await instanceAxios.get(
      `${API_ENDPOINTS.RESTAURANT.SEARCH_BY_NAME}?${queryParams.toString()}`
    );

    return {
      success: true,
      data: response.data,
      message: 'Searched restaurants by name successfully'
    };
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>;
    return {
      success: false,
      message: axiosError.response?.data?.message || 'Failed to search restaurants by name',
      error: axiosError.message
    };
  }
}

export const getRestaurantsForMap = async (
  params: getRestaurantsForMapParams
): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse = await instanceAxios.get(
      API_ENDPOINTS.RESTAURANT.MAP_VIEW,
      { params }
    );

    return {
      success: true,
      data: response.data,
      message: 'Fetched restaurants for map successfully'
    };
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>;
    return {
      success: false,
      message: axiosError.response?.data?.message || 'Failed to fetch restaurants for map',
      error: axiosError.message
    };
  }
}