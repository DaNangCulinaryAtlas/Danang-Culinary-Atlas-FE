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
    // Build query string manually
    const queryParams = new URLSearchParams();

    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);
    if (params.minRating !== undefined) queryParams.append('minRating', params.minRating.toString());
    if (params.maxRating !== undefined) queryParams.append('maxRating', params.maxRating.toString());
    if (params.search) queryParams.append('search', params.search);

    // Add cuisineIDs parameters (multiple values)
    if (params.cuisineIDs && params.cuisineIDs.length > 0) {
      params.cuisineIDs.forEach(id => {
        queryParams.append('cuisineID', id.toString());
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

export const getRestaurantsForMap = async (
  params: getRestaurantsForMapParams
): Promise<ApiResponse> => {
  try {
    const { zoomLevel, minLat, maxLat, minLng, maxLng } = params;

    const queryParams = new URLSearchParams({
      zoomLevel: zoomLevel.toString(),
      minLat: minLat.toString(),
      maxLat: maxLat.toString(),
      minLng: minLng.toString(),
      maxLng: maxLng.toString(),
    });

    const response: AxiosResponse = await instanceAxios.get(
      `${API_ENDPOINTS.RESTAURANT.MAP_VIEW}?${queryParams.toString()}`
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

export const getRestaurantDetail = async (restaurantId: string): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse = await instanceAxios.get(
      API_ENDPOINTS.RESTAURANT.DETAIL(restaurantId)
    );

    return {
      success: true,
      data: response.data,
      message: 'Fetched restaurant detail successfully'
    };
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>;
    return {
      success: false,
      message: axiosError.response?.data?.message || 'Failed to fetch restaurant detail',
      error: axiosError.message
    };
  }
}

export const searchRestaurantsByName = async (params: GetRestaurantsParams): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse = await instanceAxios.get(
      API_ENDPOINTS.RESTAURANT.SEARCH_BY_NAME,
      {
        params
      }
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

export const searchRestaurantsByDish = async (params: {
  dishName: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}): Promise<ApiResponse> => {
  try {
    const { dishName, page = 0, size = 20, sortBy = 'createdAt', sortDirection = 'desc' } = params;

    const response: AxiosResponse = await instanceAxios.get(
      API_ENDPOINTS.RESTAURANT.SEARCH_BY_DISH,
      {
        params: {
          dishName,
          page,
          size,
          sortBy,
          sortDirection,
        }
      }
    );

    return {
      success: true,
      data: response.data,
      message: 'Searched restaurants by dish successfully'
    };
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>;
    return {
      success: false,
      message: axiosError.response?.data?.message || 'Failed to search restaurants by dish',
      error: axiosError.message
    };
  }
}

export const getRestaurantDishes = async (params: {
  restaurantId: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}): Promise<ApiResponse> => {
  try {
    const { restaurantId, page = 0, size = 10, sortBy = 'name', sortDirection = 'asc' } = params;

    const response: AxiosResponse = await instanceAxios.get(
      `/restaurants/${restaurantId}/dishes`,
      {
        params: {
          page,
          size,
          sortBy,
          sortDirection,
        }
      }
    );

    return {
      success: true,
      data: response.data,
      message: 'Fetched restaurant dishes successfully'
    };
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>;
    return {
      success: false,
      message: axiosError.response?.data?.message || 'Failed to fetch restaurant dishes',
      error: axiosError.message
    };
  }
}