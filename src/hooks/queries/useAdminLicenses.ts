import { useQuery } from '@tanstack/react-query';
import { getAdminLicenses, AdminLicensesParams } from '@/services/license';
import type { LicenseFilters } from '@/app/admin/licenses/types';

interface UseAdminLicensesParams {
    filters: LicenseFilters;
    page: number;
    pageSize: number;
}

export const useAdminLicenses = ({ filters, page, pageSize }: UseAdminLicensesParams) => {
    const queryParams: AdminLicensesParams = {
        page: page, // API uses 0-based indexing, page is already 0-based
        size: pageSize,
        sortBy: 'issueDate',
        sortDirection: 'desc',
    };

    if (filters.licenseType !== 'ALL') {
        queryParams.licenseType = filters.licenseType;
    }

    if (filters.approvalStatus !== 'ALL') {
        queryParams.approvalStatus = filters.approvalStatus;
    }

    return useQuery({
        queryKey: ['admin-licenses', filters, page, pageSize],
        queryFn: () => getAdminLicenses(queryParams),
        select: (data) => ({
            licenses: data.content,
            totalLicenses: data.totalElements,
            totalPages: data.totalPages,
        }),
    });
};
