'use client';

import React, { useState } from 'react';
import { MessageSquare, Calendar, Star, Sparkles } from 'lucide-react';
import { Review } from '@/services/review';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import VendorReplyModal from './VendorReplyModal';

interface VendorReviewCardProps {
    review: Review;
    isNew?: boolean;
}

export default function VendorReviewCard({ review, isNew = false }: VendorReviewCardProps) {
    const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);

    return (
        <>
            <div
                className={`bg-white rounded-lg border p-6 hover:shadow-md transition-all ${isNew
                        ? 'border-blue-500 shadow-lg ring-2 ring-blue-200 animate-pulse-slow'
                        : 'border-gray-200'
                    }`}
            >
                {/* NEW Badge */}
                {isNew && (
                    <div className="mb-3">
                        <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                            <Sparkles className="w-3 h-3 mr-1" />
                            NEW REVIEW
                        </Badge>
                    </div>
                )}

                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                                {review.reviewerUsername.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">{review.reviewerUsername}</h3>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(review.createdAt).toLocaleDateString('vi-VN', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-4 h-4 ${i < review.rating
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300 fill-gray-300'
                                    }`}
                            />
                        ))}
                        <span className="ml-1 text-sm font-medium text-gray-700">{review.rating}.0</span>
                    </div>
                </div>

                {/* Review Comment */}
                <p className="text-gray-700 mb-4">{review.comment}</p>

                {/* Images */}
                {review.images && review.images.length > 0 && (
                    <div className="flex gap-2 mb-4 overflow-x-auto">
                        {review.images.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`Review image ${index + 1}`}
                                className="w-24 h-24 object-cover rounded-md"
                            />
                        ))}
                    </div>
                )}

                {/* Vendor Reply */}
                {review.vendorReply && (
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                        <div className="flex items-start gap-2">
                            <MessageSquare className="w-4 h-4 text-blue-600 mt-1" />
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-blue-900 mb-1">Your Reply</p>
                                <p className="text-sm text-gray-700">{review.vendorReply}</p>
                                {review.repliedAt && (
                                    <p className="text-xs text-gray-500 mt-2">
                                        Replied on {new Date(review.repliedAt).toLocaleDateString('vi-VN')}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Button */}
                <div className="flex justify-end">
                    <Button
                        onClick={() => setIsReplyModalOpen(true)}
                        variant={review.vendorReply ? 'outline' : 'default'}
                        size="sm"
                        className="gap-2"
                    >
                        <MessageSquare className="w-4 h-4" />
                        {review.vendorReply ? 'Edit Reply' : 'Reply'}
                    </Button>
                </div>

                {/* Report Badge */}
                {review.hasOpenReport && (
                    <div className="mt-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Has Open Report
                    </div>
                )}
            </div>

            <VendorReplyModal
                review={review}
                isOpen={isReplyModalOpen}
                onClose={() => setIsReplyModalOpen(false)}
            />
        </>
    );
}
