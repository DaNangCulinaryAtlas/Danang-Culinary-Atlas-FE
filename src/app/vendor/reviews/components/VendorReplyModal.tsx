'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Review } from '@/services/review';
import { useReplyReview } from '@/hooks/queries/useReviews';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';

interface VendorReplyModalProps {
    review: Review;
    isOpen: boolean;
    onClose: () => void;
}

export default function VendorReplyModal({ review, isOpen, onClose }: VendorReplyModalProps) {
    const [replyText, setReplyText] = useState(review.vendorReply || '');
    const replyMutation = useReplyReview();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!replyText.trim()) {
            toast.error('Please enter a reply');
            return;
        }

        try {
            await replyMutation.mutateAsync({
                reviewId: review.reviewId,
                vendorReply: replyText,
            });
            toast.success('Reply sent successfully!');
            onClose();
        } catch (error) {
            toast.error('Failed to send reply');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Reply to Review</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    {/* Review Details */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-gray-900">{review.reviewerUsername}</span>
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                            }`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                    </svg>
                                ))}
                            </div>
                        </div>
                        <p className="text-gray-700 text-sm">{review.comment}</p>
                        <p className="text-xs text-gray-500 mt-2">
                            {new Date(review.createdAt).toLocaleDateString('vi-VN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </p>
                    </div>

                    {/* Reply Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="reply" className="block text-sm font-medium text-gray-700 mb-2">
                                Your Reply
                            </label>
                            <Textarea
                                id="reply"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Write your reply to the customer..."
                                rows={6}
                                className="w-full"
                                disabled={replyMutation.isPending}
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={replyMutation.isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={replyMutation.isPending || !replyText.trim()}
                            >
                                {replyMutation.isPending ? 'Sending...' : review.vendorReply ? 'Update Reply' : 'Send Reply'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
