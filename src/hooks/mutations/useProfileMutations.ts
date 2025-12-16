import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfile } from '@/services/profile';
import { uploadImageToCloudinary } from '@/services/upload-image';
import { TUpdateProfile, TUserProfile } from '@/types/auth/index';
import { ApiResponse } from '@/types/response';

/**
 * Hook to update user profile
 */
export function useUpdateProfileMutation() {
    const queryClient = useQueryClient();

    return useMutation<
        ApiResponse<TUserProfile>,
        Error,
        { role: string; data: TUpdateProfile }
    >({
        mutationFn: async ({ role, data }) => {
            const response = await updateProfile(role, data);
            if (!response.success) {
                throw new Error(response.message || 'Failed to update profile');
            }
            return response;
        },
        onSuccess: (data, variables) => {
            // Invalidate and refetch profile query
            queryClient.invalidateQueries({ queryKey: ['profile', variables.role] });

            // Optionally update the cache immediately
            queryClient.setQueryData<ApiResponse<TUserProfile>>(
                ['profile', variables.role],
                (oldData) => {
                    if (oldData && data.data) {
                        return {
                            ...oldData,
                            data: data.data,
                        };
                    }
                    return data;
                }
            );
        },
    });
}

/**
 * Hook to upload avatar image
 */
export function useUploadAvatarMutation() {
    return useMutation<ApiResponse<string>, Error, File>({
        mutationFn: async (file: File) => {
            const response = await uploadImageToCloudinary(file);
            if (!response.success) {
                throw new Error(response.message || 'Failed to upload avatar');
            }
            return response;
        },
    });
}
