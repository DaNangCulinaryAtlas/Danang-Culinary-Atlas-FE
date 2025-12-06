import instanceAxios from '@/helpers/axios';

export interface Notification {
    notificationId: number;
    title: string;
    message: string;
    type: 'NEW_COMMENT' | 'WELCOME' | 'NEW_REVIEW' | 'RESTAURANT_APPROVED' | 'SYSTEM_ALERT' | 'RESTAURANT_SUBMISSION' | 'RESTAURANT_REJECTED';
    targetUrl: string | null;
    isRead: boolean;
    createdAt: string;
}

export interface NotificationsResponse {
    content: Notification[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        offset: number;
    };
    totalPages: number;
    totalElements: number;
    last: boolean;
    first: boolean;
    numberOfElements: number;
}

// Get notifications with pagination
export const getNotifications = async (
    page: number = 0,
    size: number = 10,
    sortBy: string = 'createdAt',
    sortDirection: 'asc' | 'desc' = 'desc'
): Promise<NotificationsResponse> => {
    const response = await instanceAxios.get('/notifications', {
        params: {
            page,
            size,
            sortBy,
            sortDirection,
        },
    });
    return response.data;
};

// Mark single notification as read
export const markNotificationAsRead = async (notificationId: number): Promise<void> => {
    try {
        await instanceAxios.patch(`/notifications/${notificationId}/read`);
        console.log(`✅ Marked notification ${notificationId} as read`);
    } catch (error) {
        console.error(`❌ Failed to mark notification ${notificationId} as read:`, error);
        throw error;
    }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (): Promise<void> => {
    try {
        await instanceAxios.patch('/notifications/mark-all-read');
        console.log('✅ Marked all notifications as read');
    } catch (error) {
        console.error('❌ Failed to mark all notifications as read:', error);
        throw error;
    }
};
