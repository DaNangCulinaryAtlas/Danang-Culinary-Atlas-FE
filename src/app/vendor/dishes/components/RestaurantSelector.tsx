"use client"

import { useMemo } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Store, MapPin, Check } from 'lucide-react';
import { vendorColors } from '@/configs/colors';
import Image from 'next/image';

interface Restaurant {
    id: string;
    name: string;
    address: string;
    image?: string | null;
    approvalStatus: string;
    averageRating?: number | null;
    totalReviews?: number | null;
}

interface RestaurantSelectorProps {
    restaurants: Restaurant[];
    selectedRestaurantId: string | null;
    onSelectRestaurant: (restaurantId: string) => void;
    isLoading?: boolean;
}

export default function RestaurantSelector({
    restaurants,
    selectedRestaurantId,
    onSelectRestaurant,
    isLoading = false,
}: RestaurantSelectorProps) {
    const selectedRestaurant = useMemo(() => {
        return restaurants.find(r => r.id === selectedRestaurantId);
    }, [restaurants, selectedRestaurantId]);

    // If only one restaurant, show a simple card instead of selector
    if (restaurants.length === 1) {
        const restaurant = restaurants[0];
        return (
            <Card className="border-2 shadow-md" style={{ borderColor: vendorColors.primary[200] }}>
                <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                            {restaurant.image ? (
                                <Image
                                    src={restaurant.image}
                                    alt={restaurant.name}
                                    width={64}
                                    height={64}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                    <Store className="h-8 w-8 text-gray-400" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-lg truncate" style={{ color: vendorColors.primary[700] }}>
                                    {restaurant.name}
                                </h3>
                                <Badge className="bg-green-100 text-green-800 border-green-300 shrink-0">
                                    <Check className="mr-1 h-3 w-3" />
                                    Đang chọn
                                </Badge>
                            </div>
                            <p className="text-sm text-gray-500 truncate flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {restaurant.address}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Multiple restaurants - show selector dropdown with preview
    return (
        <div className="space-y-3">
            <Select
                value={selectedRestaurantId || undefined}
                onValueChange={onSelectRestaurant}
                disabled={isLoading}
            >
                <SelectTrigger
                    className="w-full h-auto py-3 border-2"
                    style={{ borderColor: vendorColors.primary[200] }}
                >
                    <SelectValue placeholder="Chọn quán ăn để quản lý món">
                        {selectedRestaurant ? (
                            <div className="flex items-center gap-3 text-left">
                                <div className="h-10 w-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                    {selectedRestaurant.image ? (
                                        <Image
                                            src={selectedRestaurant.image}
                                            alt={selectedRestaurant.name}
                                            width={40}
                                            height={40}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center">
                                            <Store className="h-5 w-5 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold truncate" style={{ color: vendorColors.primary[700] }}>
                                        {selectedRestaurant.name}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {selectedRestaurant.address}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <span className="text-gray-500">Chọn quán ăn để quản lý món</span>
                        )}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-80">
                    {restaurants.map((restaurant) => (
                        <SelectItem
                            key={restaurant.id}
                            value={restaurant.id}
                            className="py-3 cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                    {restaurant.image ? (
                                        <Image
                                            src={restaurant.image}
                                            alt={restaurant.name}
                                            width={40}
                                            height={40}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center">
                                            <Store className="h-5 w-5 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold truncate">
                                            {restaurant.name}
                                        </p>
                                        {restaurant.approvalStatus === 'PENDING' && (
                                            <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-300">
                                                Chờ duyệt
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        {restaurant.address}
                                    </p>
                                </div>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Quick stats for selected restaurant */}
            {selectedRestaurant && (
                <div className="flex items-center gap-4 text-sm text-gray-600 px-1">
                    <span>
                        {restaurants.length} quán ăn
                    </span>
                </div>
            )}
        </div>
    );
}
