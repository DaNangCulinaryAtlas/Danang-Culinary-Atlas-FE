import instanceAxios from '@/helpers/axios';
import { API_ENDPOINTS } from '@/configs/api';
import type { License, CreateLicenseRequest, UpdateLicenseRequest } from '@/types/license';

export const getMyLicenses = async (): Promise<License[]> => {
    const response = await instanceAxios.get(API_ENDPOINTS.LICENSE.MY_LICENSES);
    return response.data;
};

export const createLicense = async (data: CreateLicenseRequest): Promise<License> => {
    const response = await instanceAxios.post(API_ENDPOINTS.LICENSE.CREATE, data);
    return response.data;
};

export const updateLicense = async (licenseId: string, data: UpdateLicenseRequest): Promise<License> => {
    const response = await instanceAxios.patch(API_ENDPOINTS.LICENSE.UPDATE(licenseId), data);
    return response.data;
};

export const deleteLicense = async (licenseId: string): Promise<void> => {
    await instanceAxios.delete(API_ENDPOINTS.LICENSE.DELETE(licenseId));
};

// Admin APIs
export interface AdminLicensesParams {
    page: number;
    size: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    licenseType?: string;
    approvalStatus?: string;
}

export interface AdminLicensesResponse {
    content: License[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

export const getAdminLicenses = async (params: AdminLicensesParams): Promise<AdminLicensesResponse> => {
    const response = await instanceAxios.get(API_ENDPOINTS.LICENSE.ADMIN_LIST, { params });
    return response.data;
};

export interface UpdateLicenseStatusRequest {
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    rejectionReason?: string;
}

export const updateLicenseStatus = async (
    licenseId: string,
    data: UpdateLicenseStatusRequest
): Promise<License> => {
    const response = await instanceAxios.patch(API_ENDPOINTS.LICENSE.ADMIN_UPDATE_STATUS(licenseId), data);
    return response.data;
};
