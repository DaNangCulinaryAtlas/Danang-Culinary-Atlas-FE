"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, X, Plus, Trash2 } from 'lucide-react';
import { restaurantFormSchema, RestaurantFormData } from '@/lib/validations/restaurant';
import { useCreateRestaurant } from '@/hooks/mutations/useRestaurantMutations';
import { useProvinces, useDistricts, useWards } from '@/hooks/queries/useLocations';
import { useRestaurantTags } from '@/hooks/queries/useRestaurantTags';
import { uploadImageToCloudinary } from '@/services/upload-image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { vendorColors } from '@/configs/colors';
import toast from 'react-hot-toast';
import { LocationMapPicker } from './LocationMapPicker';

interface VendorRestaurantFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_LABELS: Record<string, string> = {
    Mon: 'Thứ 2',
    Tue: 'Thứ 3',
    Wed: 'Thứ 4',
    Thu: 'Thứ 5',
    Fri: 'Thứ 6',
    Sat: 'Thứ 7',
    Sun: 'Chủ nhật'
};

export function VendorRestaurantFormModal({ open, onOpenChange }: VendorRestaurantFormModalProps) {
    const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
    const [subImagesPreview, setSubImagesPreview] = useState<string[]>([]);
    const [provinceId, setProvinceId] = useState<number | null>(null);
    const [districtId, setDistrictId] = useState<number | null>(null);
    const [selectedTags, setSelectedTags] = useState<number[]>([]);
    const [openingHours, setOpeningHours] = useState<Record<string, string>>({});
    const [isUploading, setIsUploading] = useState(false);

    const { data: provinces, isLoading: isLoadingProvinces } = useProvinces();
    const { data: districts, isLoading: isLoadingDistricts } = useDistricts(provinceId);
    const { data: wards, isLoading: isLoadingWards } = useWards(districtId);
    const { data: tags, isLoading: isLoadingTags } = useRestaurantTags();
    const createRestaurantMutation = useCreateRestaurant();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
        watch
    } = useForm<RestaurantFormData>({
        resolver: zodResolver(restaurantFormSchema) as any,
        defaultValues: {
            subImages: [],
            tagIds: [],
            openingHours: {}
        }
    });

    const mainImage = watch('mainImage');
    const subImages = watch('subImages');

    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setValue('mainImage', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setMainImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length + (subImages?.length || 0) > 5) {
            toast.error('Tối đa 5 ảnh phụ');
            return;
        }

        const currentSubImages = subImages || [];
        setValue('subImages', [...currentSubImages, ...files]);

        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSubImagesPreview(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeSubImage = (index: number) => {
        const currentSubImages = subImages || [];
        setValue('subImages', currentSubImages.filter((_, i) => i !== index));
        setSubImagesPreview(prev => prev.filter((_, i) => i !== index));
    };

    const handleTagToggle = (tagId: number) => {
        setSelectedTags(prev => {
            const newTags = prev.includes(tagId)
                ? prev.filter(id => id !== tagId)
                : [...prev, tagId];
            setValue('tagIds', newTags);
            return newTags;
        });
    };

    const handleOpeningHourChange = (day: string, value: string) => {
        const newHours = { ...openingHours, [day]: value };
        setOpeningHours(newHours);
        setValue('openingHours', newHours);
    };

    const removeOpeningHour = (day: string) => {
        const newHours = { ...openingHours };
        delete newHours[day];
        setOpeningHours(newHours);
        setValue('openingHours', newHours);
    };

    const onSubmit = async (data: RestaurantFormData) => {
        try {
            setIsUploading(true);

            // Upload main image
            const mainImageResponse = await uploadImageToCloudinary(data.mainImage);
            if (!mainImageResponse.success || !mainImageResponse.data) {
                throw new Error('Failed to upload main image');
            }

            // Upload sub images
            const subImageUrls: string[] = [];
            for (const file of data.subImages) {
                const response = await uploadImageToCloudinary(file);
                if (response.success && response.data) {
                    subImageUrls.push(response.data);
                }
            }

            // Create restaurant payload
            const payload = {
                name: data.name,
                address: data.address,
                images: {
                    photo: mainImageResponse.data,
                    sub_photo: subImageUrls
                },
                wardId: data.wardId,
                latitude: data.latitude,
                longitude: data.longitude,
                tagIds: data.tagIds,
                openingHours: data.openingHours
            };

            await createRestaurantMutation.mutateAsync(payload);

            // Reset form and close modal
            reset();
            setMainImagePreview(null);
            setSubImagesPreview([]);
            setProvinceId(null);
            setDistrictId(null);
            setSelectedTags([]);
            setOpeningHours({});
            onOpenChange(false);
        } catch (error) {
            console.error('Error creating restaurant:', error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold" style={{ color: vendorColors.primary[700] }}>
                        Thêm quán ăn mới
                    </DialogTitle>
                    <DialogDescription>
                        Điền thông tin quán ăn của bạn. Quán ăn sẽ được gửi đến admin để phê duyệt.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Thông tin cơ bản</h3>

                        <div>
                            <Label htmlFor="name">Tên quán ăn *</Label>
                            <Input
                                id="name"
                                {...register('name')}
                                placeholder="Nhập tên quán ăn"
                                className="mt-1"
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500 mt-1">{String(errors.name.message || '')}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="address">Địa chỉ *</Label>
                            <Input
                                id="address"
                                {...register('address')}
                                placeholder="Nhập địa chỉ chi tiết"
                                className="mt-1"
                            />
                            {errors.address && (
                                <p className="text-sm text-red-500 mt-1">{String(errors.address.message || '')}</p>
                            )}
                        </div>

                        {/* Location Selection */}
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <Label>Tỉnh/Thành phố *</Label>
                                <Select
                                    value={provinceId?.toString()}
                                    onValueChange={(value) => {
                                        setProvinceId(Number(value));
                                        setDistrictId(null);
                                        setValue('wardId', 0);
                                    }}
                                    disabled={isLoadingProvinces}
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder={isLoadingProvinces ? "Đang tải..." : "Chọn tỉnh/thành"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {isLoadingProvinces ? (
                                            <div className="p-2 text-center text-sm text-gray-500">Đang tải...</div>
                                        ) : provinces && provinces.length > 0 ? (
                                            provinces.filter(p => p?.provinceId).map((province) => (
                                                <SelectItem key={province.provinceId} value={String(province.provinceId)}>
                                                    {province?.name || 'N/A'}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <div className="p-2 text-center text-sm text-gray-500">Không có dữ liệu</div>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label>Quận/Huyện *</Label>
                                <Select
                                    value={districtId?.toString()}
                                    onValueChange={(value) => {
                                        setDistrictId(Number(value));
                                        setValue('wardId', 0);
                                    }}
                                    disabled={!provinceId || isLoadingDistricts}
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder={isLoadingDistricts ? "Đang tải..." : "Chọn quận/huyện"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {isLoadingDistricts ? (
                                            <div className="p-2 text-center text-sm text-gray-500">Đang tải...</div>
                                        ) : districts && districts.length > 0 ? (
                                            districts.filter(d => d?.districtId).map((district) => (
                                                <SelectItem key={district.districtId} value={String(district.districtId)}>
                                                    {district?.name || 'N/A'}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <div className="p-2 text-center text-sm text-gray-500">Không có dữ liệu</div>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label>Phường/Xã *</Label>
                                <Select
                                    onValueChange={(value) => setValue('wardId', Number(value))}
                                    disabled={!districtId || isLoadingWards}
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder={isLoadingWards ? "Đang tải..." : "Chọn phường/xã"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {isLoadingWards ? (
                                            <div className="p-2 text-center text-sm text-gray-500">Đang tải...</div>
                                        ) : wards && wards.length > 0 ? (
                                            wards.filter(w => w?.wardId).map((ward) => (
                                                <SelectItem key={ward.wardId} value={String(ward.wardId)}>
                                                    {ward?.name || 'N/A'}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <div className="p-2 text-center text-sm text-gray-500">Không có dữ liệu</div>
                                        )}
                                    </SelectContent>
                                </Select>
                                {errors.wardId && (
                                    <p className="text-sm text-red-500 mt-1">{String(errors.wardId.message || '')}</p>
                                )}
                            </div>
                        </div>

                        {/* Map Location Picker */}
                        <div>
                            <Label>Vị trí trên bản đồ *</Label>
                            <div className="mt-2">
                                <LocationMapPicker
                                    latitude={watch('latitude') || 16.0544}
                                    longitude={watch('longitude') || 108.2022}
                                    onLocationChange={(lat, lng) => {
                                        setValue('latitude', lat);
                                        setValue('longitude', lng);
                                    }}
                                />
                            </div>
                        </div>

                        {/* Coordinates - Now read-only display */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="latitude">Vĩ độ (Latitude) *</Label>
                                <Input
                                    id="latitude"
                                    type="number"
                                    step="any"
                                    {...register('latitude', { valueAsNumber: true })}
                                    placeholder="16.0544"
                                    className="mt-1 bg-gray-50"
                                    readOnly
                                />
                                {errors.latitude && (
                                    <p className="text-sm text-red-500 mt-1">{String(errors.latitude.message || '')}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="longitude">Kinh độ (Longitude) *</Label>
                                <Input
                                    id="longitude"
                                    type="number"
                                    step="any"
                                    {...register('longitude', { valueAsNumber: true })}
                                    placeholder="108.2022"
                                    className="mt-1 bg-gray-50"
                                    readOnly
                                />
                                {errors.longitude && (
                                    <p className="text-sm text-red-500 mt-1">{String(errors.longitude.message || '')}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Images */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Hình ảnh</h3>

                        {/* Main Image */}
                        <div>
                            <Label>Ảnh chính *</Label>
                            <div className="mt-2">
                                {mainImagePreview ? (
                                    <div className="relative w-full h-48 border-2 border-gray-300 rounded-lg overflow-hidden">
                                        <img src={mainImagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setMainImagePreview(null);
                                                setValue('mainImage', null as any);
                                            }}
                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                        <span className="text-sm text-gray-500">Click để chọn ảnh chính</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleMainImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                            {errors.mainImage && (
                                <p className="text-sm text-red-500 mt-1">{errors.mainImage.message as string}</p>
                            )}
                        </div>

                        {/* Sub Images */}
                        <div>
                            <Label>Ảnh phụ (tối đa 5)</Label>
                            <div className="mt-2 grid grid-cols-5 gap-2">
                                {subImagesPreview.map((preview, index) => (
                                    <div key={index} className="relative aspect-square border-2 border-gray-300 rounded-lg overflow-hidden">
                                        <img src={preview} alt={`Sub ${index + 1}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeSubImage(index)}
                                            className="absolute top-1 right-1 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}

                                {subImagesPreview.length < 5 && (
                                    <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                        <Plus className="h-6 w-6 text-gray-400" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleSubImagesChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                            {errors.subImages && (
                                <p className="text-sm text-red-500 mt-1">{errors.subImages.message as string}</p>
                            )}
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Thể loại *</h3>
                        <div className="flex flex-wrap gap-2">
                            {isLoadingTags ? (
                                <div className="text-sm text-gray-500">Đang tải thể loại...</div>
                            ) : tags && tags.length > 0 ? (
                                tags.filter(tag => tag?.tagId).map((tag) => (
                                    <label
                                        key={tag.tagId}
                                        className="flex items-center gap-2 px-3 py-2 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                                        style={{
                                            borderColor: selectedTags.includes(tag.tagId) ? vendorColors.primary[400] : '#e5e7eb',
                                            backgroundColor: selectedTags.includes(tag.tagId) ? vendorColors.primary[50] : 'white'
                                        }}
                                    >
                                        <Checkbox
                                            checked={selectedTags.includes(tag.tagId)}
                                            onCheckedChange={() => handleTagToggle(tag.tagId)}
                                        />
                                        <span className="text-sm font-medium">{tag.name}</span>
                                    </label>
                                ))
                            ) : (
                                <div className="text-sm text-gray-500">Không có thể loại nào</div>
                            )}
                        </div>
                        {errors.tagIds && (
                            <p className="text-sm text-red-500">{String(errors.tagIds.message || '')}</p>
                        )}
                    </div>

                    {/* Opening Hours */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Giờ mở cửa *</h3>

                        <div className="space-y-2">
                            {Object.entries(openingHours).map(([day, hours]) => (
                                <div key={day} className="flex items-center gap-2">
                                    <span className="w-20 text-sm font-medium">{DAY_LABELS[day]}</span>
                                    <Input
                                        value={hours}
                                        onChange={(e) => handleOpeningHourChange(day, e.target.value)}
                                        placeholder="10:00-22:00"
                                        className="flex-1"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeOpeningHour(day)}
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <Select
                            onValueChange={(value) => {
                                if (!openingHours[value]) {
                                    handleOpeningHourChange(value, '');
                                }
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Thêm ngày mở cửa" />
                            </SelectTrigger>
                            <SelectContent>
                                {DAYS_OF_WEEK.filter(day => !openingHours[day]).map((day) => (
                                    <SelectItem key={day} value={day}>
                                        {DAY_LABELS[day]}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {errors.openingHours && (
                            <p className="text-sm text-red-500">{String(errors.openingHours.message || '')}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isUploading || createRestaurantMutation.isPending}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            disabled={isUploading || createRestaurantMutation.isPending}
                            style={{ background: vendorColors.gradients.primary }}
                        >
                            {(isUploading || createRestaurantMutation.isPending) && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {isUploading ? 'Đang tải ảnh...' : 'Tạo quán ăn'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
