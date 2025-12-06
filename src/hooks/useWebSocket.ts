import { useEffect, useCallback, useRef } from 'react';
import { webSocketService } from '@/services/websocket';
import { Notification } from '@/services/notification';
import { useAppSelector } from '@/hooks/useRedux';

export const useWebSocket = (onNotification?: (notification: Notification) => void) => {
    const { token } = useAppSelector((state) => state.auth);
    const callbackRef = useRef(onNotification);

    // Update callback ref without re-subscribing
    useEffect(() => {
        callbackRef.current = onNotification;
    }, [onNotification]);

    // Connect to WebSocket when token is available
    useEffect(() => {
        if (token) {
            webSocketService.connect(token);

            return () => {
                webSocketService.disconnect();
            };
        }
    }, [token]);

    // Subscribe to notifications (only once)
    useEffect(() => {
        if (!callbackRef.current) return;

        // Stable wrapper that always calls the latest callback
        const stableCallback = (notification: Notification) => {
            callbackRef.current?.(notification);
        };

        const unsubscribe = webSocketService.onNotification(stableCallback);

        return () => {
            unsubscribe();
        };
    }, []); // Empty deps - subscribe only once

    const isConnected = useCallback(() => {
        return webSocketService.isConnected();
    }, []);

    return { isConnected };
};
