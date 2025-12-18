"use client";
import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, MapPin, Loader2, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StarRating from '@/components/restaurants/StarRating';
import RestaurantMap from '@/components/restaurants/RestaurantMap';
import ReviewList from '@/components/restaurants/ReviewList';
import ReviewForm from '@/components/restaurants/ReviewForm';
import { ReportRestaurantModal } from '@/components/restaurants/ReportRestaurantModal';
import { useRestaurantDetail } from '@/hooks/queries/useRestaurantDetail';
import { useRestaurantReviews } from '@/hooks/queries/useRestaurantReviews';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Notification } from '@/services/notification';
import { useReportRestaurant } from '@/hooks/mutations/useReportRestaurant';
import { MenuSection } from './components/MenuSection';

export default function RestaurantDetail() {
  const router = useRouter();
  const params = useParams();
  const restaurantId = params.id as string;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageError, setImageError] = useState<{ [key: string]: boolean }>({});
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch restaurant data
  const { data: restaurant, isLoading, error } = useRestaurantDetail(restaurantId);

  // Fetch reviews data
  const {
    data: reviewsData,
    isLoading: reviewsLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  } = useRestaurantReviews(restaurantId, 10);

  // Handle notification from WebSocket
  const handleNotification = useCallback(async (notification: Notification) => {
    console.log('🔔 [RestaurantDetail] Notification received:', notification);
    console.log('📋 [RestaurantDetail] Notification details:', {
      type: notification.type,
      targetUrl: notification.targetUrl,
      message: notification.message,
      title: notification.title
    });

    // Check if notification is about a new review
    if (notification.type === 'NEW_REVIEW') {
      // Parse targetUrl to get reviewId (format: /reviews/{reviewId})
      const reviewMatch = notification.targetUrl?.match(/\/reviews\/(\d+)/);
      const reviewId = reviewMatch ? reviewMatch[1] : null;

      console.log('🎯 [RestaurantDetail] New review notification:', {
        reviewId,
        targetUrl: notification.targetUrl,
        currentRestaurantId: restaurantId
      });

      if (reviewId) {
        try {
          // Fetch the review details to check if it belongs to current restaurant
          const { getReviewById } = await import('@/services/review');
          const review = await getReviewById(reviewId);

          console.log('📥 [RestaurantDetail] Fetched review:', review);
          console.log('🔍 [RestaurantDetail] Comparing restaurant IDs:', {
            reviewRestaurantId: review.restaurantId,
            currentRestaurantId: restaurantId,
            match: String(review.restaurantId) === String(restaurantId)
          });

          // Only show notification if review is for current restaurant
          if (String(review.restaurantId) === String(restaurantId)) {
            toast.success(
              notification.message || 'Có đánh giá mới',
              {
                position: 'top-right',
                autoClose: 3000,
              }
            );

            // Invalidate reviews query to refetch and show new review
            queryClient.invalidateQueries({ queryKey: ['reviews', restaurantId] });

            // Also invalidate restaurant detail to update rating
            queryClient.invalidateQueries({ queryKey: ['restaurantDetail', restaurantId] });
          } else {
            console.log('⏭️ [RestaurantDetail] Review is for different restaurant, skipping UI update');
          }
        } catch (error) {
          console.log('❌ [RestaurantDetail] Failed to fetch review details:', error);
        }
      } else {
        console.warn('⚠️ [RestaurantDetail] Could not extract reviewId from targetUrl:', notification.targetUrl);
      }
    }
  }, [queryClient, restaurantId]);

  // Connect to WebSocket for notifications (including review notifications)
  const { isConnected } = useWebSocket(handleNotification);
  console.log('🔌 [RestaurantDetail] WebSocket connected:', isConnected());

  // Report restaurant mutation
  const reportMutation = useReportRestaurant();

  // Handle report submission
  const handleReportSubmit = (reason: string) => {
    reportMutation.mutate(
      {
        restaurantId,
        reason,
      },
      {
        onSuccess: () => {
          setIsReportModalOpen(false);
        },
      }
    );
  };
  useEffect(() => {
    if (!restaurantId) return;

    console.log('🔄 [RestaurantDetail] Setting up polling for reviews (30s interval)');

    const intervalId = setInterval(() => {
      console.log('🔄 [RestaurantDetail] Auto-refreshing reviews and restaurant data...');
      queryClient.invalidateQueries({ queryKey: ['reviews', restaurantId] });
      queryClient.invalidateQueries({ queryKey: ['restaurantDetail', restaurantId] });
    }, 15000); // 15 seconds

    return () => {
      console.log('🛑 [RestaurantDetail] Stopping polling for reviews');
      clearInterval(intervalId);
    };
  }, [restaurantId, queryClient]);


  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#44BACA] animate-spin" />
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Failed to load restaurant details</p>
          <Button onClick={() => router.back()} className="bg-[#44BACA] text-white">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        {/* Restaurant Header - Name & Info Card */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{restaurant.name}</h1>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="bg-red-100 hover:bg-red-200 rounded-full p-2 transition-all duration-300"
                title="Báo cáo nhà hàng"
              >
                <Flag className="w-5 h-5 text-red-600" />
              </button>
              <button
                onClick={() => router.back()}
                className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-all duration-300"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Info Line */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-5 h-5 text-gray-700" />
              <span className="text-gray-700">{restaurant.address}</span>
            </div>
            <span className="text-gray-400">|</span>
            <div className="flex items-center gap-1.5">
              <StarRating rating={restaurant.averageRating} />
              <span className="text-sm font-semibold text-gray-900">{restaurant.averageRating}</span>
              <span className="text-sm text-gray-600">({restaurant.totalReviews} reviews)</span>
            </div>
          </div>

          {/* Tags */}
          {restaurant.tags && restaurant.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {restaurant.tags.map((tag) => (
                <span
                  key={tag.tagId}
                  className="px-3 py-1 bg-blue-100 text-[#44BACA] rounded-full text-sm font-medium"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Photo Gallery */}
        <section className="mb-8">
          {(() => {
            // Check if restaurant has any images
            const hasSubPhotos = restaurant.images?.sub_photo && restaurant.images.sub_photo.length > 0;
            const hasMainPhoto = restaurant.images?.photo;

            // Filter out images with errors for thumbnails
            const validSubPhotos = hasSubPhotos
              ? restaurant.images.sub_photo
                .map((photo, index) => ({ photo, index }))
                .filter(({ index }) => !imageError[`thumb-${index}`])
              : [];

            // Determine which image to show in main display
            const selectedPhoto = hasSubPhotos && restaurant.images.sub_photo[selectedImageIndex]
              ? restaurant.images.sub_photo[selectedImageIndex]
              : null;
            const showMainPhoto = !imageError[`main-${selectedImageIndex}`] && selectedPhoto;

            return (hasSubPhotos || hasMainPhoto) ? (
              <>
                <div className="relative w-full h-80 md:h-130  mb-4  flex justify-start items-start">
                  {showMainPhoto ? (
                    !imageError[`main-${selectedImageIndex}`] ? (
                      <img
                        src={selectedPhoto}
                        alt={`${restaurant.name} - ${selectedImageIndex}`}
                        className="h-full object-contain"
                        onError={() => {
                          setImageError(prev => ({ ...prev, [`main-${selectedImageIndex}`]: true }));
                          // Auto-switch to next valid image
                          const nextValidIndex = restaurant.images.sub_photo.findIndex((_, i) =>
                            i > selectedImageIndex && !imageError[`thumb-${i}`]
                          );
                          if (nextValidIndex !== -1) {
                            setSelectedImageIndex(nextValidIndex);
                          }
                        }}
                      />
                    ) : null
                  ) : hasMainPhoto && !imageError['main-photo'] ? (
                    <img
                      src={restaurant.images.photo}
                      alt={restaurant.name}
                      className="h-full object-contain"
                      onError={() => {
                        setImageError(prev => ({ ...prev, 'main-photo': true }));
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300">
                      <span className="text-gray-600">No image available</span>
                    </div>
                  )}
                </div>
                {hasSubPhotos && (
                  <div className="grid grid-cols-6 gap-2">
                    {validSubPhotos.map(({ photo, index }) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative w-full aspect-square rounded-lg overflow-hidden transition-all duration-300 ${selectedImageIndex === index
                          ? 'ring-2 ring-[#44BACA]'
                          : 'opacity-70 hover:opacity-100'
                          }`}
                      >
                        <img
                          src={photo}
                          alt={`Thumbnail ${index}`}
                          className="w-full h-full object-cover"
                          onError={() => setImageError(prev => ({ ...prev, [`thumb-${index}`]: true }))}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="relative w-full h-72 md:h-96 rounded-2xl overflow-hidden mb-4 shadow-lg bg-gray-300 flex items-center justify-center">
                <span className="text-gray-600">No images available</span>
              </div>
            );
          })()}
        </section>

        {/* Restaurant Location Map */}
        {restaurant.latitude && restaurant.longitude && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#44BACA] mb-4">Location</h2>
            <RestaurantMap
              latitude={restaurant.latitude}
              longitude={restaurant.longitude}
              name={restaurant.name}
              address={restaurant.address}
            />
          </section>
        )}

        {/* Menu Section */}
        <MenuSection restaurantId={restaurantId} />

        {/* Customer Reviews */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-[#44BACA] mb-6">Customer Review</h2>

          {/* Rating Summary */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-start gap-8">
              {/* Rating Stats */}
              <div className="shrink-0">
                <div className="text-5xl font-bold text-gray-900 mb-2">
                  {restaurant.averageRating}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <StarRating rating={restaurant.averageRating} />
                </div>
                <p className="text-sm text-gray-600">{restaurant.totalReviews} Reviews</p>
              </div>
            </div>
          </div>

          {/* Review Form */}
          <ReviewForm
            restaurantId={restaurantId}
          />

          {/* Reviews List */}
          <ReviewList
            restaurantId={restaurantId}
            reviews={reviewsData?.pages.flatMap(page => page.content) || []}
            hasNextPage={hasNextPage || false}
            onLoadMore={() => fetchNextPage()}
            isFetchingNextPage={isFetchingNextPage || false}
          />
        </section>
      </div>

      {/* Report Restaurant Modal */}
      <ReportRestaurantModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onConfirm={handleReportSubmit}
        isLoading={reportMutation.isPending}
        restaurantName={restaurant.name}
      />
    </div>
  );
}