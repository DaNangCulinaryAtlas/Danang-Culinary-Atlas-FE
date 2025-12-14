"use client"

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { vendorColors } from '@/configs/colors';
import { Eye, Edit, Clock, AlertCircle, Utensils, DollarSign } from 'lucide-react';
import type { VendorDish } from '../types';
import Image from 'next/image';

interface DishCardProps {
    dish: VendorDish;
    onView: (dish: VendorDish) => void;
    onEdit: (dish: VendorDish) => void;
}

export default function DishCard({ dish, onView, onEdit }: DishCardProps) {
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
                        <AlertCircle className="mr-1 h-3 w-3" />
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
                return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Có sẵn</Badge>;
            case 'UNAVAILABLE':
                return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Hết hàng</Badge>;
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
        <Card
            className="border-2 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-white group overflow-hidden"
            style={{ borderColor: vendorColors.primary[200] }}
        >
            <CardHeader className="pb-3 p-0">
                <div className="h-40 bg-muted flex items-center justify-center overflow-hidden relative">
                    {dish.images && dish.images.length > 0 ? (
                        <Image
                            src={dish.images[0]}
                            alt={dish.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="text-center">
                            <Utensils className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                            <p className="text-xs text-gray-400">Chưa có hình ảnh</p>
                        </div>
                    )}

                    {/* Overlay badges */}
                    <div className="absolute top-2 right-2">
                        {getApprovalStatusBadge(dish.approvalStatus)}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="space-y-3">
                    <div>
                        <h3 className="font-bold text-lg truncate" style={{ color: vendorColors.primary[700] }}>
                            {dish.name}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2 h-10">
                            {dish.description}
                        </p>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 font-semibold" style={{ color: vendorColors.accent.emerald }}>
                            <DollarSign className="h-4 w-4" />
                            {formatPrice(dish.price)}
                        </div>
                        {getStatusBadge(dish.status)}
                    </div>

                    {/* Rejection reason preview */}
                    {dish.approvalStatus === 'REJECTED' && dish.rejectionReason && (
                        <div className="p-2 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-xs text-red-700 line-clamp-2">
                                <strong>Lý do:</strong> {dish.rejectionReason}
                            </p>
                        </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-2 pt-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => onView(dish)}
                        >
                            <Eye className="mr-1 h-4 w-4" />
                            Xem
                        </Button>
                        <Button
                            size="sm"
                            className="flex-1 text-white"
                            style={{ background: vendorColors.gradients.primarySoft }}
                            onClick={() => onEdit(dish)}
                        >
                            <Edit className="mr-1 h-4 w-4" />
                            Sửa
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
