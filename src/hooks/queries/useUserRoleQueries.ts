import { useQuery } from '@tanstack/react-query';
import { getAllAccounts, searchAccounts, getUserRoles, getAllRoles } from '@/services/admin';

// Hook to get all roles for filter dropdown
export const useGetAllRoles = () => {
    return useQuery({
        queryKey: ['roles-list'],
        queryFn: getAllRoles,
        staleTime: 5 * 60 * 1000, // 5 minutes - roles don't change often
        refetchOnWindowFocus: false,
    });
};

// Hook to get all accounts (without search)
interface UseGetAllAccountsParams {
    page: number;
    size: number;
    sort?: string;
    role?: string;
    status?: string;
}

export const useGetAllAccounts = ({ page, size, sort = 'id,desc', role, status }: UseGetAllAccountsParams) => {
    return useQuery({
        queryKey: ['accounts-all', page, size, sort, role, status],
        queryFn: () =>
            getAllAccounts({
                page,
                size,
                sort,
                role,
                status,
            }),
        staleTime: 30000, // 30 seconds
    });
};

// Hook to search accounts by keyword - no role/status filter
interface UseSearchAccountsParams {
    keyword: string;
    page: number;
    size: number;
    sort?: string;
    enabled?: boolean;
}

export const useSearchAccounts = ({ keyword, page, size, sort = 'id,desc', enabled = true }: UseSearchAccountsParams) => {
    return useQuery({
        queryKey: ['accounts-search', keyword, page, size, sort],
        queryFn: () =>
            searchAccounts({
                keyword,
                page,
                size,
                sort,
            }),
        enabled: enabled && !!keyword && keyword.trim().length > 0,
        staleTime: 30000, // 30 seconds
    });
};

interface UseGetUserRolesParams {
    userId: string;
    enabled?: boolean;
}

export const useGetUserRoles = ({ userId, enabled = true }: UseGetUserRolesParams) => {
    return useQuery({
        queryKey: ['user-roles', userId],
        queryFn: () => getUserRoles(userId),
        enabled: enabled && !!userId,
        staleTime: 60000, // 1 minute
    });
};
