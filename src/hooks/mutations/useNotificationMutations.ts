import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markNotificationAsRead, markAllNotificationsAsRead } from '@/services/notification';
import { toast } from 'react-toastify';

export const useMarkNotificationAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (notificationId: number) => markNotificationAsRead(notificationId),
        onSuccess: () => {
            // Invalidate notifications cache to refetch
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
        onError: (error: any) => {
            console.error('Failed to mark notification as read:', error);
            if (error?.response?.status === 401) {
                toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', {
                    position: 'top-right',
                    autoClose: 3000,
                });
            } else {
                toast.error('Không thể đánh dấu đã đọc. Vui lòng thử lại.', {
                    position: 'top-right',
                    autoClose: 3000,
                });
            }
        },
    });
};

export const useMarkAllNotificationsAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => markAllNotificationsAsRead(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
        onError: (error: any) => {
            console.error('Failed to mark all notifications as read:', error);
            if (error?.response?.status === 401) {
                toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', {
                    position: 'top-right',
                    autoClose: 3000,
                });
            } else {
                toast.error('Không thể đánh dấu tất cả đã đọc. Vui lòng thử lại.', {
                    position: 'top-right',
                    autoClose: 3000,
                });
            }
        },
    });
};
