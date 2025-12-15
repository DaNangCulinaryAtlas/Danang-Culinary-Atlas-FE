import instanceAxios from '@/helpers/axios';
import type { ApiResponse } from '@/types/response';
import { API_ENDPOINTS } from '@/configs/api';

// ============= VENDOR OVERVIEW =============

export interface VendorOverview {
    totalRestaurants: number;
    totalDishes: number;
    totalReviews: number;
}

export const getVendorOverview = async (): Promise<ApiResponse<VendorOverview>> => {
    try {
        const response = await instanceAxios.get(API_ENDPOINTS.VENDOR.OVERVIEW);
        return {
            success: true,
            data: response.data.data,
            message: response.data.message || 'Vendor overview fetched successfully'
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch vendor overview',
            data: undefined
        };
    }
};

export interface VendorRestaurantListParams {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
}

export interface VendorRestaurantItem {
    restaurantId: string;
    ownerAccountId: string;
    name: string;
    address: string;
    images: {
        photo: string | null;
        sub_photo: string[];
    } | null;
    wardId: number | null;
    status: string;
    createdAt: string;
    approvalStatus: string;
    approvedByAccountId: string | null;
    approvedAt: string | null;
    rejectionReason: string | null;
    tags: string[] | null;
    latitude: number | null;
    longitude: number | null;
    openingHours: Record<string, unknown>;
    averageRating: number;
    totalReviews: number;
}

export interface VendorRestaurantListResponse {
    content: VendorRestaurantItem[];
    pageable: {
        pageNumber: number;
        pageSize: number;
    };
    totalPages: number;
    totalElements: number;
    first: boolean;
    last: boolean;
}

// Get all restaurants of a vendor
export const getVendorRestaurants = async (
    vendorId: string,
    params?: VendorRestaurantListParams
): Promise<ApiResponse<VendorRestaurantListResponse>> => {
    try {
        const response = await instanceAxios.get(API_ENDPOINTS.VENDOR.RESTAURANTS_LIST(vendorId), {
            params: {
                page: params?.page ?? 0,
                size: params?.size ?? 100,
                sortBy: params?.sortBy ?? 'createdAt',
                sortDirection: params?.sortDirection ?? 'desc',
            }
        });
        return {
            success: true,
            data: response.data,
            message: 'Vendor restaurants fetched successfully'
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch vendor restaurants',
            data: undefined
        };
    }
};

// Get all restaurants of a vendor (fetch all pages)
export const getAllVendorRestaurants = async (
    vendorId: string,
    sortBy: string = 'createdAt',
    sortDirection: 'asc' | 'desc' = 'desc'
): Promise<ApiResponse<VendorRestaurantItem[]>> => {
    try {
        const allRestaurants: VendorRestaurantItem[] = [];
        let currentPage = 0;
        const pageSize = 100;
        let hasMore = true;

        while (hasMore) {
            const response = await instanceAxios.get(API_ENDPOINTS.VENDOR.RESTAURANTS_LIST(vendorId), {
                params: {
                    page: currentPage,
                    size: pageSize,
                    sortBy,
                    sortDirection,
                }
            });

            const data = response.data;
            const content = data?.content || [];
            allRestaurants.push(...content);

            if (data.last || content.length < pageSize) {
                hasMore = false;
            } else {
                currentPage++;
            }
        }

        return {
            success: true,
            data: allRestaurants,
            message: 'All vendor restaurants fetched successfully'
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch vendor restaurants',
            data: undefined
        };
    }
};

// ============= VENDOR DISH MANAGEMENT =============

export interface VendorDishItem {
    dishId: string;
    restaurantId: string;
    name: string;
    images: string[];
    description: string;
    price: number;
    status: 'AVAILABLE' | 'UNAVAILABLE';
    approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
    approvedAt: string | null;
    rejectionReason: string | null;
}

// ============= VENDOR RESTAURANT CREATION =============

export interface CreateRestaurantPayload {
    name: string;
    address: string;
    images: {
        photo: string;
        sub_photo: string[];
    };
    wardId: number;
    latitude: number;
    longitude: number;
    tagIds: number[];
    openingHours: Record<string, string>;
}

export interface CreateRestaurantResponse {
    restaurantId: string;
    ownerAccountId: string;
    name: string;
    address: string;
    images: {
        photo: string;
        sub_photo: string[];
    };
    wardId: number;
    status: string;
    createdAt: string;
    approvalStatus: string;
    approvedByAccountId: string | null;
    approvedAt: string | null;
    rejectionReason: string | null;
    tags: string[] | null;
    latitude: number;
    longitude: number;
    openingHours: Record<string, string>;
    averageRating: number | null;
    totalReviews: number | null;
}

export const createRestaurant = async (
    payload: CreateRestaurantPayload
): Promise<ApiResponse<CreateRestaurantResponse>> => {
    try {
        const response = await instanceAxios.post(API_ENDPOINTS.VENDOR.RESTAURANT_CREATE, payload);
        return {
            success: true,
            data: response.data,
            message: 'Restaurant created successfully'
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to create restaurant',
            data: undefined
        };
    }
};

export interface VendorDishListResponse {
    content: VendorDishItem[];
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

export interface VendorDishListParams {
    page?: number;
    size?: number;
    sortBy?: 'name' | 'price' | 'createdAt';
    sortDirection?: 'asc' | 'desc';
}

// Get all dishes of a restaurant for vendor (including pending/rejected)
export const getVendorRestaurantDishes = async (
    restaurantId: string,
    params?: VendorDishListParams
): Promise<ApiResponse<VendorDishListResponse>> => {
    try {
        const response = await instanceAxios.get(API_ENDPOINTS.VENDOR.RESTAURANT_VENDOR_DISHES(restaurantId), {
            params: {
                page: params?.page ?? 0,
                size: params?.size ?? 10,
                sortBy: params?.sortBy ?? 'name',
                sortDirection: params?.sortDirection ?? 'asc',
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

// Get approved dishes only for a restaurant
export const getVendorApprovedDishes = async (
    restaurantId: string,
    params?: VendorDishListParams
): Promise<ApiResponse<VendorDishListResponse>> => {
    try {
        const response = await instanceAxios.get(API_ENDPOINTS.VENDOR.RESTAURANT_DISHES(restaurantId), {
            params: {
                page: params?.page ?? 0,
                size: params?.size ?? 10,
                sortBy: params?.sortBy ?? 'name',
                sortDirection: params?.sortDirection ?? 'asc',
            }
        });
        return {
            success: true,
            data: response.data,
            message: 'Vendor approved dishes fetched successfully'
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch vendor approved dishes',
            data: undefined
        };
    }
};

