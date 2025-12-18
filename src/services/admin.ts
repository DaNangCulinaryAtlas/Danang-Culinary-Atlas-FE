import { API_ENDPOINTS } from '@/configs/api';
import { AxiosResponse, AxiosError } from 'axios';
import instanceAxios from '@/helpers/axios';
import { ApiResponse } from '@/types/response';

export interface AdminOverviewData {
    totalUserAccounts: number;
    totalVendorAccounts: number;
    totalApprovedRestaurants: number;
    totalPendingRestaurants: number;
}

export const getAdminOverview = async (): Promise<AdminOverviewData> => {
    try {
        const response: AxiosResponse = await instanceAxios.get(
            API_ENDPOINTS.ADMIN.OVERVIEW
        );

        return response.data.data;
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        throw new Error(
            axiosError.response?.data?.message || 'Failed to fetch admin overview'
        );
    }
};

export interface RestaurantCountByTag {
    tagId: number;
    tagName: string;
    restaurantCount: number;
}

export const getRestaurantCountByTag = async (): Promise<RestaurantCountByTag[]> => {
    try {
        const response: AxiosResponse = await instanceAxios.get(
            API_ENDPOINTS.ADMIN.RESTAURANT_COUNT_BY_TAG
        );

        return response.data.data;
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        throw new Error(
            axiosError.response?.data?.message || 'Failed to fetch restaurant count by tag'
        );
    }
};

// Permission Management Types
export interface RoleData {
    roleId: number;
    roleName: string;
    description?: string;
}

export interface ActionData {
    actionId: number;
    actionName: string;
    actionCode: string;
}

export interface RoleWithPermissions {
    roleId: number;
    roleName: string;
    description?: string;
    actions: ActionData[];
}

// Permission Management Services
export const getAllRoles = async (): Promise<RoleData[]> => {
    try {
        const response: AxiosResponse = await instanceAxios.get(
            API_ENDPOINTS.ADMIN.ROLES_LIST
        );

        return Array.isArray(response.data) ? response.data : response.data.data || [];
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        throw new Error(
            axiosError.response?.data?.message || 'Failed to fetch roles'
        );
    }
};

export const getAllActions = async (): Promise<ActionData[]> => {
    try {
        const response: AxiosResponse = await instanceAxios.get(
            API_ENDPOINTS.ADMIN.ACTIONS_LIST
        );

        return Array.isArray(response.data) ? response.data : response.data.data || [];
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        throw new Error(
            axiosError.response?.data?.message || 'Failed to fetch actions'
        );
    }
};

export const getRolesWithPermissions = async (): Promise<RoleWithPermissions[]> => {
    try {
        const response: AxiosResponse = await instanceAxios.get(
            API_ENDPOINTS.ADMIN.ROLES_WITH_PERMISSIONS
        );

        return Array.isArray(response.data) ? response.data : response.data.data || [];
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        throw new Error(
            axiosError.response?.data?.message || 'Failed to fetch roles with permissions'
        );
    }
};

export const getPermissionsForRole = async (roleId: string): Promise<ActionData[]> => {
    try {
        const response: AxiosResponse = await instanceAxios.get(
            API_ENDPOINTS.ADMIN.PERMISSIONS_FOR_ROLE(roleId)
        );

        return Array.isArray(response.data) ? response.data : response.data.data || [];
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        throw new Error(
            axiosError.response?.data?.message || 'Failed to fetch permissions for role'
        );
    }
};

export interface UpdatePermissionsResponse {
    status: string;
    message: string;
}

export const updateRolePermissions = async (
    roleId: number,
    actionIds: number[]
): Promise<UpdatePermissionsResponse> => {
    try {
        const response: AxiosResponse = await instanceAxios.patch(
            API_ENDPOINTS.ADMIN.PERMISSIONS_UPDATE,
            { roleId, actionIds }
        );

        return {
            status: response.data.status || 'success',
            message: response.data.message || 'Cập nhật permissions thành công'
        };
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        throw new Error(
            axiosError.response?.data?.message || 'Failed to update role permissions'
        );
    }
};

// Dish Management Services
export const searchAdminDishes = async (params: {
    dishName?: string;
    status?: 'PENDING' | 'REJECTED' | 'APPROVED';
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
}): Promise<ApiResponse> => {
    try {
        const response: AxiosResponse = await instanceAxios.get(
            API_ENDPOINTS.ADMIN.DISHES_LIST,
            {
                params: {
                    ...(params.dishName && { search: params.dishName }),
                    ...(params.status && { status: params.status }),
                    page: params.page ?? 0,
                    size: params.size ?? 10,
                    sortBy: params.sortBy ?? 'name',
                    sortDirection: params.sortDirection ?? 'desc',
                }
            }
        );

        return {
            success: true,
            data: response.data,
            message: 'Dishes fetched successfully'
        };
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        return {
            success: false,
            message: axiosError.response?.data?.message || 'Failed to search dishes',
            error: axiosError.message
        };
    }
};