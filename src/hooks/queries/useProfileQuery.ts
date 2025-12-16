import { useQuery } from '@tanstack/react-query';
import { getProfile } from '@/services/profile';
import { TUserProfile } from '@/types/auth/index';
import { ApiResponse } from '@/types/response';

/**
 * Hook to fetch user profile based on role
 * @param role - User role (admin, vendor, or user)
 * @param enabled - Whether the query should run (default: true)
 */
export function useProfileQuery(role: string | undefined, enabled: boolean = true) {
    return useQuery<ApiResponse<TUserProfile>, Error>({
        queryKey: ['profile', role],
        queryFn: async () => {
            if (!role) {
                throw new Error('Role is required to fetch profile');
            }
            const response = await getProfile(role);
            if (!response.success) {
                throw new Error(response.message || 'Failed to fetch profile');
            }
            return response;
        },
        enabled: enabled && !!role,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
}
