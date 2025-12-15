import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import { getNotifications, type NotificationsResponse } from '@/services/notification';

export const useNotifications = (size: number = 10) => {
    return useInfiniteQuery<NotificationsResponse>({
        queryKey: ['notifications', size],
        queryFn: ({ pageParam = 0 }) => getNotifications(pageParam as number, size),
        getNextPageParam: (lastPage) => {
            if (lastPage.last) return undefined;
            return lastPage.pageable.pageNumber + 1;
        },
        initialPageParam: 0,
        staleTime: 30000, // 30 seconds
        gcTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Hook to get unread count
export const useUnreadNotificationsCount = () => {
    return useQuery({
        queryKey: ['notifications', 'unread-count'],
        queryFn: async () => {
            const data = await getNotifications(0, 1);
            // Count unread from first page as estimate
            const firstPageData = await getNotifications(0, 100);
            return firstPageData.content.filter(n => !n.isRead).length;
        },
        staleTime: 30000,
        gcTime: 5 * 60 * 1000,
    });
};
