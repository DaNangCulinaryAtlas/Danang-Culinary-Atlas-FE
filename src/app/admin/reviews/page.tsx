'use client';

import { useState } from 'react';
import { useReviewsByRatingRange } from '@/hooks/queries/useReviews';
import { useDeleteReview } from '@/hooks/mutations/useReviewMutations';
import { ReviewDetailModal } from '@/components/admin/ReviewDetailModal';
import { DeleteReviewModal } from '@/components/admin/DeleteReviewModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Star, Eye, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ReviewManagementPage() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [minRating, setMinRating] = useState(1);
  const [maxRating, setMaxRating] = useState(5);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const formatDate = (dateString: string) => {
    try {
      const parts = dateString.split('T');
      if (parts.length !== 2) return '';

      const [datePart, timePart] = parts;
      const [year, month, day] = datePart.split('-').map(Number);
      const [hour, minute] = timePart.split(':').map(Number);

      const date = new Date(Date.UTC(year, month - 1, day, hour, minute));

      if (isNaN(date.getTime())) {
        return '';
      }

      const vnDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);

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

  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

  const { data: reviewsData, isLoading, refetch } = useReviewsByRatingRange(
    minRating,
    maxRating,
    page,
    size,
    sortBy,
    sortDirection
  );

  const deleteReviewMutation = useDeleteReview();

  const handleViewDetails = (reviewId: string) => {
    setSelectedReviewId(reviewId);
    setIsDetailModalOpen(true);
  };

  const handleDeleteClick = (reviewId: string) => {
    setReviewToDelete(reviewId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (reviewToDelete) {
      deleteReviewMutation.mutate(reviewToDelete, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setReviewToDelete(null);
          refetch();
        },
      });
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300'
              }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Review Management</h1>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Min Rating</label>
              <Select
                value={minRating.toString()}
                onValueChange={(value) => setMinRating(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <SelectItem key={rating} value={rating.toString()}>
                      {rating} Star{rating > 1 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Max Rating</label>
              <Select
                value={maxRating.toString()}
                onValueChange={(value) => setMaxRating(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <SelectItem key={rating} value={rating.toString()}>
                      {rating} Star{rating > 1 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Created Date</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="reviewerUsername">Reviewer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sort Direction</label>
              <Select value={sortDirection} onValueChange={(value: 'asc' | 'desc') => setSortDirection(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Descending</SelectItem>
                  <SelectItem value="asc">Ascending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Reviews</CardTitle>
            {reviewsData && (
              <div className="text-sm text-muted-foreground">
                Total: {reviewsData.totalElements} reviews
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : reviewsData && reviewsData.content.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reviewer</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Comment</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reviewsData.content.map((review) => (
                      <TableRow key={review.reviewId}>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium">
                              {review.reviewerUsername}
                            </p>
                            <p className="text-xs text-muted-foreground font-mono">
                              {review.reviewerAccountId.substring(0, 8)}...
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {renderStars(review.rating)}
                        </TableCell>
                        <TableCell>
                          <p className="max-w-md truncate">
                            {review.comment}
                          </p>
                        </TableCell>
                        <TableCell>
                          {formatDate(review.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleViewDetails(review.reviewId)
                              }
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                handleDeleteClick(review.reviewId)
                              }
                              disabled={review.hasOpenReport}
                              title={review.hasOpenReport ? "Cannot delete review with open reports" : "Delete review"}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No reviews found
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Select
            value={String(size)}
            onValueChange={(value) => {
              setSize(Number(value))
              setPage(0)
            }}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Số dòng" />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 50].map((sizeOption) => (
                <SelectItem key={sizeOption} value={String(sizeOption)}>
                  {sizeOption} / trang
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {reviewsData && (
            <div className="text-sm text-muted-foreground">
              Hiển thị {page * size + 1}-
              {Math.min((page + 1) * size, reviewsData.totalElements)} trong tổng {reviewsData.totalElements}
            </div>
          )}
        </div>

        {/* Pagination */}
        {reviewsData && reviewsData.totalPages > 0 && (
          <div className="flex items-center justify-center md:justify-end">
            <div className="flex items-center gap-2">
              {/* Previous button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0 || isLoading}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              {/* First page button */}
              {page > 2 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(0)}
                  >
                    1
                  </Button>
                  {page > 3 && (
                    <span className="flex items-center px-2">...</span>
                  )}
                </>
              )}

              {/* Page numbers around current page */}
              {Array.from({ length: reviewsData.totalPages }, (_, i) => i)
                .filter(
                  (pageNum) =>
                    pageNum === page ||
                    pageNum === page - 1 ||
                    pageNum === page - 2 ||
                    pageNum === page + 1 ||
                    pageNum === page + 2
                )
                .map((pageNum) => (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum + 1}
                  </Button>
                ))}

              {/* Last page button */}
              {page < reviewsData.totalPages - 3 && (
                <>
                  {page < reviewsData.totalPages - 4 && (
                    <span className="flex items-center px-2">...</span>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(reviewsData.totalPages - 1)}
                  >
                    {reviewsData.totalPages}
                  </Button>
                </>
              )}

              {/* Next button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.min(reviewsData.totalPages - 1, page + 1))}
                disabled={page >= reviewsData.totalPages - 1 || isLoading}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <ReviewDetailModal
        reviewId={selectedReviewId}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedReviewId(null);
        }}
      />

      <DeleteReviewModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setReviewToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteReviewMutation.isPending}
        reviewId={reviewToDelete || undefined}
      />
    </div>
  );
}

