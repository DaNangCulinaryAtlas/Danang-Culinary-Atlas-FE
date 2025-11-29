import React, { useState } from 'react';
import Image from 'next/image';
import { Star, MoreVertical, Edit2, Trash2, X } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAppSelector } from '@/hooks/useRedux';
import { Review } from '@/services/review';
import { useUpdateReview } from '@/hooks/mutations/useUpdateReview';
import { useDeleteReview } from '@/hooks/mutations/useDeleteReview';

interface ReviewCardProps {
    review: Review;
    restaurantId: string;
}

export default function ReviewCard({ review, restaurantId }: ReviewCardProps) {
    const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});
    const [showMenu, setShowMenu] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editRating, setEditRating] = useState(review.rating);
    const [editComment, setEditComment] = useState(review.comment);
    const { mutate: updateReview, isPending: isUpdating } = useUpdateReview({ restaurantId });
    const { mutate: deleteReview, isPending: isDeleting } = useDeleteReview({ restaurantId });

    // Get current user from Redux
    const { user } = useAppSelector((state) => state.auth);
    const currentUserId = user?.accountId || null;

    const isOwner = currentUserId === review.reviewerAccountId;
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    };

    const handleUpdate = () => {
        if (editComment.trim().length < 2) {
            toast.error('Review must be at least 2 characters', {
                        position: 'top-right',
                        autoClose: 2500,
                    });
            return;
        }

        updateReview(
            {
                reviewId: review.reviewId,
                payload: {
                    rating: editRating,
                    comment: editComment.trim(),
                    images: review.images,
                },
            },
            {
                onSuccess: () => {
                    toast.success('Review updated successfully! ✨',{
                        position: 'top-right',
                        autoClose: 2500,
                    });
                    setShowEditModal(false);
                },
                onError: (error: any) => {
                    if (axios.isAxiosError(error)) {
                        if (error.response?.status === 403) {
                            toast.error('You can only edit your own reviews.', {
                        position: 'top-right',
                        autoClose: 2500,
                    });
                        } else if (error.response?.status === 401) {
                            toast.error('Your session has expired. Please log in again.', {
                        position: 'top-right',
                        autoClose: 2500,
                    });
                        } else {
                            toast.error('Failed to update review.', {
                        position: 'top-right',
                        autoClose: 2500,
                    });
                        }
                    } else {
                        toast.error('An error occurred.', {
                        position: 'top-right',
                        autoClose: 2500,
                    });
                    }
                },
            }
        );
    };

    const handleDelete = () => {
        deleteReview(review.reviewId, {
            onSuccess: () => {
                toast.success('Review deleted successfully!');
                setShowDeleteModal(false);
            },
            onError: (error: any) => {
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 403) {
                        toast.error('You can only delete your own reviews.', {
                        position: 'top-right',
                        autoClose: 2500,
                    });
                    } else if (error.response?.status === 401) {
                        toast.error('Your session has expired. Please log in again.', {
                        position: 'top-right',
                        autoClose: 2500,
                    });
                    } else {
                        toast.error('Failed to delete review.', {
                        position: 'top-right',
                        autoClose: 2500,
                    });
                    }
                } else {
                    toast.error('An error occurred.', {
                        position: 'top-right',
                        autoClose: 2500,
                    });
                }
            },
        });
    };

    return (
        <div className="pb-6 border-b border-gray-200 last:border-b-0">
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#44BACA] to-[#2B7A8E] flex items-center justify-center text-white font-bold shrink-0">
                    {review.reviewerUsername.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <p className="font-semibold text-gray-900">{review.reviewerUsername}</p>
                            <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                        </div>
                        {/* Menu Button */}
                        {isOwner && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowMenu(!showMenu)}
                                    className="text-gray-400 hover:text-gray-600 p-1"
                                    title="Menu"
                                >
                                    <MoreVertical size={18} />
                                </button>

                                {/* Dropdown Menu */}
                                {showMenu && (
                                    <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                        <button
                                            onClick={() => {
                                                setShowEditModal(true);
                                                setShowMenu(false);
                                            }}
                                            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-200"
                                        >
                                            <Edit2 size={14} />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowDeleteModal(true);
                                                setShowMenu(false);
                                            }}
                                            className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                        >
                                            <Trash2 size={14} />
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-4 h-4 ${i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                    }`}
                            />
                        ))}
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed mb-3">{review.comment}</p>

                    {/* Review Images */}
                    {review.images && review.images.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mb-3 md:grid-cols-4 lg:grid-cols-5">
                            {review.images.slice(0, 5).map((image, index) => (
                                <div key={index} className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-200">
                                    {!imageErrors[`review-${review.reviewId}-${index}`] ? (
                                        <Image
                                            src={image}
                                            alt={`Review image ${index + 1}`}
                                            fill
                                            className="object-cover hover:scale-105 transition-transform duration-300"
                                            sizes="100px"
                                            unoptimized
                                            onError={() => setImageErrors({ ...imageErrors, [`review-${review.reviewId}-${index}`]: true })}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-300 text-xs text-gray-600">
                                            Error
                                        </div>
                                    )}
                                </div>
                            ))}
                            {review.images.length > 5 && (
                                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-600 font-semibold">+{review.images.length - 5}</span>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex gap-4">
                        <button className="text-xs text-gray-500 hover:text-gray-700">👍 Helpful</button>
                        <button className="text-xs text-gray-500 hover:text-gray-700">Report</button>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Edit Review</h3>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Rating Editor */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((value) => (
                                    <button
                                        key={value}
                                        onClick={() => setEditRating(value)}
                                        className="p-1 transition-transform hover:scale-110"
                                    >
                                        <Star
                                            size={20}
                                            className={
                                                value <= editRating
                                                    ? 'fill-[#44BACA] text-[#44BACA]'
                                                    : 'text-gray-300'
                                            }
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Comment Editor */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                            <textarea
                                value={editComment}
                                onChange={(e) => setEditComment(e.target.value)}
                                className="w-full h-24 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#44BACA] focus:border-transparent resize-none text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1">{editComment.length} characters</p>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdate}
                                disabled={isUpdating}
                                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#44BACA] hover:bg-[#2B7A8E] disabled:bg-gray-300 rounded-lg transition-colors"
                            >
                                {isUpdating ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-sm w-full p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Review?</h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Are you sure you want to delete this review? This action cannot be undone.
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-300 rounded-lg transition-colors"
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
