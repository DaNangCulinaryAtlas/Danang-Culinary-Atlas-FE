import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Star, MoreVertical, Edit2, Trash2, X, Flag, ImagePlus, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAppSelector } from '@/hooks/useRedux';
import { Review } from '@/services/review';
import { useUpdateReview } from '@/hooks/mutations/useUpdateReview';
import { useDeleteReview } from '@/hooks/mutations/useDeleteReview';
import { ReportReviewModal } from '@/components/restaurants/ReportReviewModal';
import { useReportReview } from '@/hooks/mutations/useReportReview';
import { uploadImageToCloudinary } from '@/services/upload-image';
import { useTranslation } from '@/hooks/useTranslation';

interface ReviewCardProps {
    review: Review;
    restaurantId: string;
}

interface ImagePreview {
    file?: File;
    preview: string;
    cloudinaryUrl?: string;
    isUploading?: boolean;
    uploadError?: string;
    isExisting?: boolean; // Flag to identify existing images from review
}

export default function ReviewCard({ review, restaurantId }: ReviewCardProps) {
    const { t } = useTranslation();
    const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});
    const [showMenu, setShowMenu] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [editRating, setEditRating] = useState(review.rating);
    const [editComment, setEditComment] = useState(review.comment);
    const [editImages, setEditImages] = useState<ImagePreview[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { mutate: updateReview, isPending: isUpdating } = useUpdateReview({ restaurantId });
    const { mutate: deleteReview, isPending: isDeleting } = useDeleteReview({ restaurantId });
    const reportMutation = useReportReview();

    // Get current user from Redux
    const { user } = useAppSelector((state) => state.auth);
    const currentUserId = user?.accountId || null;

    const isOwner = currentUserId === review.reviewerAccountId;
    const formatDate = (dateString: string) => {
        try {
            // API trả về timestamp UTC, cần cộng 7 giờ để về giờ Việt Nam
            // Ví dụ: "2025-12-18T08:30:44.849377" là 08:30 UTC = 15:30 VN
            const parts = dateString.split('T');
            if (parts.length !== 2) return '';

            const [datePart, timePart] = parts;
            const [year, month, day] = datePart.split('-').map(Number);
            const [hour, minute] = timePart.split(':').map(Number);

            // Tạo date với giờ UTC
            const date = new Date(Date.UTC(year, month - 1, day, hour, minute));

            if (isNaN(date.getTime())) {
                return '';
            }

            // Cộng 7 giờ để chuyển sang giờ Việt Nam
            const vnDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);

            // Format thành HH:mm DD/MM/YYYY
            const h = String(vnDate.getUTCHours()).padStart(2, '0');
            const m = String(vnDate.getUTCMinutes()).padStart(2, '0');
            const d = String(vnDate.getUTCDate()).padStart(2, '0');
            const mo = String(vnDate.getUTCMonth() + 1).padStart(2, '0');
            const y = vnDate.getUTCFullYear();

            return `${h}:${m} ${d}/${mo}/${y}`;
        } catch (error) {
            return '';
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const fileArray = Array.from(files);

        // Create preview objects for each file
        const newImages: ImagePreview[] = fileArray.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            isUploading: true,
        }));

        setEditImages(prev => [...prev, ...newImages]);

        // Upload each image to Cloudinary
        for (let i = 0; i < fileArray.length; i++) {
            const file = fileArray[i];
            const imageIndex = editImages.length + i;

            try {
                const result = await uploadImageToCloudinary(file);

                if (result.success && result.data) {
                    // Update the image with Cloudinary URL
                    setEditImages(prev => prev.map((img, idx) =>
                        idx === imageIndex
                            ? { ...img, cloudinaryUrl: result.data, isUploading: false }
                            : img
                    ));
                } else {
                    // Update with error
                    setEditImages(prev => prev.map((img, idx) =>
                        idx === imageIndex
                            ? { ...img, isUploading: false, uploadError: result.message || 'Upload failed' }
                            : img
                    ));
                    toast.error(`${t('reviews.uploadFailed')}: ${result.message}`);
                }
            } catch (error) {
                setEditImages(prev => prev.map((img, idx) =>
                    idx === imageIndex
                        ? { ...img, isUploading: false, uploadError: t('reviews.uploadFailed') }
                        : img
                ));
                toast.error(t('reviews.uploadFailed'));
            }
        }

        // Reset input so same file can be selected again
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeEditImage = (index: number) => {
        setEditImages(prev => {
            const newImages = prev.filter((_, i) => i !== index);
            // Revoke the object URL to free memory (only for new uploads)
            if (prev[index].file) {
                URL.revokeObjectURL(prev[index].preview);
            }
            return newImages;
        });
    };

    const handleUpdate = () => {
        if (editComment.trim().length < 2) {
            toast.error(t('reviews.reviewMinLength'), {
                position: 'top-right',
                autoClose: 2500,
            });
            return;
        }

        // Check if any images are still uploading
        const isAnyImageUploading = editImages.some(img => img.isUploading);
        if (isAnyImageUploading) {
            toast.warning(t('reviews.waitForUpload'));
            return;
        }

        // Check if any images failed to upload
        const failedImages = editImages.filter(img => img.uploadError);
        if (failedImages.length > 0) {
            toast.error(t('reviews.someImagesFailed'));
            return;
        }

        // Get all image URLs (both existing and newly uploaded)
        const allImageUrls = editImages
            .map(img => img.isExisting ? img.preview : img.cloudinaryUrl)
            .filter(Boolean) as string[];

        updateReview(
            {
                reviewId: review.reviewId,
                payload: {
                    rating: editRating,
                    comment: editComment.trim(),
                    images: allImageUrls,
                },
            },
            {
                onSuccess: () => {
                    // Clean up object URLs for new uploads
                    editImages.forEach(img => {
                        if (img.file) {
                            URL.revokeObjectURL(img.preview);
                        }
                    });

                    toast.success(t('reviews.editSuccess'), {
                        position: 'top-right',
                        autoClose: 2500,
                    });
                    setShowEditModal(false);
                },
                onError: (error: any) => {
                    if (axios.isAxiosError(error)) {
                        if (error.response?.status === 403) {
                            toast.error(t('reviews.editError'), {
                                position: 'top-right',
                                autoClose: 2500,
                            });
                        } else if (error.response?.status === 401) {
                            toast.error(t('reviews.sessionExpired'), {
                                position: 'top-right',
                                autoClose: 2500,
                            });
                        } else {
                            toast.error(t('reviews.deleteFailed'), {
                                position: 'top-right',
                                autoClose: 2500,
                            });
                        }
                    } else {
                        toast.error(t('reviews.unexpectedError'), {
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
                toast.success(t('reviews.deleteSuccess'),{
                    position: 'top-right',
                    autoClose: 2500,
                });
                setShowDeleteModal(false);
            },
            onError: (error: any) => {
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 403) {
                        toast.error(t('reviews.deleteError'), {
                            position: 'top-right',
                            autoClose: 2500,
                        });
                    } else if (error.response?.status === 401) {
                        toast.error(t('reviews.sessionExpired'), {
                            position: 'top-right',
                            autoClose: 2500,
                        });
                    } else {
                        toast.error(t('reviews.deleteFailed'), {
                            position: 'top-right',
                            autoClose: 2500,
                        });
                    }
                } else {
                    toast.error(t('reviews.unexpectedError'), {
                        position: 'top-right',
                        autoClose: 2500,
                    });
                }
            },
        });
    };

    const handleReportSubmit = (reason: string) => {
        reportMutation.mutate(
            {
                reviewId: review.reviewId,
                reason,
            },
            {
                onSuccess: () => {
                    setShowReportModal(false);
                },
            }
        );
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
                        {currentUserId && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowMenu(!showMenu)}
                                    className="text-gray-400 hover:text-gray-600 p-1"
                                    title={t('reviews.edit')}
                                >
                                    <MoreVertical size={18} />
                                </button>

                                {/* Dropdown Menu */}
                                {showMenu && (
                                    <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                                        {isOwner ? (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        // Initialize edit state with current review data
                                                        setEditRating(review.rating);
                                                        setEditComment(review.comment);

                                                        // Load existing images
                                                        const existingImages: ImagePreview[] = (review.images || []).map(url => ({
                                                            preview: url,
                                                            cloudinaryUrl: url,
                                                            isExisting: true,
                                                        }));
                                                        setEditImages(existingImages);

                                                        setShowEditModal(true);
                                                        setShowMenu(false);
                                                    }}
                                                    className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-200"
                                                >
                                                    <Edit2 size={14} />
                                                    {t('reviews.edit')}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setShowDeleteModal(true);
                                                        setShowMenu(false);
                                                    }}
                                                    className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                >
                                                    <Trash2 size={14} />
                                                    {t('reviews.delete')}
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    setShowReportModal(true);
                                                    setShowMenu(false);
                                                }}
                                                className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                            >
                                                <Flag size={14} />
                                                {t('reviews.report')}
                                            </button>
                                        )}
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
                                            {t('reviews.unexpectedError')}
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

                    {/* Vendor Reply */}
                    {review.vendorReply && (
                        <div className="mt-4 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 border-l-4 border-[#44BACA] rounded-xl shadow-sm">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#44BACA] to-[#2B7A8E] flex items-center justify-center text-white font-bold shrink-0 shadow-md">
                                    V
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <p className="font-semibold text-[#44BACA] text-sm">{t('reviews.restaurantResponse')}</p>
                                        {review.repliedAt && (
                                            <span className="text-xs text-gray-400">
                                                • {formatDate(review.repliedAt)}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-700 leading-relaxed">{review.vendorReply}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">{t('reviews.editReview')}</h3>
                            <button
                                onClick={() => {
                                    // Clean up object URLs for new uploads
                                    editImages.forEach(img => {
                                        if (img.file) {
                                            URL.revokeObjectURL(img.preview);
                                        }
                                    });
                                    setShowEditModal(false);
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Rating Editor */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t('restaurants.filters.ratings')}</label>
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t('reviews.comment')}</label>
                            <textarea
                                value={editComment}
                                onChange={(e) => setEditComment(e.target.value)}
                                className="w-full h-24 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#44BACA] focus:border-transparent resize-none text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1">{editComment.length} {t('reviews.characters')}</p>
                        </div>

                        {/* Image Editor */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t('reviews.uploadImages')}</label>

                            {/* Image Preview Grid */}
                            {editImages.length > 0 && (
                                <div className="grid grid-cols-4 gap-2 mb-3">
                                    {editImages.map((image, index) => (
                                        <div key={index} className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
                                            <img
                                                src={image.preview}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />

                                            {/* Upload Status Overlay */}
                                            {image.isUploading && (
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                    <Loader2 size={20} className="text-white animate-spin" />
                                                </div>
                                            )}

                                            {/* Upload Error Overlay */}
                                            {image.uploadError && (
                                                <div className="absolute inset-0 bg-red-500/70 flex items-center justify-center">
                                                    <AlertCircle size={16} className="text-white" />
                                                </div>
                                            )}

                                            {/* Remove Button */}
                                            <button
                                                type="button"
                                                onClick={() => removeEditImage(index)}
                                                disabled={image.isUploading}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md disabled:opacity-50"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Upload Button */}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#44BACA] hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-[#44BACA]"
                            >
                                <ImagePlus size={18} />
                                {t('reviews.addImages')}
                            </button>

                            {/* Hidden File Input */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    // Clean up object URLs for new uploads
                                    editImages.forEach(img => {
                                        if (img.file) {
                                            URL.revokeObjectURL(img.preview);
                                        }
                                    });
                                    setShowEditModal(false);
                                }}
                                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                {t('reviews.cancel')}
                            </button>
                            <button
                                onClick={handleUpdate}
                                disabled={isUpdating}
                                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#44BACA] hover:bg-[#2B7A8E] disabled:bg-gray-300 rounded-lg transition-colors"
                            >
                                {isUpdating ? t('reviews.saving') : t('reviews.save')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-sm w-full p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{t('reviews.deleteReview')}</h3>
                        <p className="text-sm text-gray-600 mb-6">
                            {t('reviews.deleteConfirm')}
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                {t('reviews.cancel')}
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-300 rounded-lg transition-colors"
                            >
                                {isDeleting ? t('reviews.deleting') : t('reviews.delete')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Report Review Modal */}
            <ReportReviewModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                onConfirm={handleReportSubmit}
                isLoading={reportMutation.isPending}
                reviewerName={review.reviewerUsername}
            />
        </div>
    );
}
