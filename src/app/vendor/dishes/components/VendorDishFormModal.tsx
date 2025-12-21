"use client"

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useCreateDish, useUpdateDish } from '@/hooks/mutations/useDishMutations';
import { Loader2, X, Upload, ImageIcon } from 'lucide-react';
import { uploadImageToCloudinary } from '@/services/upload-image';
import { vendorColors } from '@/configs/colors';
import type { VendorDish } from '../types';
import Image from 'next/image';
import { toast } from 'react-toastify';
interface VendorDishFormModalProps {
    dish?: VendorDish | null;
    restaurantId: string;
    restaurantName?: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export default function VendorDishFormModal({
    dish,
    restaurantId,
    restaurantName,
    open,
    onOpenChange,
    onSuccess,
}: VendorDishFormModalProps) {
    const isEditMode = !!dish;
    const createDishMutation = useCreateDish();
    const updateDishMutation = useUpdateDish();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        status: 'AVAILABLE' as 'AVAILABLE' | 'OUT_OF_STOCK',
    });

    const [images, setImages] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Reset form when modal opens/closes or dish changes
    useEffect(() => {
        if (open) {
            if (dish) {
                setFormData({
                    name: dish.name,
                    description: dish.description,
                    price: dish.price.toString(),
                    status: dish.status === 'AVAILABLE' ? 'AVAILABLE' : 'OUT_OF_STOCK',
                });
                setImages(dish.images || []);
            } else {
                setFormData({
                    name: '',
                    description: '',
                    price: '',
                    status: 'AVAILABLE',
                });
                setImages([]);
            }
            setErrors({});
        }
    }, [dish, open]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        try {
            const uploadPromises = Array.from(files).map((file) =>
                uploadImageToCloudinary(file)
            );
            const uploadResults = await Promise.all(uploadPromises);
            const successfulUrls = uploadResults
                .filter((result) => result.success && result.data)
                .map((result) => result.data as string);
            setImages((prev) => [...prev, ...successfulUrls]);

            if (errors.images) {
                setErrors((prev) => ({ ...prev, images: '' }));
            }
        } catch (error) {
            toast.error('Lỗi khi tải ảnh lên', {
                position: 'top-right',
                autoClose: 2500,
            });
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Tên món ăn là bắt buộc';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Mô tả là bắt buộc';
        }

        const price = parseFloat(formData.price);
        if (isNaN(price) || price < 0.01) {
            newErrors.price = 'Giá phải lớn hơn 0';
        }

        if (images.length === 0) {
            newErrors.images = 'Vui lòng thêm ít nhất một hình ảnh';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        const price = parseFloat(formData.price);

        try {
            if (isEditMode && dish) {
                await updateDishMutation.mutateAsync({
                    dishId: dish.dishId,
                    data: {
                        name: formData.name,
                        description: formData.description,
                        price,
                        status: formData.status,
                        images,
                    },
                });
            } else {
                await createDishMutation.mutateAsync({
                    restaurantId,
                    name: formData.name,
                    description: formData.description,
                    price,
                    status: formData.status,
                    images,
                });
            }

            onOpenChange(false);
            onSuccess?.();
        } catch (error) {
            toast.error('Lỗi khi lưu món ăn', {
                position: 'top-right',
                autoClose: 2500,
            });
        }
    };

    const isSubmitting = createDishMutation.isPending || updateDishMutation.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle style={{ color: vendorColors.primary[700] }}>
                        {isEditMode ? 'Chỉnh sửa món ăn' : 'Thêm món ăn mới'}
                    </DialogTitle>
                    <DialogDescription>
                        {restaurantName && (
                            <span className="font-medium">Quán: {restaurantName}</span>
                        )}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Dish Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name" className="font-semibold">
                            Tên món ăn <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => {
                                setFormData((prev) => ({ ...prev, name: e.target.value }));
                                if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                            }}
                            placeholder="Nhập tên món ăn"
                            className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description" className="font-semibold">
                            Mô tả <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => {
                                setFormData((prev) => ({ ...prev, description: e.target.value }));
                                if (errors.description) setErrors(prev => ({ ...prev, description: '' }));
                            }}
                            placeholder="Mô tả chi tiết về món ăn"
                            rows={3}
                            className={errors.description ? 'border-red-500' : ''}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-500">{errors.description}</p>
                        )}
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                        <Label htmlFor="price" className="font-semibold">
                            Giá (VND) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="price"
                            type="number"
                            min="0"
                            step="1000"
                            value={formData.price}
                            onChange={(e) => {
                                setFormData((prev) => ({ ...prev, price: e.target.value }));
                                if (errors.price) setErrors(prev => ({ ...prev, price: '' }));
                            }}
                            placeholder="Nhập giá món ăn"
                            className={errors.price ? 'border-red-500' : ''}
                        />
                        {errors.price && (
                            <p className="text-sm text-red-500">{errors.price}</p>
                        )}
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <Label htmlFor="status" className="font-semibold">
                            Trạng thái
                        </Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value: 'AVAILABLE' | 'OUT_OF_STOCK') =>
                                setFormData((prev) => ({ ...prev, status: value }))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="AVAILABLE">Có sẵn</SelectItem>
                                <SelectItem value="OUT_OF_STOCK">Hết hàng</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Images */}
                    <div className="space-y-2">
                        <Label className="font-semibold">
                            Hình ảnh <span className="text-red-500">*</span>
                        </Label>

                        {/* Image Preview Grid */}
                        <div className="grid grid-cols-3 gap-3">
                            {images.map((url, index) => (
                                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                                    <Image
                                        src={url}
                                        alt={`Dish image ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}

                            {/* Upload Button */}
                            <label className={`aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors ${errors.images ? 'border-red-500' : 'border-gray-300'
                                }`}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    disabled={uploading}
                                />
                                {uploading ? (
                                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                                ) : (
                                    <>
                                        <Upload className="h-8 w-8 text-gray-400" />
                                        <span className="text-xs text-gray-500 mt-1">Tải lên</span>
                                    </>
                                )}
                            </label>
                        </div>

                        {errors.images && (
                            <p className="text-sm text-red-500">{errors.images}</p>
                        )}
                    </div>

                    {/* Show note for pending review */}
                    {!isEditMode && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <p className="text-sm text-yellow-800">
                                <strong>Lưu ý:</strong> Món ăn mới sẽ được đặt ở trạng thái &quot;Chờ duyệt&quot; và cần được quản trị viên phê duyệt trước khi hiển thị cho khách hàng.
                            </p>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            style={{
                                background: vendorColors.gradients.primarySoft,
                            }}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang lưu...
                                </>
                            ) : isEditMode ? (
                                'Cập nhật'
                            ) : (
                                'Thêm món ăn'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
