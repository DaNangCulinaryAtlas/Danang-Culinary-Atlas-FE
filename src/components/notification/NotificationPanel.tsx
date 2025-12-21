'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Bell, Check, CheckCheck, Loader2, X, MessageCircle, Star, CheckCircle, FileText, XCircle, Hand, Wifi, WifiOff } from 'lucide-react';
import { useNotifications } from '@/hooks/queries/useNotifications';
import { useMarkNotificationAsRead, useMarkAllNotificationsAsRead } from '@/hooks/mutations/useNotificationMutations';
import { Notification } from '@/services/notification';
import { formatDistanceToNow } from 'date-fns';
import { vi, enUS } from 'date-fns/locale';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from '@/hooks/useTranslation';

interface NotificationPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
    const { t, currentLanguage } = useTranslation();
    const queryClient = useQueryClient();
    const [realtimeNotifications, setRealtimeNotifications] = useState<Notification[]>([]);
    const [processedNotificationIds, setProcessedNotificationIds] = useState<Set<number>>(new Set());

    const {
        data,
        isLoading,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = useNotifications(10);

    const { mutate: markAsRead } = useMarkNotificationAsRead();
    const { mutate: markAllAsRead } = useMarkAllNotificationsAsRead();

    // Handle realtime notification from WebSocket only
    const handleNewNotification = useCallback((notification: Notification) => {
        console.log('📬 WebSocket notification received:', notification);

        // Check if this notification was already processed
        if (processedNotificationIds.has(notification.notificationId)) {
            console.log('⏭️ Notification already processed, skipping toast...');
            return;
        }

        // Mark as processed to prevent duplicate toasts
        setProcessedNotificationIds(prev => new Set(prev).add(notification.notificationId));

        // Add to realtime notifications list (at the top)
        setRealtimeNotifications(prev => [notification, ...prev]);

        // Show toast notification ONLY for new WebSocket notifications
        toast.info(
            <div className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                <div>
                    <div className="font-semibold">{notification.title}</div>
                    <div className="text-sm text-gray-600">{notification.message}</div>
                </div>
            </div>,
            {
                position: 'top-right',
                autoClose: 5000,
            }
        );

        // Invalidate notifications query to refetch from API
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }, [queryClient, processedNotificationIds]);

    // Connect to WebSocket
    const { isConnected } = useWebSocket(handleNewNotification);

    // Merge realtime notifications with fetched notifications
    const fetchedNotifications = data?.pages.flatMap(page => page.content) || [];

    // Remove duplicates (realtime notifications that are already in fetched list)
    const uniqueRealtimeNotifications = realtimeNotifications.filter(
        rtNotif => !fetchedNotifications.some(fn => fn.notificationId === rtNotif.notificationId)
    );

    const notifications = [...uniqueRealtimeNotifications, ...fetchedNotifications];
    const unreadCount = notifications.filter(n => !n.isRead).length;

    // Mark all fetched notifications as processed to prevent toast on refetch
    useEffect(() => {
        if (fetchedNotifications.length > 0) {
            setProcessedNotificationIds(prev => {
                const newSet = new Set(prev);
                fetchedNotifications.forEach(notif => newSet.add(notif.notificationId));
                return newSet;
            });
        }
    }, [fetchedNotifications.length]);

    // Clear realtime notifications that have been fetched from server
    useEffect(() => {
        if (fetchedNotifications.length > 0) {
            setRealtimeNotifications(prev =>
                prev.filter(rtNotif =>
                    !fetchedNotifications.some(fn => fn.notificationId === rtNotif.notificationId)
                )
            );
        }
    }, [fetchedNotifications.length]);

    // Close panel when clicking outside
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('.notification-panel') && !target.closest('.notification-bell')) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.isRead) {
            markAsRead(notification.notificationId);
        }
        // Removed navigation - only mark as read
    };

    const getNotificationIcon = (type: Notification['type']) => {
        switch (type) {
            case 'WELCOME':
                return (
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                        <Hand className="w-5 h-5 text-purple-600" />
                    </div>
                );
            case 'NEW_COMMENT':
                return (
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-blue-600" />
                    </div>
                );
            case 'NEW_REVIEW':
                return (
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Star className="w-5 h-5 text-yellow-600 fill-yellow-600" />
                    </div>
                );
            case 'RESTAURANT_APPROVED':
                return (
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                );
            case 'RESTAURANT_SUBMISSION':
                return (
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <FileText className="w-5 h-5 text-orange-600" />
                    </div>
                );
            case 'RESTAURANT_REJECTED':
                return (
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <XCircle className="w-5 h-5 text-red-600" />
                    </div>
                );
            case 'SYSTEM_ALERT':
                return (
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <Bell className="w-5 h-5 text-indigo-600" />
                    </div>
                );
            default:
                return (
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Bell className="w-5 h-5 text-gray-600" />
                    </div>
                );
        }
    }; const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            const locale = currentLanguage === 'vi' ? vi : enUS;
            return formatDistanceToNow(date, { addSuffix: true, locale });
        } catch {
            return '';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="notification-panel fixed top-16 right-4 md:right-8 lg:right-12 w-[90vw] md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white rounded-t-2xl">
                <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-[#44BACA]" />
                    <h3 className="font-bold text-gray-900">{t('notifications.title')}</h3>
                    {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                            {unreadCount}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                        <button
                            onClick={() => markAllAsRead()}
                            className="text-xs text-[#44BACA] hover:text-[#3aa3b3] font-semibold flex items-center gap-1"
                        >
                            <CheckCheck className="w-4 h-4" />
                            <span className="hidden sm:inline">{t('notifications.markAllAsRead')}</span>
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 text-[#44BACA] animate-spin" />
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                        <Bell className="w-16 h-16 text-gray-300 mb-4" />
                        <p className="text-gray-500 font-medium">{t('notifications.noNotifications')}</p>
                        <p className="text-gray-400 text-sm mt-1">{t('notifications.newNotificationsWillAppear')}</p>
                    </div>
                ) : (
                    <div className="divide-y">
                        {notifications.map((notification) => (
                            <div
                                key={notification.notificationId}
                                onClick={() => handleNotificationClick(notification)}
                                className={`w-full text-left p-4 hover:bg-gray-50 transition-colors cursor-pointer ${!notification.isRead ? 'bg-blue-50' : ''
                                    }`}
                            >
                                <div className="flex gap-3">
                                    <div className="flex-shrink-0">
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <h4 className={`text-sm font-semibold ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'
                                                }`}>
                                                {notification.title}
                                            </h4>
                                            {!notification.isRead && (
                                                <div className="w-2 h-2 bg-[#44BACA] rounded-full flex-shrink-0 mt-1" />
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                            {notification.message}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-400">
                                                {formatDate(notification.createdAt)}
                                            </span>
                                            {!notification.isRead && (
                                                <span
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        markAsRead(notification.notificationId);
                                                    }}
                                                    role="button"
                                                    tabIndex={0}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' || e.key === ' ') {
                                                            e.stopPropagation();
                                                            markAsRead(notification.notificationId);
                                                        }
                                                    }}
                                                    className="text-xs text-[#44BACA] hover:text-[#3aa3b3] font-medium flex items-center gap-1 cursor-pointer"
                                                >
                                                    <Check className="w-3 h-3" />
                                                    {t('notifications.markAsRead')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Load More Button */}
                {hasNextPage && (
                    <div className="p-4 border-t">
                        <button
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                            className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isFetchingNextPage ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    {t('notifications.loading')}
                                </>
                            ) : (
                                t('notifications.loadMore')
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
