"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { vendorColors } from '@/configs/colors';
import { Clock, DollarSign, FileText, Edit, Utensils, AlertCircle } from 'lucide-react';
import type { VendorDish } from '../types';
import Image from 'next/image';

interface VendorDishDetailModalProps {
    dish: VendorDish | null;
    restaurantName?: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onEdit?: (dish: VendorDish) => void;
}

export default function VendorDishDetailModal({
    dish,
    restaurantName,
    open,
    onOpenChange,
    onEdit,
}: VendorDishDetailModalProps) {
    if (!dish) return null;

    const getApprovalStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDING':
                return (
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                        <Clock className="mr-1 h-3 w-3" />
                        Chờ duyệt
                    </Badge>
                );
            case 'APPROVED':
                return (
                    <Badge className="bg-green-100 text-green-800 border-green-300">
                        Đã duyệt
                    </Badge>
                );
            case 'REJECTED':
                return (
                    <Badge className="bg-red-100 text-red-800 border-red-300">
                        Bị từ chối
                    </Badge>
                );
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'AVAILABLE':
                return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Có sẵn</Badge>;
            case 'UNAVAILABLE':
                return <Badge className="bg-gray-100 text-gray-800 border-gray-300">Không có sẵn</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle style={{ color: vendorColors.primary[700] }}>
                        Chi tiết món ăn
                    </DialogTitle>
                    <DialogDescription>
                        {restaurantName && (
                            <span className="font-medium">Quán: {restaurantName}</span>
                        )}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Images Gallery */}
                    {dish.images && dish.images.length > 0 && (
                        <div className="space-y-2">
                            <div className="aspect-video relative rounded-lg overflow-hidden">
                                <Image
                                    src={dish.images[0]}
                                    alt={dish.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            {dish.images.length > 1 && (
                                <div className="grid grid-cols-4 gap-2">
                                    {dish.images.slice(1, 5).map((url, index) => (
                                        <div key={index} className="aspect-square relative rounded-lg overflow-hidden">
                                            <Image
                                                src={url}
                                                alt={`${dish.name} - ${index + 2}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Dish Info */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold" style={{ color: vendorColors.primary[700] }}>
                                {dish.name}
                            </h3>
                            <div className="flex items-center gap-2">
                                {getApprovalStatusBadge(dish.approvalStatus)}
                                {getStatusBadge(dish.status)}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-lg font-semibold" style={{ color: vendorColors.accent.emerald }}>
                            <DollarSign className="h-5 w-5" />
                            {formatPrice(dish.price)}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-start gap-2">
                                <FileText className="h-4 w-4 mt-1 text-gray-500" />
                                <div>
                                    <span className="font-medium text-gray-700">Mô tả:</span>
                                    <p className="text-gray-600">{dish.description}</p>
                                </div>
                            </div>
                        </div>

                        {/* Approval Info */}
                        {dish.approvalStatus === 'APPROVED' && dish.approvedAt && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                <div className="flex items-center gap-2 text-sm text-green-700">
                                    <Clock className="h-4 w-4" />
                                    <span>
                                        Đã duyệt vào: {new Date(dish.approvedAt).toLocaleString('vi-VN')}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Rejection Reason */}
                        {dish.approvalStatus === 'REJECTED' && dish.rejectionReason && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-red-700">Lý do từ chối</h4>
                                        <p className="text-sm text-red-600">{dish.rejectionReason}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Pending Note */}
                        {dish.approvalStatus === 'PENDING' && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <div className="flex items-start gap-2">
                                    <Clock className="h-5 w-5 text-yellow-500 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-yellow-700">Đang chờ duyệt</h4>
                                        <p className="text-sm text-yellow-600">
                                            Món ăn của bạn đang được xem xét bởi quản trị viên. Bạn sẽ nhận được thông báo khi có kết quả.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Đóng
                    </Button>
                    {onEdit && (
                        <Button
                            onClick={() => {
                                onEdit(dish);
                                onOpenChange(false);
                            }}
                            style={{
                                background: vendorColors.gradients.primarySoft,
                            }}
                        >
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
