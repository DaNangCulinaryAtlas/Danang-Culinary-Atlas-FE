import instanceAxios from '@/helpers/axios';
import type { ApiResponse } from '@/types/response';
import type {
    DishListResponse,
    DishListParams,
    CreateDishRequest,
    UpdateDishRequest,
    DishApprovalRequest,
    UpdateDishStatusRequest,
    DishApiResponse
} from '@/types/dish';
import { API_ENDPOINTS } from '@/configs/api';

// Get paginated list of dishes with filtering
export const getDishList = async (params?: DishListParams): Promise<ApiResponse<DishListResponse>> => {
    try {
        const response = await instanceAxios.get(API_ENDPOINTS.DISH.LIST, {
            params: {
                page: params?.page ?? 0,
                size: params?.size ?? 20,
                ...(params?.tagId && { tagId: params.tagId }),
                ...(params?.minPrice !== undefined && { minPrice: params.minPrice }),
                ...(params?.maxPrice !== undefined && { maxPrice: params.maxPrice }),
                ...(params?.sortBy && { sortBy: params.sortBy }),
                ...(params?.sortOrder && { sortOrder: params.sortOrder }),
                ...(params?.search && { search: params.search }),
            }
        });
        return {
            success: true,
            data: response.data,
            message: 'Dishes fetched successfully'
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch dishes',
            data: undefined
        };
    }
};

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

// Create a new dish
export const createDish = async (data: CreateDishRequest): Promise<ApiResponse<DishApiResponse>> => {
    try {
        const response = await instanceAxios.post(API_ENDPOINTS.DISH.CREATE, data);
        return {
            success: true,
            data: response.data,
            message: 'Dish created successfully'
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to create dish',
            data: undefined
        };
    }
};

// Update an existing dish
export const updateDish = async (dishId: string, data: UpdateDishRequest): Promise<ApiResponse<DishApiResponse>> => {
    try {
        const response = await instanceAxios.put(API_ENDPOINTS.DISH.UPDATE(dishId), data);
        return {
            success: true,
            data: response.data,
            message: 'Dish updated successfully'
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to update dish',
            data: undefined
        };
    }
};

// Update dish status (AVAILABLE/OUT_OF_STOCK)
export const updateDishStatus = async (dishId: string, data: UpdateDishStatusRequest): Promise<ApiResponse> => {
    try {
        const response = await instanceAxios.patch(API_ENDPOINTS.DISH.UPDATE_STATUS(dishId), data);
        return {
            success: true,
            data: response.data,
            message: 'Dish status updated successfully'
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to update dish status',
            data: null
        };
    }
};

// Get dish detail for management (Admin/Vendor - all statuses)
export const getDishManagementDetail = async (dishId: string): Promise<ApiResponse<DishApiResponse>> => {
    try {
        const response = await instanceAxios.get(API_ENDPOINTS.DISH.MANAGEMENT_DETAIL(dishId));
        return {
            success: true,
            data: response.data,
            message: 'Dish management detail fetched successfully'
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch dish management detail',
            data: undefined
        };
    }
};

// Admin: Approve or reject a dish
export const approveDish = async (dishId: string, data: DishApprovalRequest): Promise<ApiResponse> => {
    try {
        const response = await instanceAxios.patch(API_ENDPOINTS.ADMIN.DISH_APPROVAL(dishId), data);
        return {
            success: true,
            data: response.data,
            message: data.approvalStatus === 'APPROVED' ? 'Dish approved successfully' : 'Dish rejected successfully'
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to update dish approval status',
            data: null
        };
    }
};

// Admin: Get all rejected dishes
export const getRejectedDishes = async (params?: DishListParams): Promise<ApiResponse<DishListResponse>> => {
    try {
        const response = await instanceAxios.get(API_ENDPOINTS.ADMIN.DISHES_REJECTED, {
            params: {
                page: params?.page ?? 0,
                size: params?.size ?? 10,
                ...(params?.sortBy && { sortBy: params.sortBy }),
                ...(params?.sortDirection && { sortDirection: params.sortDirection }),
            }
        });
        return {
            success: true,
            data: response.data,
            message: 'Rejected dishes fetched successfully'
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch rejected dishes',
            data: undefined
        };
    }
};

// Admin: Get all pending dishes
export const getPendingDishes = async (params?: DishListParams): Promise<ApiResponse<DishListResponse>> => {
    try {
        const response = await instanceAxios.get(API_ENDPOINTS.ADMIN.DISHES_PENDING, {
            params: {
                page: params?.page ?? 0,
                size: params?.size ?? 10,
                ...(params?.sortBy && { sortBy: params.sortBy }),
                ...(params?.sortDirection && { sortDirection: params.sortDirection }),
            }
        });
        return {
            success: true,
            data: response.data,
            message: 'Pending dishes fetched successfully'
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch pending dishes',
            data: undefined
        };
    }
};

// Vendor: Get all dishes of a restaurant (including PENDING/REJECTED)
export const getVendorRestaurantDishes = async (restaurantId: string, params?: DishListParams): Promise<ApiResponse<DishListResponse>> => {
    try {
        const response = await instanceAxios.get(API_ENDPOINTS.ADMIN.RESTAURANT_VENDOR_DISHES(restaurantId), {
            params: {
                page: params?.page ?? 0,
                size: params?.size ?? 10,
                ...(params?.sortBy && { sortBy: params.sortBy }),
                ...(params?.sortDirection && { sortDirection: params.sortDirection }),
            }
        });
        return {
            success: true,
            data: response.data,
            message: 'Vendor restaurant dishes fetched successfully'
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch vendor restaurant dishes',
            data: undefined
        };
    }
};
