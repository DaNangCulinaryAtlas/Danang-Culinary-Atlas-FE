import { useEffect, useRef } from 'react';
import { webSocketService } from '@/services/websocket';
import { Review, getReviewById } from '@/services/review';
import { useAppSelector } from '@/hooks/useRedux';

export const useReviewWebSocket = (
    restaurantId: string,
    onNewReview?: (review: Review) => void
) => {
    const { token } = useAppSelector((state) => state.auth);
    const callbackRef = useRef(onNewReview);

    // Update callback ref without re-subscribing
    useEffect(() => {
        callbackRef.current = onNewReview;
    }, [onNewReview]);

    // Connect to WebSocket when token is available
    useEffect(() => {
        if (token) {
            webSocketService.connect(token);
        }
    }, [token]);

    // Subscribe to NEW_REVIEW notifications and fetch full review details
    useEffect(() => {
        if (!callbackRef.current || !restaurantId) {
            console.log('⚠️ [useReviewWebSocket] No callback or restaurantId:', {
                hasCallback: !!callbackRef.current,
                restaurantId
            });
            return;
        }

        console.log('🔔 [useReviewWebSocket] Subscribing to review notifications for restaurant:', restaurantId);

        // Stable wrapper that fetches full review details when notification arrives
        const stableCallback = async (partialReview: Review) => {
            console.log('📥 [useReviewWebSocket] Review notification received:', partialReview);

            if (!partialReview.reviewId) {
                console.error('❌ [useReviewWebSocket] No reviewId in notification');
                return;
            }

            try {
                // Fetch full review details from REST API
                console.log('🔍 [useReviewWebSocket] Fetching full review details...');
                const fullReview = await getReviewById(partialReview.reviewId);

                console.log('📥 [useReviewWebSocket] Full review fetched:', fullReview);
                console.log('📥 [useReviewWebSocket] Comparing IDs:', {
                    reviewRestaurantId: fullReview.restaurantId,
                    currentRestaurantId: restaurantId,
                    reviewRestaurantIdType: typeof fullReview.restaurantId,
                    currentRestaurantIdType: typeof restaurantId
                });

                // Convert both to string and compare (in case one is number)
                const reviewRestId = String(fullReview.restaurantId);
                const currentRestId = String(restaurantId);

                // Only process reviews for this restaurant
                if (reviewRestId === currentRestId) {
                    console.log('✅ [useReviewWebSocket] Match! Calling callback with full review...');
                    callbackRef.current?.(fullReview);
                } else {
                    console.log('⏭️ [useReviewWebSocket] Review is for different restaurant, skipping...', {
                        reviewRestId,
                        currentRestId
                    });
                }
            } catch (error) {
                console.error('❌ [useReviewWebSocket] Error fetching review details:', error);
            }
        };

        const unsubscribe = webSocketService.onReview(stableCallback);
        console.log('✅ [useReviewWebSocket] Subscribed to review notifications');

        return () => {
            console.log('🔌 [useReviewWebSocket] Unsubscribing from review notifications');
            unsubscribe();
        };
    }, [restaurantId]); // Only re-subscribe when restaurantId changes

    return {
        isConnected: () => webSocketService.isConnected(),
    };
};
