import { useState, useEffect, useRef } from 'react';
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
import { DishApiResponse } from '@/types/dish';
import { Loader2, X, Upload, Search } from 'lucide-react';
import { uploadImageToCloudinary } from '@/services/upload-image';
import { searchRestaurantsByName } from '@/services/restaurant';
import { toast } from 'react-toastify';
import { Badge } from '@/components/ui/badge';

interface DishFormModalProps {
    dish?: DishApiResponse | null;
    restaurantId?: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export default function DishFormModal({
    dish,
    restaurantId,
    open,
    onOpenChange,
    onSuccess,
}: DishFormModalProps) {
    const isEditMode = !!dish;
    const createDishMutation = useCreateDish();
    const updateDishMutation = useUpdateDish();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        status: 'AVAILABLE' as 'AVAILABLE' | 'OUT_OF_STOCK',
        restaurantId: restaurantId || '',
    });

    const [images, setImages] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);

    // Restaurant search states
    const [restaurantSearchQuery, setRestaurantSearchQuery] = useState('');
    const [restaurantSearchResults, setRestaurantSearchResults] = useState<any[]>([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (dish) {
            setFormData({
                name: dish.name,
                description: dish.description,
                price: dish.price.toString(),
                status: dish.status as 'AVAILABLE' | 'OUT_OF_STOCK',
                restaurantId: dish.restaurantId,
            });
            setImages(dish.images || []);
            setSelectedRestaurant({ restaurantId: dish.restaurantId, name: 'Restaurant' });
        } else if (restaurantId) {
            setFormData((prev) => ({ ...prev, restaurantId }));
            setSelectedRestaurant({ restaurantId, name: 'Restaurant' });
        }
    }, [dish, restaurantId]);

    // Search restaurants by name with debounce
    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (restaurantSearchQuery.trim().length < 2) {
            setRestaurantSearchResults([]);
            setShowSearchResults(false);
            return;
        }

        setIsSearching(true);
        searchTimeoutRef.current = setTimeout(async () => {
            try {
                const response = await searchRestaurantsByName({ name: restaurantSearchQuery });
                console.log('Restaurant search response:', response);

                if (response.success && response.data) {
                    // Handle different response formats
                    let restaurants: any[] = [];

                    if (Array.isArray(response.data)) {
                        restaurants = response.data;
                    } else if (response.data.content && Array.isArray(response.data.content)) {
                        // Paginated response format
                        restaurants = response.data.content;
                    } else if (response.data.data && Array.isArray(response.data.data)) {
                        restaurants = response.data.data;
                    }

                    console.log('Parsed restaurants:', restaurants);
                    setRestaurantSearchResults(restaurants);
                    setShowSearchResults(restaurants.length > 0);
                }
            } catch (error) {
                toast.error('Lỗi khi tìm kiếm nhà hàng', {
                    position: 'top-right',
                    autoClose: 2500,
                });
                setRestaurantSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 500);

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [restaurantSearchQuery]);

    // Close search results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('#restaurant') && !target.closest('.restaurant-dropdown')) {
                setShowSearchResults(false);
            }
        };

        if (showSearchResults) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [showSearchResults]);

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
        } catch (error) {
            toast.error('Không thể tải lên hình ảnh', {
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const price = parseFloat(formData.price);
        if (isNaN(price) || price < 0.01) {
            alert('Giá món ăn phải lớn hơn hoặc bằng 0.01');
            return;
        }

        if (images.length === 0) {
            alert('Vui lòng thêm ít nhất một hình ảnh');
            return;
        }

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
                if (!formData.restaurantId) {
                    alert('Vui lòng chọn nhà hàng');
                    return;
                }
                await createDishMutation.mutateAsync({
                    restaurantId: formData.restaurantId,
                    name: formData.name,
                    description: formData.description,
                    price,
                    status: formData.status,
                    images,
                });
            }

            handleClose();
            onSuccess?.();
        } catch (error: any) {
            toast.error(error.message || 'Không thể lưu món ăn', {
                position: 'top-right',
                autoClose: 2500,
            });
        }
    };

    const handleRestaurantSelect = (restaurant: any) => {
        setSelectedRestaurant(restaurant);
        setFormData((prev) => ({ ...prev, restaurantId: restaurant.restaurantId }));
        setRestaurantSearchQuery(restaurant.name);
        setShowSearchResults(false);
    };

    const handleClose = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            status: 'AVAILABLE',
            restaurantId: restaurantId || '',
        });
        setImages([]);
        setRestaurantSearchQuery('');
        setRestaurantSearchResults([]);
        setSelectedRestaurant(null);
        setShowSearchResults(false);
        onOpenChange(false);
    };

    const isLoading = createDishMutation.isPending || updateDishMutation.isPending;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? 'Chỉnh sửa món ăn' : 'Thêm món ăn mới'}</DialogTitle>
                    <DialogDescription>
                        {isEditMode
                            ? 'Cập nhật thông tin món ăn'
                            : 'Tạo món ăn mới cho nhà hàng'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Restaurant Search - Only show in create mode */}
                    {!isEditMode && (
                        <div className="space-y-2">
                            <Label htmlFor="restaurant">
                                Nhà hàng <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        id="restaurant"
                                        value={restaurantSearchQuery}
                                        onChange={(e) => setRestaurantSearchQuery(e.target.value)}
                                        onFocus={() => {
                                            if (restaurantSearchResults.length > 0) {
                                                setShowSearchResults(true);
                                            }
                                        }}
                                        placeholder="Tìm kiếm nhà hàng..."
                                        className="pl-10"
                                        disabled={!!restaurantId}
                                    />
                                    {isSearching && (
                                        <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
                                    )}
                                </div>

                                {/* Selected Restaurant Badge */}
                                {selectedRestaurant && (
                                    <div className="mt-2">
                                        <Badge variant="secondary" className="flex items-center gap-2 w-fit">
                                            {selectedRestaurant.name}
                                            {!restaurantId && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedRestaurant(null);
                                                        setRestaurantSearchQuery('');
                                                        setFormData((prev) => ({ ...prev, restaurantId: '' }));
                                                    }}
                                                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            )}
                                        </Badge>
                                    </div>
                                )}

                                {/* Search Results Dropdown */}
                                {showSearchResults && restaurantSearchResults.length > 0 && (
                                    <div className="restaurant-dropdown absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-xl max-h-60 overflow-y-auto">
                                        {restaurantSearchResults.map((restaurant: any, index: number) => (
                                            <button
                                                key={restaurant.restaurantId || index}
                                                type="button"
                                                onClick={() => handleRestaurantSelect(restaurant)}
                                                className="w-full px-4 py-3 text-left hover:bg-blue-50 border-b last:border-b-0 transition-colors focus:bg-blue-50 focus:outline-none"
                                            >
                                                <div className="font-medium text-gray-900">{restaurant.name || 'Unnamed Restaurant'}</div>
                                                {restaurant.address && (
                                                    <div className="text-sm text-gray-600 mt-1">
                                                        📍 {restaurant.address}
                                                    </div>
                                                )}
                                                {restaurant.cuisineType && (
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {restaurant.cuisineType}
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* No Results Message */}
                                {showSearchResults && restaurantSearchQuery.length >= 2 && restaurantSearchResults.length === 0 && !isSearching && (
                                    <div className="restaurant-dropdown absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg p-4 text-center text-gray-500">
                                        Không tìm thấy nhà hàng nào
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Tên món ăn <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, name: e.target.value }))
                            }
                            placeholder="Nhập tên món ăn"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">
                            Mô tả <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, description: e.target.value }))
                            }
                            placeholder="Nhập mô tả món ăn"
                            rows={4}
                            required
                        />
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                        <Label htmlFor="price">
                            Giá (VNĐ) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="price"
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={formData.price}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, price: e.target.value }))
                            }
                            placeholder="Nhập giá món ăn"
                            required
                        />
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <Label htmlFor="status">
                            Trạng thái <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value: 'AVAILABLE' | 'OUT_OF_STOCK') =>
                                setFormData((prev) => ({ ...prev, status: value }))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="AVAILABLE">Còn hàng</SelectItem>
                                <SelectItem value="OUT_OF_STOCK">Hết hàng</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Images */}
                    <div className="space-y-2">
                        <Label>
                            Hình ảnh <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-3">
                            {/* Image Grid */}
                            {images.length > 0 && (
                                <div className="grid grid-cols-3 gap-3">
                                    {images.map((url, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={url}
                                                alt={`Dish ${index + 1}`}
                                                className="w-full h-24 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Upload Button */}
                            <div className="flex items-center gap-2">
                                <Input
                                    id="imageUpload"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    disabled={uploading}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => document.getElementById('imageUpload')?.click()}
                                    disabled={uploading}
                                    className="w-full"
                                >
                                    {uploading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Đang tải lên...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4 mr-2" />
                                            Tải lên hình ảnh
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isLoading}
                        >
                            Hủy
                        </Button>
                        <Button type="submit" disabled={isLoading || uploading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Đang lưu...
                                </>
                            ) : (
                                <>{isEditMode ? 'Cập nhật' : 'Tạo mới'}</>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
