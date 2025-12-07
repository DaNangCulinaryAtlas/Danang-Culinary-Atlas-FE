import { useQuery } from '@tanstack/react-query';
import { getRolesWithPermissions } from '@/services/admin';

/**
 * Hook để lấy danh sách roles với permissions chi tiết
 * 
 * @returns Query result với data, isLoading, error
 * 
 * Config:
 * - staleTime: 5 phút - Permission data ít thay đổi
 * - refetchOnWindowFocus: false - Không cần refetch khi focus
 */
export const useRolesWithPermissions = () => {
    return useQuery({
        queryKey: ['admin', 'roles-with-permissions'],
        queryFn: getRolesWithPermissions,
        staleTime: 5 * 60 * 1000, // 5 phút
        refetchOnWindowFocus: false,
    });
};
