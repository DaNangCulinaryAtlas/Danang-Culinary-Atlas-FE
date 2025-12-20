import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateLicenseStatus, UpdateLicenseStatusRequest } from '@/services/license';
import { toast } from 'react-toastify';
import type { ApprovalStatus } from '@/app/admin/licenses/types';

export const useUpdateLicenseStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ licenseId, data }: { licenseId: string; data: UpdateLicenseStatusRequest }) =>
            updateLicenseStatus(licenseId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-licenses'] });
            toast.success('Đã cập nhật trạng thái giấy phép thành công!', {
                position: 'top-right',
                autoClose: 3000,
            });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Không thể cập nhật trạng thái giấy phép. Vui lòng thử lại.', {
                position: 'top-right',
                autoClose: 3000,
            });
        },
    });
};

// Helper hook for quick approve action
export const useApproveLicense = () => {
    const updateMutation = useUpdateLicenseStatus();

    const approveLicense = async (licenseId: string) => {
        return updateMutation.mutateAsync({
            licenseId,
            data: {
                status: 'APPROVED',
            },
        });
    };

    return {
        approveLicense,
        isPending: updateMutation.isPending,
    };
};

// Helper hook for quick reject action
export const useRejectLicense = () => {
    const updateMutation = useUpdateLicenseStatus();

    const rejectLicense = async (licenseId: string, reason: string) => {
        return updateMutation.mutateAsync({
            licenseId,
            data: {
                status: 'REJECTED',
                rejectionReason: reason,
            },
        });
    };

    return {
        rejectLicense,
        isPending: updateMutation.isPending,
    };
};

// Generic hook for updating to any status
export const useUpdateLicenseStatusGeneric = () => {
    const updateMutation = useUpdateLicenseStatus();

    const updateStatus = async (
        licenseId: string,
        approvalStatus: ApprovalStatus,
        reason?: string
    ) => {
        const data: UpdateLicenseStatusRequest = {
            status: approvalStatus,
        };
        if (approvalStatus === 'REJECTED' && reason) {
            data.rejectionReason = reason;
        }

        return updateMutation.mutateAsync({ licenseId, data });
    };

    return {
        updateStatus,
        isPending: updateMutation.isPending,
    };
};
