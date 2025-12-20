import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLicense, updateLicense, deleteLicense } from '@/services/license';
import type { CreateLicenseRequest, UpdateLicenseRequest } from '@/types/license';
import { toast } from 'react-toastify';

export const useCreateLicense = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateLicenseRequest) => createLicense(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vendor-licenses'] });
            toast.success('Giấy phép đã được tạo thành công!', {
                position: 'top-right',
                autoClose: 3000,
            });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Không thể tạo giấy phép. Vui lòng thử lại.', {
                position: 'top-right',
                autoClose: 3000,
            });
        },
    });
};

export const useUpdateLicense = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ licenseId, data }: { licenseId: string; data: UpdateLicenseRequest }) =>
            updateLicense(licenseId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vendor-licenses'] });
            toast.success('Giấy phép đã được cập nhật thành công!', {
                position: 'top-right',
                autoClose: 3000,
            });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Không thể cập nhật giấy phép. Vui lòng thử lại.', {
                position: 'top-right',
                autoClose: 3000,
            });
        },
    });
};

export const useDeleteLicense = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (licenseId: string) => deleteLicense(licenseId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vendor-licenses'] });
            toast.success('Giấy phép đã được xóa thành công!', {
                position: 'top-right',
                autoClose: 3000,
            });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Không thể xóa giấy phép. Vui lòng thử lại.', {
                position: 'top-right',
                autoClose: 3000,
            });
        },
    });
};
