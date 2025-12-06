import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Notification } from './notification';
import { Review } from './review';

type NotificationCallback = (notification: Notification) => void;
type ReviewCallback = (review: Review) => void;

class WebSocketService {
    private client: Client | null = null;
    private notificationCallbacks: NotificationCallback[] = [];
    private reviewCallbacks: ReviewCallback[] = [];
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 3000;

    connect(token: string) {
        if (this.client?.connected) {
            console.log('WebSocket already connected');
            return;
        }

        this.client = new Client({
            webSocketFactory: () => new SockJS('http://178.128.208.78:8081/ws'),
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            debug: (str) => {
                console.log('STOMP Debug:', str);
            },
            reconnectDelay: this.reconnectDelay,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        this.client.onConnect = (frame) => {
            console.log('✅ [WebSocketService] WebSocket Connected:', frame);
            this.reconnectAttempts = 0;

            // Subscribe to user-specific notification queue
            const notificationSub = this.client?.subscribe('/user/queue/notifications', (message: IMessage) => {
                try {
                    const notification: Notification = JSON.parse(message.body);
                    console.log('📬 [WebSocketService] New notification received:', notification);

                    // Trigger all notification callbacks
                    this.notificationCallbacks.forEach(callback => callback(notification));

                    // If this is a NEW_REVIEW notification, extract review data and trigger review callbacks
                    if (notification.type === 'NEW_REVIEW' && notification.targetUrl) {
                        console.log('📝 [WebSocketService] NEW_REVIEW notification detected');

                        // Extract reviewId from targetUrl (e.g., "/reviews/123" -> "123")
                        const reviewIdMatch = notification.targetUrl.match(/\/reviews\/(\d+)/);
                        if (reviewIdMatch && reviewIdMatch[1]) {
                            const reviewId = reviewIdMatch[1];
                            console.log('🔍 [WebSocketService] Extracted reviewId:', reviewId);

                            // Trigger review callbacks with the reviewId
                            // The hook will handle fetching the full review details
                            this.reviewCallbacks.forEach(callback => {
                                // Pass a partial Review object with just the reviewId
                                callback({ reviewId } as Review);
                            });
                        }
                    }
                } catch (error) {
                    console.error('❌ [WebSocketService] Error parsing notification:', error);
                }
            });
            console.log('✅ [WebSocketService] Subscribed to /user/queue/notifications:', notificationSub?.id);
        };

        this.client.onStompError = (frame) => {
            console.error('❌ STOMP Error:', frame);
            this.handleReconnect(token);
        };

        this.client.onWebSocketError = (error) => {
            console.error('❌ WebSocket Error:', error);
        };

        this.client.onDisconnect = () => {
            console.log('🔌 WebSocket Disconnected');
        };

        this.client.activate();
    }

    private handleReconnect(token: string) {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`🔄 Reconnecting... Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);

            setTimeout(() => {
                this.disconnect();
                this.connect(token);
            }, this.reconnectDelay * this.reconnectAttempts);
        } else {
            console.error('❌ Max reconnection attempts reached');
        }
    }

    disconnect() {
        if (this.client) {
            this.client.deactivate();
            this.client = null;
            this.notificationCallbacks = [];
            this.reviewCallbacks = [];
            console.log('🔌 WebSocket Disconnected');
        }
    }

    onNotification(callback: NotificationCallback) {
        this.notificationCallbacks.push(callback);

        // Return unsubscribe function
        return () => {
            this.notificationCallbacks = this.notificationCallbacks.filter(cb => cb !== callback);
        };
    }

    onReview(callback: ReviewCallback) {
        this.reviewCallbacks.push(callback);

        // Return unsubscribe function
        return () => {
            this.reviewCallbacks = this.reviewCallbacks.filter(cb => cb !== callback);
        };
    }

    isConnected(): boolean {
        return this.client?.connected || false;
    }
}

// Singleton instance
export const webSocketService = new WebSocketService();
