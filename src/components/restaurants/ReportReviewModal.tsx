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
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (!reason.trim()) {
            setError('Vui lòng nhập lý do báo cáo');
            return;
        }
        if (reason.trim().length < 10) {
            setError('Lý do báo cáo phải có ít nhất 10 ký tự');
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
                        <DialogTitle>Báo cáo đánh giá</DialogTitle>
                    </div>
                    {reviewerName && (
                        <DialogDescription className="text-sm">
                            Bạn đang báo cáo đánh giá của: <span className="font-semibold">{reviewerName}</span>
                        </DialogDescription>
                    )}
                    <DialogDescription className="text-sm text-gray-600">
                        Vui lòng cung cấp lý do chi tiết để chúng tôi có thể xem xét báo cáo của bạn.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="reason">Lý do báo cáo <span className="text-red-500">*</span></Label>
                        <Textarea
                            id="reason"
                            placeholder="Ví dụ: Nội dung không phù hợp, ngôn từ xúc phạm, thông tin sai lệch..."
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
                            {reason.length}/500 ký tự
                        </p>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                        <p className="text-xs text-yellow-800">
                            <strong>Lưu ý:</strong> Báo cáo của bạn sẽ được xem xét bởi đội ngũ quản trị.
                            Vui lòng cung cấp thông tin chính xác và trung thực.
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        Hủy
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleSubmit}
                        disabled={isLoading || !reason.trim()}
                    >
                        {isLoading ? 'Đang gửi...' : 'Gửi báo cáo'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
