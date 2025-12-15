'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, MessageSquare, Star, Filter, Bell } from 'lucide-react';
import { useAppSelector } from '@/hooks/useRedux';
import { useVendorRestaurants } from '@/hooks/queries/useVendorRestaurants';
import { useRestaurantReviewsByRatingRange } from '@/hooks/queries/useReviews';
import { useReviewWebSocket } from '@/hooks/useReviewWebSocket';
import { Review } from '@/services/review';
import VendorReviewCard from './components/VendorReviewCard';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

export default function VendorReviewsPage() {
    const { user } = useAppSelector((state) => state.auth);
    const vendorId = user?.accountId || null;
    const queryClient = useQueryClient();

    // Fetch vendor's restaurants
    const { restaurants, isLoading: isLoadingRestaurants } = useVendorRestaurants({ vendorId });

    // State
    const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
    const [ratingFilter, setRatingFilter] = useState<string>('all');
    const [page, setPage] = useState(0);
    const [realtimeReviews, setRealtimeReviews] = useState<Review[]>([]);
    const [processedReviewIds, setProcessedReviewIds] = useState<Set<string>>(new Set());
    const pageSize = 10;

    // Get rating range based on filter
    const { minRating, maxRating } = useMemo(() => {
        switch (ratingFilter) {
            case '5':
                return { minRating: 5, maxRating: 5 };
            case '4-5':
                return { minRating: 4, maxRating: 5 };
            case '3-5':
                return { minRating: 3, maxRating: 5 };
            case '1-2':
                return { minRating: 1, maxRating: 2 };
            case 'all':
            default:
                return { minRating: 1, maxRating: 5 };
        }
    }, [ratingFilter]);

    // Fetch reviews
    const { data: reviewsData, isLoading: isLoadingReviews } = useRestaurantReviewsByRatingRange(
        selectedRestaurantId,
        minRating,
        maxRating,
        page,
        pageSize,
        'createdAt',
        'desc'
    );

    // Handle new review from WebSocket
    const handleNewReview = useCallback((review: Review) => {
        console.log('📬 [VendorReviewsPage] New review received:', review);

        // Check if already processed
        if (processedReviewIds.has(review.reviewId)) {
            console.log('⏭️ Review already processed, skipping...');
            return;
        }

        // Mark as processed
        setProcessedReviewIds(prev => new Set(prev).add(review.reviewId));

        // Check if review matches current rating filter
        const matchesFilter = review.rating >= minRating && review.rating <= maxRating;

        if (matchesFilter) {
            // Add to realtime reviews list (at the top)
            setRealtimeReviews(prev => [review, ...prev]);
        }

        // Show toast notification
        const selectedRestaurantName = restaurants.find(r => r.id === review.restaurantId)?.name || 'your restaurant';

        toast.custom((t) => (
            <div
                className={`${t.visible ? 'animate-enter' : 'animate-leave'
                    } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
                <div className="flex-1 w-0 p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 pt-0.5">
                            <Bell className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900">
                                New Review Received!
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                                {review.reviewerUsername} rated {selectedRestaurantName} {review.rating} stars
                            </p>
                            <p className="mt-1 text-xs text-gray-400 line-clamp-2">
                                "{review.comment}"
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex border-l border-gray-200">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
                    >
                        Close
                    </button>
                </div>
            </div>
        ), {
            duration: 8000,
            position: 'top-right',
        });

        // Invalidate and refetch reviews
        queryClient.invalidateQueries({ queryKey: ['restaurant-reviews', review.restaurantId] });
    }, [minRating, maxRating, processedReviewIds, restaurants, queryClient]);

    // Connect to WebSocket for selected restaurant
    useReviewWebSocket(
        selectedRestaurantId || '',
        selectedRestaurantId ? handleNewReview : undefined
    );

    // Clear realtime reviews when restaurant or filter changes
    useEffect(() => {
        setRealtimeReviews([]);
        setProcessedReviewIds(new Set());
    }, [selectedRestaurantId, ratingFilter]);

    // Get selected restaurant
    const selectedRestaurant = useMemo(
        () => restaurants.find((r) => r.id === selectedRestaurantId),
        [restaurants, selectedRestaurantId]
    );

    // Handle restaurant change
    const handleRestaurantChange = (restaurantId: string) => {
        setSelectedRestaurantId(restaurantId);
        setPage(0);
    };

    // Handle rating filter change
    const handleRatingFilterChange = (value: string) => {
        setRatingFilter(value);
        setPage(0);
    };

    // Handle pagination
    const handleNextPage = () => {
        if (reviewsData && !reviewsData.last) {
            setPage((prev) => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (page > 0) {
            setPage((prev) => prev - 1);
        }
    };

    if (isLoadingRestaurants) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    // Filter only approved restaurants
    const approvedRestaurants = restaurants.filter((r) => r.approvalStatus === 'APPROVED');

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Review Management</h1>
                <p className="text-gray-600">View and respond to customer reviews for your restaurants</p>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="w-5 h-5" />
                        Filters
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Restaurant Selector */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Restaurant
                            </label>
                            <Select
                                value={selectedRestaurantId || ''}
                                onValueChange={handleRestaurantChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose a restaurant..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {approvedRestaurants.length === 0 ? (
                                        <div className="p-4 text-center text-gray-500 text-sm">
                                            No approved restaurants found
                                        </div>
                                    ) : (
                                        approvedRestaurants.map((restaurant) => (
                                            <SelectItem key={restaurant.id} value={restaurant.id}>
                                                <div className="flex items-center justify-between gap-3">
                                                    <span>{restaurant.name}</span>
                                                    {restaurant.averageRating !== null && restaurant.averageRating !== undefined && (
                                                        <span className="flex items-center gap-1 text-xs text-gray-500">
                                                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                            {restaurant.averageRating.toFixed(1)}
                                                        </span>
                                                    )}
                                                </div>
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Rating Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Filter by Rating
                            </label>
                            <Select value={ratingFilter} onValueChange={handleRatingFilterChange}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Ratings (1-5 Stars)</SelectItem>
                                    <SelectItem value="5">5 Stars</SelectItem>
                                    <SelectItem value="4-5">4-5 Stars</SelectItem>
                                    <SelectItem value="3-5">3-5 Stars</SelectItem>
                                    <SelectItem value="1-2">1-2 Stars</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Restaurant Info */}
            {selectedRestaurant && (
                <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50">
                    <CardHeader>
                        <CardTitle>{selectedRestaurant.name}</CardTitle>
                        <CardDescription className="flex items-center gap-4">
                            <span>{selectedRestaurant.address}</span>
                            {selectedRestaurant.averageRating !== null && selectedRestaurant.averageRating !== undefined && (
                                <span className="flex items-center gap-1">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    <span className="font-medium">{selectedRestaurant.averageRating.toFixed(1)}</span>
                                    <span className="text-gray-500">({selectedRestaurant.totalReviews || 0} reviews)</span>
                                </span>
                            )}
                        </CardDescription>
                    </CardHeader>
                </Card>
            )}

            {/* Reviews List */}
            {!selectedRestaurantId ? (
                <Card className="text-center p-12">
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a Restaurant</h3>
                    <p className="text-gray-500">Choose a restaurant from the dropdown to view its reviews</p>
                </Card>
            ) : isLoadingReviews ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            ) : !reviewsData || (reviewsData.content.length === 0 && realtimeReviews.length === 0) ? (
                <Card className="text-center p-12">
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Reviews Found</h3>
                    <p className="text-gray-500">
                        {ratingFilter === 'all'
                            ? 'This restaurant has no reviews yet'
                            : 'No reviews match the selected rating filter'}
                    </p>
                </Card>
            ) : (
                <>
                    {/* Merge realtime and fetched reviews */}
                    {(() => {
                        const fetchedReviews = reviewsData?.content || [];

                        // Remove duplicates (realtime reviews that are already in fetched list)
                        const uniqueRealtimeReviews = realtimeReviews.filter(
                            rtReview => !fetchedReviews.some(fr => fr.reviewId === rtReview.reviewId)
                        );

                        // Combine: realtime reviews first, then fetched reviews
                        const allReviews = [...uniqueRealtimeReviews, ...fetchedReviews];

                        const totalCount = (reviewsData?.totalElements || 0) + uniqueRealtimeReviews.length;

                        return (
                            <>
                                {/* Reviews Stats */}
                                <div className="mb-4 flex items-center justify-between">
                                    <p className="text-sm text-gray-600">
                                        Showing {allReviews.length} of {totalCount} reviews
                                        {uniqueRealtimeReviews.length > 0 && (
                                            <span className="ml-2 text-blue-600 font-medium">
                                                ({uniqueRealtimeReviews.length} new)
                                            </span>
                                        )}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Page {(reviewsData?.number || 0) + 1} of {reviewsData?.totalPages || 1}
                                    </p>
                                </div>

                                {/* Reviews Grid */}
                                <div className="space-y-4 mb-6">
                                    {allReviews.map((review) => {
                                        const isNewReview = uniqueRealtimeReviews.some(
                                            rtReview => rtReview.reviewId === review.reviewId
                                        );
                                        return (
                                            <VendorReviewCard
                                                key={review.reviewId}
                                                review={review}
                                                isNew={isNewReview}
                                            />
                                        );
                                    })}
                                </div>
                            </>
                        );
                    })()}

                    {/* Pagination */}
                    {reviewsData.totalPages > 1 && (
                        <div className="flex justify-center gap-4">
                            <Button
                                onClick={handlePrevPage}
                                disabled={page === 0}
                                variant="outline"
                            >
                                Previous
                            </Button>
                            <div className="flex items-center gap-2 px-4">
                                <span className="text-sm text-gray-600">
                                    Page {page + 1} of {reviewsData.totalPages}
                                </span>
                            </div>
                            <Button
                                onClick={handleNextPage}
                                disabled={reviewsData.last}
                                variant="outline"
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
