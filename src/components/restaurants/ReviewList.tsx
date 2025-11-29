'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import ReviewCard from '@/components/restaurants/ReviewCard';
import { Review } from '@/services/review';

interface ReviewListProps {
  restaurantId: string;
  reviews: Review[];
  hasNextPage: boolean;
  onLoadMore: () => void;
  isFetchingNextPage: boolean;
}

export default function ReviewList({
  restaurantId,
  reviews,
  hasNextPage,
  onLoadMore,
  isFetchingNextPage,
}: ReviewListProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">
          Customer Reviews ({reviews.length})
        </h3>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 text-center">
          <p className="text-gray-600 mb-4">No reviews yet. Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review.reviewId} review={review} restaurantId={restaurantId} />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasNextPage && (
        <div className="flex justify-center pt-4">
          <button
            onClick={onLoadMore}
            disabled={isFetchingNextPage}
            className="font-semibold text-[#44BACA] bg-blue-50 hover:bg-blue-100 disabled:bg-gray-100 disabled:text-gray-400 py-3 px-8 rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            {isFetchingNextPage && <Loader2 size={20} className="animate-spin" />}
            {isFetchingNextPage ? 'Loading...' : 'Load More Reviews'}
          </button>
        </div>
      )}
    </div>
  );
}
