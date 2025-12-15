import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Loader2, X } from 'lucide-react';
import { useDishManagementDetail } from '@/hooks/queries/useDishManagement';
import { adminColors } from '@/configs/colors';
import { Button } from '@/components/ui/button';

interface DishDetailModalProps {
    dishId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onEdit?: (dish: any) => void;
    onApprove?: (dish: any) => void;
}

export default function DishDetailModal({
    dishId,
    open,
    onOpenChange,
    onEdit,
    onApprove,
}: DishDetailModalProps) {
    const { data, isLoading, isError } = useDishManagementDetail(dishId || '');

    const dish = data?.data;

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'AVAILABLE':
                return <Badge className="bg-green-500">Còn hàng</Badge>;
            case 'OUT_OF_STOCK':
                return <Badge variant="secondary">Hết hàng</Badge>;
            case 'UNAVAILABLE':
                return <Badge variant="secondary">Không khả dụng</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getApprovalBadge = (status: string) => {
        switch (status) {
            case 'PENDING':
                return (
                    <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                        Chờ duyệt
                    </Badge>
                );
            case 'APPROVED':
                return <Badge className="bg-green-500">Đã duyệt</Badge>;
            case 'REJECTED':
                return <Badge variant="destructive">Đã từ chối</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Chi tiết món ăn</DialogTitle>
                    <DialogDescription>Thông tin đầy đủ về món ăn</DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                    </div>
                ) : isError || !dish ? (
                    <div className="text-center py-12">
                        <p className="text-red-500">Không thể tải thông tin món ăn</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Images Gallery */}
                        {dish.images && dish.images.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="font-semibold text-lg">Hình ảnh</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {dish.images.map((image: string, index: number) => (
                                        <div
                                            key={index}
                                            className="relative aspect-square rounded-lg overflow-hidden border-2"
                                            style={{ borderColor: adminColors.primary[200] }}
                                        >
                                            <img
                                                src={image}
                                                alt={`${dish.name} - ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Basic Information */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Tên món ăn</h3>
                                <p className="text-gray-700">{dish.name}</p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-lg mb-2">Mô tả</h3>
                                <p className="text-gray-700 whitespace-pre-line">{dish.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Giá</h3>
                                    <p className="text-2xl font-bold" style={{ color: adminColors.primary[600] }}>
                                        {dish.price.toLocaleString('vi-VN')} đ
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Trạng thái</h3>
                                    {getStatusBadge(dish.status)}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-lg mb-2">Trạng thái duyệt</h3>
                                <div className="flex items-center gap-2">
                                    {getApprovalBadge(dish.approvalStatus)}
                                    {dish.approvedAt && (
                                        <span className="text-sm text-gray-500">
                                            {new Date(dish.approvedAt).toLocaleDateString('vi-VN')}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Rejection Reason */}
                            {dish.approvalStatus === 'REJECTED' && dish.rejectionReason && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <h3 className="font-semibold text-lg mb-2 text-red-700">
                                        Lý do từ chối
                                    </h3>
                                    <p className="text-red-600">{dish.rejectionReason}</p>
                                </div>
                            )}

                            {/* Restaurant Info */}
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Nhà hàng</h3>
                                <p className="text-gray-700">ID: {dish.restaurantId}</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4 border-t">
                            {dish.approvalStatus === 'PENDING' && onApprove && (
                                <Button
                                    onClick={() => onApprove(dish)}
                                    style={{ backgroundColor: adminColors.status.success }}
                                    className="flex-1"
                                >
                                    Duyệt món ăn
                                </Button>
                            )}
                            {onEdit && (
                                <Button
                                    onClick={() => onEdit(dish)}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    Chỉnh sửa
                                </Button>
                            )}
                            <Button
                                onClick={() => onOpenChange(false)}
                                variant="outline"
                            >
                                Đóng
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
