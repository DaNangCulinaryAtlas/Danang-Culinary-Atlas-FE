import instanceAxios from '@/helpers/axios';
import { API_ENDPOINTS } from '@/configs/api';
import type { ApiResponse } from '@/types/response';

// ============= LOCATION SERVICES =============

export interface Province {
    provinceId: number;
    name: string;
    code: string;
}

export interface District {
    districtId: number;
    name: string;
    provinceId: number;
    code: string;
}

export interface Ward {
    wardId: number;
    name: string;
    districtId: number;
    code: string;
}

export const getProvinces = async (): Promise<ApiResponse<Province[]>> => {
    try {
        const response = await instanceAxios.get(API_ENDPOINTS.ADMIN.PROVINCES_LIST);
        const provincesList = Array.isArray(response.data) ? response.data : response.data?.data || [];
        return {
            success: true,
            data: provincesList,
            message: 'Provinces fetched successfully'
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch provinces',
            data: undefined
        };
    }
};

export const getDistrictsByProvince = async (provinceId: number): Promise<ApiResponse<District[]>> => {
    try {
        const response = await instanceAxios.get(API_ENDPOINTS.ADMIN.DISTRICTS_BY_PROVINCE(provinceId.toString()));
        const districtsList = Array.isArray(response.data) ? response.data : response.data?.data || [];
        return {
            success: true,
            data: districtsList,
            message: 'Districts fetched successfully'
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch districts',
            data: undefined
        };
    }
};

export const getWardsByDistrict = async (districtId: number): Promise<ApiResponse<Ward[]>> => {
    try {
        const response = await instanceAxios.get(API_ENDPOINTS.ADMIN.WARDS_BY_DISTRICT(districtId.toString()));
        const wardsList = Array.isArray(response.data) ? response.data : response.data?.data || [];
        return {
            success: true,
            data: wardsList,
            message: 'Wards fetched successfully'
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch wards',
            data: undefined
        };
    }
};

// ============= TAG SERVICES =============

export interface RestaurantTag {
    tagId: number;
    name: string;
    description?: string;
}

export const getRestaurantTags = async (): Promise<ApiResponse<RestaurantTag[]>> => {
    try {
        const response = await instanceAxios.get(API_ENDPOINTS.ADMIN.RESTAURANT_TAGS_LIST);
        const tagsList = Array.isArray(response.data) ? response.data : response.data?.data || [];
        return {
            success: true,
            data: tagsList,
            message: 'Restaurant tags fetched successfully'
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch restaurant tags',
            data: undefined
        };
    }
};
