import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface DeleteReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
    reviewId?: string;
}

export const DeleteReviewModal: React.FC<DeleteReviewModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    isLoading = false,
    reviewId,
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                        <DialogTitle>Delete Review</DialogTitle>
                    </div>
                    <DialogDescription className="space-y-2">
                        <p>Are you sure you want to delete this review?</p>
                        {reviewId && (
                            <p className="text-xs font-mono bg-muted p-2 rounded">
                                Review ID: {reviewId}
                            </p>
                        )}
                        <p className="text-red-600 font-medium">
                            This action cannot be undone.
                        </p>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Deleting...' : 'Delete Review'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
