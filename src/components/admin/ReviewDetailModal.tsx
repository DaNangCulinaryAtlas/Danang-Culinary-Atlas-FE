import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useReviewDetail } from '@/hooks/queries/useReviews';
import { Loader2, Star, Calendar, User, Store, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface ReviewDetailModalProps {
    reviewId: string | null;
    isOpen: boolean;
    onClose: () => void;
}

export const ReviewDetailModal: React.FC<ReviewDetailModalProps> = ({
    reviewId,
    isOpen,
    onClose,
}) => {
    const { data: review, isLoading } = useReviewDetail(reviewId);

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-5 h-5 ${star <= rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                    />
                ))}
            </div>
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Review Details</DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : review ? (
                    <div className="space-y-6">
                        {/* Review Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <User className="w-4 h-4" />
                                    <span className="font-medium">Reviewer:</span>
                                </div>
                                <p className="text-sm ml-6">{review.reviewerUsername}</p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="w-4 h-4" />
                                    <span className="font-medium">Created:</span>
                                </div>
                                <p className="text-sm ml-6">
                                    {format(new Date(review.createdAt), 'PPpp')}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Store className="w-4 h-4" />
                                    <span className="font-medium">Restaurant ID:</span>
                                </div>
                                <p className="text-sm ml-6 font-mono">{review.restaurantId}</p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span className="font-medium">Rating:</span>
                                </div>
                                <div className="ml-6">{renderStars(review.rating)}</div>
                            </div>
                        </div>

                        {/* Dish ID if exists */}
                        {review.dishId && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span className="font-medium">Dish ID:</span>
                                </div>
                                <p className="text-sm font-mono">{review.dishId}</p>
                            </div>
                        )}

                        {/* Comment */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MessageSquare className="w-4 h-4" />
                                <span className="font-medium">Comment:</span>
                            </div>
                            <div className="bg-muted p-4 rounded-lg">
                                <p className="text-sm">{review.comment}</p>
                            </div>
                        </div>

                        {/* Images */}
                        {review.images && review.images.length > 0 && review.images[0] !== 'string' && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span className="font-medium">Images:</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    {review.images.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`Review image ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Vendor Reply */}
                        {review.vendorReply && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span className="font-medium">Vendor Reply:</span>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                                    <p className="text-sm">{review.vendorReply}</p>
                                    {review.repliedAt && (
                                        <p className="text-xs text-muted-foreground mt-2">
                                            Replied at: {format(new Date(review.repliedAt), 'PPpp')}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Status Badges */}
                        <div className="flex gap-2">
                            {review.hasOpenReport && (
                                <Badge variant="destructive">Has Open Report</Badge>
                            )}
                            <Badge variant="outline">
                                ID: {review.reviewId.substring(0, 8)}...
                            </Badge>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground py-8">
                        Review not found
                    </p>
                )}
            </DialogContent>
        </Dialog>
    );
};
