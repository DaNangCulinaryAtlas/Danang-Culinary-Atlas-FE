import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface ReportReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
    isLoading?: boolean;
    reviewerName?: string;
}

export const ReportReviewModal: React.FC<ReportReviewModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    isLoading = false,
    reviewerName,
}) => {
    const { t } = useTranslation();
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (!reason.trim()) {
            setError(t('reviews.reportReasonRequired'));
            return;
        }
        if (reason.trim().length < 10) {
            setError(t('reviews.reportReasonMinLength'));
            return;
        }
        onConfirm(reason.trim());
    };

    const handleClose = () => {
        setReason('');
        setError('');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                        <DialogTitle>{t('reviews.reportReview')}</DialogTitle>
                    </div>
                    {reviewerName && (
                        <DialogDescription className="text-sm">
                            {t('reviews.reportingReview')}: <span className="font-semibold">{reviewerName}</span>
                        </DialogDescription>
                    )}
                    <DialogDescription className="text-sm text-gray-600">
                        {t('reviews.reportDescription')}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="reason">{t('reviews.reportReason')} <span className="text-red-500">*</span></Label>
                        <Textarea
                            id="reason"
                            placeholder={t('reviews.reportReasonPlaceholder')}
                            value={reason}
                            onChange={(e) => {
                                setReason(e.target.value);
                                setError('');
                            }}
                            className={`min-h-[120px] ${error ? 'border-red-500' : ''}`}
                            disabled={isLoading}
                        />
                        {error && (
                            <p className="text-sm text-red-500">{error}</p>
                        )}
                        <p className="text-xs text-gray-500">
                            {reason.length}/500 {t('reviews.characters')}
                        </p>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                        <p className="text-xs text-yellow-800">
                            {t('reviews.reportNote')}
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        {t('reviews.cancel')}
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleSubmit}
                        disabled={isLoading || !reason.trim()}
                    >
                        {isLoading ? t('reviews.sending') : t('reviews.sendReport')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
