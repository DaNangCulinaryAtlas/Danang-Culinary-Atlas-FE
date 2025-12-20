import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserRoleLicenseStatus } from '@/services/admin';
import { toast } from 'react-toastify';

interface UpdateUserRoleLicenseParams {
    userId: string;
    roleId: number;
    licensed: boolean;
}

export const useUpdateUserRoleLicense = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, roleId, licensed }: UpdateUserRoleLicenseParams) =>
            updateUserRoleLicenseStatus(userId, roleId, licensed),
        onSuccess: (_, variables) => {
            // Invalidate the specific user roles query
            queryClient.invalidateQueries({ queryKey: ['user-roles', variables.userId] });

            // Also invalidate the accounts list to refresh any cached data
            queryClient.invalidateQueries({ queryKey: ['accounts-all'] });

            toast.success('Đã cập nhật trạng thái licensed thành công', {
                position: 'top-right',
                autoClose: 3000,
            });
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Không thể cập nhật trạng thái licensed', {
                position: 'top-right',
                autoClose: 3000,
            });
        },
    });
};
