import { useState } from 'react';
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
import { useApproveDish } from '@/hooks/mutations/useDishMutations';
import { DishApiResponse } from '@/types/dish';
import { adminColors } from '@/configs/colors';
import { Check, X, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

interface DishApprovalModalProps {
    dish: DishApiResponse | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export default function DishApprovalModal({
    dish,
    open,
    onOpenChange,
    onSuccess,
}: DishApprovalModalProps) {
    const [action, setAction] = useState<'APPROVED' | 'REJECTED' | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const approveDishMutation = useApproveDish();

    const handleSubmit = async () => {
        if (!dish || !action) return;

        try {
            await approveDishMutation.mutateAsync({
                dishId: dish.dishId,
                data: {
                    approvalStatus: action,
                    ...(action === 'REJECTED' && rejectionReason && { rejectionReason }),
                },
            });

            // Reset state
            setAction(null);
            setRejectionReason('');
            onOpenChange(false);
            onSuccess?.();
        } catch (error) {
            toast.error('Lỗi khi cập nhật duyệt món ăn', {
                position: 'top-right',
                autoClose: 2500,
            });
        }
    };

    const handleClose = () => {
        setAction(null);
        setRejectionReason('');
        onOpenChange(false);
    };

    if (!dish) return null;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Duyệt món ăn</DialogTitle>
                    <DialogDescription>
                        Xem xét và phê duyệt hoặc từ chối món ăn
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Dish Information */}
                    <div className="space-y-2">
                        <div className="flex items-start gap-4">
                            {dish.images && dish.images.length > 0 && (
                                <img
                                    src={dish.images[0]}
                                    alt={dish.name}
                                    className="w-24 h-24 object-cover rounded-lg"
                                />
                            )}
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg">{dish.name}</h3>
                                <p className="text-sm text-gray-600">{dish.description}</p>
                                <p className="text-sm font-medium mt-1">
                                    Giá: {dish.price.toLocaleString('vi-VN')} đ
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Selection */}
                    {!action && (
                        <div className="flex gap-3">
                            <Button
                                onClick={() => setAction('APPROVED')}
                                className="flex-1"
                                style={{ backgroundColor: adminColors.status.success }}
                            >
                                <Check className="w-4 h-4 mr-2" />
                                Phê duyệt
                            </Button>
                            <Button
                                onClick={() => setAction('REJECTED')}
                                variant="destructive"
                                className="flex-1"
                            >
                                <X className="w-4 h-4 mr-2" />
                                Từ chối
                            </Button>
                        </div>
                    )}

                    {/* Rejection Reason Input */}
                    {action === 'REJECTED' && (
                        <div className="space-y-2">
                            <Label htmlFor="rejectionReason">
                                Lý do từ chối <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="rejectionReason"
                                placeholder="Nhập lý do từ chối món ăn này..."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                rows={4}
                                className="resize-none"
                            />
                        </div>
                    )}

                    {/* Approval Confirmation */}
                    {action === 'APPROVED' && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-800">
                                Bạn có chắc chắn muốn phê duyệt món ăn <strong>{dish.name}</strong>?
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    {action && (
                        <>
                            <Button
                                variant="outline"
                                onClick={() => setAction(null)}
                                disabled={approveDishMutation.isPending}
                            >
                                Quay lại
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={
                                    approveDishMutation.isPending ||
                                    (action === 'REJECTED' && !rejectionReason.trim())
                                }
                                style={
                                    action === 'APPROVED'
                                        ? { backgroundColor: adminColors.status.success }
                                        : undefined
                                }
                                variant={action === 'REJECTED' ? 'destructive' : 'default'}
                            >
                                {approveDishMutation.isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Đang xử lý...
                                    </>
                                ) : (
                                    <>
                                        {action === 'APPROVED' ? 'Xác nhận phê duyệt' : 'Xác nhận từ chối'}
                                    </>
                                )}
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
