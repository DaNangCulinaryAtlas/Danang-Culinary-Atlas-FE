import { AxiosError, AxiosResponse } from 'axios';
import instanceAxios from '@/helpers/axios';
import { API_ENDPOINTS } from '@/configs/api';
import { TUserProfile, TUpdateProfile } from '@/types/auth';
import { ApiResponse } from '@/types/response';

// Get profile endpoint based on user role
const getProfileEndpoint = (role: string): string => {
    const normalizedRole = role.toUpperCase();

    if (normalizedRole === 'ADMIN') {
        return API_ENDPOINTS.PROFILE.ADMIN;
    } else if (normalizedRole === 'VENDOR') {
        return API_ENDPOINTS.PROFILE.VENDOR;
    } else {
        return API_ENDPOINTS.PROFILE.USER;
    }
};

// Get update profile endpoint based on user role
const getUpdateProfileEndpoint = (role: string): string => {
    const normalizedRole = role.toUpperCase();

    if (normalizedRole === 'ADMIN') {
        return API_ENDPOINTS.PROFILE.UPDATE_ADMIN;
    } else if (normalizedRole === 'VENDOR') {
        return API_ENDPOINTS.PROFILE.UPDATE_VENDOR;
    } else {
        return API_ENDPOINTS.PROFILE.UPDATE_USER;
    }
};

export const getProfile = async (role: string): Promise<ApiResponse<TUserProfile>> => {
    try {
        const endpoint = getProfileEndpoint(role);
        const response: AxiosResponse = await instanceAxios.get(endpoint);
        // const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        // userData.accountId = response.data.data.accountId;
        // localStorage.setItem('userData', JSON.stringify(userData));
        return {
            success: true,
            data: response.data.data,
            message: 'Profile fetched successfully'
        };
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        return {
            success: false,
            message: axiosError.response?.data?.message || 'Failed to fetch profile',
            error: axiosError.message
        };
    }
};

export const updateProfile = async (
    role: string,
    data: TUpdateProfile
): Promise<ApiResponse<TUserProfile>> => {
    try {
        const endpoint = getUpdateProfileEndpoint(role);
        const response: AxiosResponse = await instanceAxios.put(endpoint, data);

        return {
            success: true,
            data: response.data.data,
            message: 'Profile updated successfully'
        };
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        return {
            success: false,
            message: axiosError.response?.data?.message || 'Failed to update profile',
            error: axiosError.message
        };
    }
};
