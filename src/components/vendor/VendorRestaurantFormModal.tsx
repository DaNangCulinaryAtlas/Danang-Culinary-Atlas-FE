"use client"

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, X, Plus, Trash2 } from 'lucide-react';
import { restaurantFormSchema, RestaurantFormData } from '@/lib/validations/restaurant';
import { useCreateRestaurant, useUpdateRestaurant } from '@/hooks/mutations/useRestaurantMutations';
import { useProvinces, useDistricts, useWards } from '@/hooks/queries/useLocations';
import { useRestaurantTags } from '@/hooks/queries/useRestaurantTags';
import { useRestaurantTagsByRestaurantId } from '@/hooks/queries/useRestaurantTagsByRestaurantId';
import { uploadImageToCloudinary } from '@/services/upload-image';
import { getWardById, getDistrictById } from '@/services/location';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { vendorColors } from '@/configs/colors';
import toast from 'react-hot-toast';
import { LocationMapPicker } from './LocationMapPicker';
import type { Restaurant } from '@/app/vendor/restaurants/types';

interface VendorRestaurantFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    restaurant?: Restaurant | null;
    mode?: 'create' | 'edit';
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

export function VendorRestaurantFormModal({ open, onOpenChange, restaurant, mode = 'create' }: VendorRestaurantFormModalProps) {
    const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
    const [subImagesPreview, setSubImagesPreview] = useState<string[]>([]);
    const [provinceId, setProvinceId] = useState<number | null>(null);
    const [districtId, setDistrictId] = useState<number | null>(null);
    const [selectedWardId, setSelectedWardId] = useState<number | null>(null);
    const [selectedTags, setSelectedTags] = useState<number[]>([]);
    const [openingHours, setOpeningHours] = useState<Record<string, string>>({});
    const [isUploading, setIsUploading] = useState(false);
    const [existingMainImage, setExistingMainImage] = useState<string | null>(null);
    const [existingSubImages, setExistingSubImages] = useState<string[]>([]);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);

    const { data: provinces, isLoading: isLoadingProvinces } = useProvinces();
    const { data: districts, isLoading: isLoadingDistricts } = useDistricts(provinceId);
    const { data: wards, isLoading: isLoadingWards } = useWards(districtId);
    const { data: tags, isLoading: isLoadingTags } = useRestaurantTags();
    const { data: restaurantTags, isLoading: isLoadingRestaurantTags } = useRestaurantTagsByRestaurantId(
        mode === 'edit' && restaurant?.id ? restaurant.id : undefined
    );
    const createRestaurantMutation = useCreateRestaurant();
    const updateRestaurantMutation = useUpdateRestaurant();

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

    // Function to find location hierarchy from wardId using direct API calls
    const findLocationHierarchy = async (wardId: number) => {
        setIsLoadingLocation(true);
        try {
            // Step 1: Get ward details to get districtId
            const wardResponse = await getWardById(wardId);
            if (!wardResponse.success || !wardResponse.data) {
                console.error('Failed to fetch ward details');
                setIsLoadingLocation(false);
                return;
            }
            const wardData = wardResponse.data;
            console.log('Ward details:', wardData);

            // Step 2: Get district details to get provinceId
            const districtResponse = await getDistrictById(wardData.districtId);
            if (!districtResponse.success || !districtResponse.data) {
                console.error('Failed to fetch district details');
                setIsLoadingLocation(false);
                return;
            }
            const districtData = districtResponse.data;
            console.log('District details:', districtData);

            // Step 3: Set province (default Đà Nẵng with provinceId = 1)
            const foundProvinceId = districtData.provinceId || 1; // Default to Đà Nẵng

            console.log('Found location hierarchy:', {
                provinceId: foundProvinceId,
                districtId: districtData.districtId,
                districtName: districtData.name,
                wardId: wardData.wardId,
                wardName: wardData.name
            });

            // Store the target values to set after data loads
            setPendingLocationData({
                provinceId: foundProvinceId,
                districtId: districtData.districtId,
                wardId: wardData.wardId
            });

            // Set province first - this will trigger districts loading
            setProvinceId(foundProvinceId);

        } catch (error) {
            console.error('Error finding location hierarchy:', error);
            setIsLoadingLocation(false);
        }
    };

    // State to store pending location data while cascading dropdowns load
    const [pendingLocationData, setPendingLocationData] = useState<{
        provinceId: number;
        districtId: number;
        wardId: number;
    } | null>(null);

    // Effect to set district after districts are loaded
    useEffect(() => {
        if (pendingLocationData && districts && districts.length > 0 && !isLoadingDistricts) {
            const targetDistrict = districts.find(d => d.districtId === pendingLocationData.districtId);
            if (targetDistrict && districtId !== pendingLocationData.districtId) {
                console.log('Setting district:', targetDistrict.name, targetDistrict.districtId);
                setDistrictId(pendingLocationData.districtId);
            }
        }
    }, [districts, isLoadingDistricts, pendingLocationData, districtId]);

    // Effect to set ward after wards are loaded
    useEffect(() => {
        console.log('Ward effect triggered:', {
            hasPendingData: !!pendingLocationData,
            wardsLength: wards?.length,
            isLoadingWards,
            currentDistrictId: districtId,
            pendingDistrictId: pendingLocationData?.districtId,
            pendingWardId: pendingLocationData?.wardId,
            currentSelectedWardId: selectedWardId,
            districtMatches: districtId === pendingLocationData?.districtId
        });

        if (pendingLocationData && wards && wards.length > 0 && !isLoadingWards && districtId === pendingLocationData.districtId) {
            const targetWard = wards.find(w => w.wardId === pendingLocationData.wardId);
            console.log('Looking for ward:', pendingLocationData.wardId, 'Found:', targetWard);
            console.log('Available wards:', wards.map(w => ({ id: w.wardId, name: w.name })));

            if (targetWard && selectedWardId !== pendingLocationData.wardId) {
                console.log('Setting ward:', targetWard.name, targetWard.wardId);
                setSelectedWardId(pendingLocationData.wardId);
                setValue('wardId', pendingLocationData.wardId);

                // Use setTimeout to ensure state update completes
                setTimeout(() => {
                    setIsLoadingLocation(false);
                    setPendingLocationData(null); // Clear pending data
                }, 100);
            } else if (!targetWard) {
                console.error('Ward not found in list!');
                setIsLoadingLocation(false);
            }
        }
    }, [wards, isLoadingWards, pendingLocationData, districtId, selectedWardId, setValue]);

    // Load restaurant data when editing
    useEffect(() => {
        if (open && mode === 'edit' && restaurant) {
            // Set basic info
            setValue('name', restaurant.name);
            setValue('address', restaurant.address);
            setValue('latitude', restaurant.latitude || 16.0544);
            setValue('longitude', restaurant.longitude || 108.2022);
            setValue('wardId', restaurant.wardId || 0);

            // Set images
            if (restaurant.image) {
                setExistingMainImage(restaurant.image);
                setMainImagePreview(restaurant.image);
            }
            if (restaurant.subPhotos && restaurant.subPhotos.length > 0) {
                setExistingSubImages(restaurant.subPhotos);
                setSubImagesPreview(restaurant.subPhotos);
            }

            // Set opening hours
            if (restaurant.openingHours) {
                setOpeningHours(restaurant.openingHours as Record<string, string>);
                setValue('openingHours', restaurant.openingHours as Record<string, string>);
            } else {
                setOpeningHours({});
                setValue('openingHours', {});
            }

            // Set tags from API response in edit mode
            if (mode === 'edit' && restaurantTags && restaurantTags.length > 0) {
                const tagIds = restaurantTags.map(tag => tag.tagId);
                console.log('Setting tags from API for edit:', { restaurantTags, tagIds });
                setSelectedTags(tagIds);
                setValue('tagIds', tagIds);
            } else {
                setSelectedTags([]);
                setValue('tagIds', []);
            }

            // Load location hierarchy from wardId using direct API calls
            if (restaurant.wardId) {
                findLocationHierarchy(restaurant.wardId);
            }
        } else if (open && mode === 'create') {
            // Reset form for create mode
            resetForm();
        }
    }, [open, mode, restaurant, tags, restaurantTags, setValue]);

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

    const resetForm = () => {
        reset();
        setMainImagePreview(null);
        setSubImagesPreview([]);
        setProvinceId(null);
        setDistrictId(null);
        setSelectedWardId(null);
        setSelectedTags([]);
        setOpeningHours({});
        setExistingMainImage(null);
        setExistingSubImages([]);
        setPendingLocationData(null);
        setIsLoadingLocation(false);
    };

    const onSubmit = async (data: RestaurantFormData) => {
        try {
            setIsUploading(true);

            // Validate main image: either new file or existing image must exist
            if (!data.mainImage && !existingMainImage) {
                toast.error('Vui lòng chọn ảnh chính');
                setIsUploading(false);
                return;
            }

            let mainImageUrl = existingMainImage;
            let subImageUrls = [...existingSubImages];

            // Upload main image only if it's a new file
            if (data.mainImage && data.mainImage instanceof File) {
                const mainImageResponse = await uploadImageToCloudinary(data.mainImage);
                if (!mainImageResponse.success || !mainImageResponse.data) {
                    throw new Error('Failed to upload main image');
                }
                mainImageUrl = mainImageResponse.data;
            } else if (!mainImageUrl) {
                throw new Error('Main image is required');
            }

            // Upload new sub images
            const newSubImages = data.subImages.filter(img => img instanceof File) as File[];
            for (const file of newSubImages) {
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
                    photo: mainImageUrl,
                    sub_photo: subImageUrls
                },
                wardId: data.wardId,
                latitude: data.latitude,
                longitude: data.longitude,
                tagIds: data.tagIds && data.tagIds.length > 0 ? data.tagIds : [],
                openingHours: data.openingHours || {}
            };

            console.log('Submitting payload:', payload); // Debug log

            if (mode === 'edit' && restaurant) {
                await updateRestaurantMutation.mutateAsync({
                    restaurantId: restaurant.id,
                    payload
                });
            } else {
                await createRestaurantMutation.mutateAsync(payload);
            }

            // Reset form and close modal
            resetForm();
            onOpenChange(false);
        } catch (error: any) {
            console.error(`Error ${mode === 'edit' ? 'updating' : 'creating'} restaurant:`, error);
            toast.error(error.message || `Không thể ${mode === 'edit' ? 'cập nhật' : 'tạo'} quán ăn`);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold" style={{ color: vendorColors.primary[700] }}>
                        {mode === 'edit' ? 'Chỉnh sửa quán ăn' : 'Thêm quán ăn mới'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'edit'
                            ? 'Cập nhật thông tin quán ăn của bạn.'
                            : 'Điền thông tin quán ăn của bạn. Quán ăn sẽ được gửi đến admin để phê duyệt.'}
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
                                    value={provinceId ? String(provinceId) : undefined}
                                    onValueChange={(value) => {
                                        setProvinceId(Number(value));
                                        setDistrictId(null);
                                        setSelectedWardId(null);
                                        setValue('wardId', 0);
                                    }}
                                    disabled={isLoadingProvinces || isLoadingLocation}
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder={isLoadingProvinces || isLoadingLocation ? "Đang tải..." : "Chọn tỉnh/thành"} />
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
                                    value={districtId ? String(districtId) : undefined}
                                    onValueChange={(value) => {
                                        setDistrictId(Number(value));
                                        setSelectedWardId(null);
                                        setValue('wardId', 0);
                                    }}
                                    disabled={!provinceId || isLoadingDistricts || isLoadingLocation}
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder={isLoadingDistricts || isLoadingLocation ? "Đang tải..." : "Chọn quận/huyện"} />
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
                                    key={`ward-${selectedWardId || 'none'}-${districtId || 'none'}`}
                                    value={selectedWardId ? String(selectedWardId) : undefined}
                                    onValueChange={(value) => {
                                        const wardId = Number(value);
                                        console.log('Ward changed manually to:', wardId);
                                        setSelectedWardId(wardId);
                                        setValue('wardId', wardId);
                                    }}
                                    disabled={!districtId || isLoadingWards || isLoadingLocation}
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder={isLoadingWards || isLoadingLocation ? "Đang tải..." : "Chọn phường/xã"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {isLoadingWards || isLoadingLocation ? (
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

                        {/* Loading indicator for location */}
                        {isLoadingLocation && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Đang tải thông tin vị trí...</span>
                            </div>
                        )}

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
                                                setExistingMainImage(null);
                                                setValue('mainImage', undefined);
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
                            disabled={isUploading || createRestaurantMutation.isPending || updateRestaurantMutation.isPending}
                            style={{ background: vendorColors.gradients.primary }}
                        >
                            {(isUploading || createRestaurantMutation.isPending || updateRestaurantMutation.isPending) && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {isUploading ? 'Đang tải ảnh...' : mode === 'edit' ? 'Cập nhật quán ăn' : 'Tạo quán ăn'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
