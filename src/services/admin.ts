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
    requiresLicense?: boolean;
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
            API_ENDPOINTS.ADMIN.ROLE_LIST
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

export interface PermissionConfigurationResponse {
    status: string;
    message: string;
}

export const updatePermissionConfiguration = async (
    roleId: number,
    actionId: number,
    requiresLicense: boolean
): Promise<PermissionConfigurationResponse> => {
    try {
        const response: AxiosResponse = await instanceAxios.patch(
            API_ENDPOINTS.ADMIN.PERMISSION_CONFIGURATION(roleId.toString(), actionId.toString()),
            null,
            {
                params: { requiresLicense }
            }
        );

        return {
            status: response.data.status || 'success',
            message: response.data.message || 'Cập nhật cấu hình permission thành công'
        };
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        throw new Error(
            axiosError.response?.data?.message || 'Failed to update permission configuration'
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

// Role Management Services
export interface CreateRoleRequest {
    roleName: string;
    description?: string;
}

export interface UpdateRoleRequest {
    roleName?: string;
    description?: string;
}

export const createRole = async (data: CreateRoleRequest): Promise<RoleData> => {
    try {
        const response: AxiosResponse = await instanceAxios.post(
            API_ENDPOINTS.ADMIN.ROLE_CREATE,
            data
        );

        return response.data.data || response.data;
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        throw new Error(
            axiosError.response?.data?.message || 'Failed to create role'
        );
    }
};

export const updateRole = async (roleId: number, data: UpdateRoleRequest): Promise<RoleData> => {
    try {
        const response: AxiosResponse = await instanceAxios.patch(
            API_ENDPOINTS.ADMIN.ROLE_UPDATE(roleId.toString()),
            data
        );

        return response.data.data || response.data;
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        throw new Error(
            axiosError.response?.data?.message || 'Failed to update role'
        );
    }
};

export const deleteRole = async (roleId: number): Promise<void> => {
    try {
        await instanceAxios.delete(
            API_ENDPOINTS.ADMIN.ROLE_DELETE(roleId.toString())
        );
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        throw new Error(
            axiosError.response?.data?.message || 'Failed to delete role'
        );
    }
};

// User Role Management Services
export interface UserRole {
    roleId: number;
    roleName: string;
    description?: string;
    licensed: boolean;
}

export interface UserWithRoles {
    accountId: string;
    email: string;
    fullName: string;
    avatarUrl: string;
    status: string;
    role: string;
    createdAt: string;
}

export interface SearchUsersResponse {
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNext: boolean;
    hasPrevious: boolean;
    content: UserWithRoles[];
}

// Get all accounts (without keyword search)
export const getAllAccounts = async (params?: {
    page?: number;
    size?: number;
    sort?: string;
    role?: string;
    status?: string;
}): Promise<SearchUsersResponse> => {
    try {
        const response: AxiosResponse = await instanceAxios.get(
            API_ENDPOINTS.ADMIN.ACCOUNTS_ALL,
            {
                params: {
                    page: params?.page ?? 0,
                    size: params?.size ?? 20,
                    sort: params?.sort ?? 'id,desc',
                    ...(params?.role && { role: params.role }),
                    ...(params?.status && { status: params.status })
                }
            }
        );

        // The API response structure is: { status, message, data: { content, pageable, totalElements, etc } }
        const apiData = response.data.data || response.data;

        // Map the API response to our interface
        return {
            totalElements: apiData.totalElements || 0,
            totalPages: apiData.totalPages || 0,
            currentPage: apiData.number || apiData.pageable?.pageNumber || 0,
            pageSize: apiData.size || apiData.pageable?.pageSize || 20,
            hasNext: !apiData.last,
            hasPrevious: !apiData.first,
            content: apiData.content || []
        };
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        throw new Error(
            axiosError.response?.data?.message || 'Failed to get all accounts'
        );
    }
};

// Search accounts by keyword (with debounce) - no role/status filter
export const searchAccounts = async (params: {
    keyword: string;
    page?: number;
    size?: number;
    sort?: string;
}): Promise<SearchUsersResponse> => {
    try {
        const response: AxiosResponse = await instanceAxios.get(
            API_ENDPOINTS.ADMIN.ACCOUNTS_SEARCH,
            {
                params: {
                    keyword: params.keyword,
                    page: params?.page ?? 0,
                    size: params?.size ?? 20,
                    sort: params?.sort ?? 'id,desc'
                }
            }
        );

        // The API response structure is: { status, message, data: { content, pageable, totalElements, etc } }
        const apiData = response.data.data || response.data;

        // Map the API response to our interface
        return {
            totalElements: apiData.totalElements || 0,
            totalPages: apiData.totalPages || 0,
            currentPage: apiData.number || apiData.pageable?.pageNumber || 0,
            pageSize: apiData.size || apiData.pageable?.pageSize || 20,
            hasNext: !apiData.last,
            hasPrevious: !apiData.first,
            content: apiData.content || []
        };
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        throw new Error(
            axiosError.response?.data?.message || 'Failed to search accounts'
        );
    }
};

export const getUserRoles = async (userId: string): Promise<UserRole[]> => {
    try {
        const response: AxiosResponse = await instanceAxios.get(
            API_ENDPOINTS.ADMIN.USER_ROLES(userId)
        );

        return Array.isArray(response.data) ? response.data : response.data.data || [];
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        throw new Error(
            axiosError.response?.data?.message || 'Failed to fetch user roles'
        );
    }
};

export const updateUserRoleLicenseStatus = async (
    userId: string,
    roleId: number,
    licensed: boolean
): Promise<UserRole> => {
    try {
        const response: AxiosResponse = await instanceAxios.patch(
            API_ENDPOINTS.ADMIN.USER_ROLE_UPDATE_STATUS(userId, roleId.toString()),
            null,
            {
                params: { licensed }
            }
        );

        return response.data.data || response.data;
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        throw new Error(
            axiosError.response?.data?.message || 'Failed to update user role license status'
        );
    }
};