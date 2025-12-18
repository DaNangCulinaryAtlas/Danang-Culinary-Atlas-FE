import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { RestaurantDish } from '@/hooks/queries/useRestaurantDishes';

interface DishCardProps {
    dish: RestaurantDish;
}

export const DishCard: React.FC<DishCardProps> = ({ dish }) => {
    const router = useRouter();
    const [imageError, setImageError] = useState(false);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    const handleClick = () => {
        router.push(`/dishes/${dish.dishId}`);
    };

    return (
        <div
            onClick={handleClick}
            className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer hover:border-[#44BACA]"
        >
            {/* Dish Image */}
            <div className="relative w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                {dish.images && dish.images.length > 0 && !imageError ? (
                    <Image
                        src={dish.images[0]}
                        alt={dish.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <svg
                                className="w-16 h-16 mx-auto text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                                />
                            </svg>
                            <p className="text-sm text-gray-500 mt-2">No image available</p>
                        </div>
                    </div>
                )}

                {/* Status Badge */}
                {dish.status === 'UNAVAILABLE' && (
                    <div className="absolute top-3 right-3">
                        <span className="bg-gray-900/80 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
                            Tạm hết
                        </span>
                    </div>
                )}

                {/* Price Tag */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-white font-bold text-lg">{formatPrice(dish.price)}</p>
                </div>
            </div>

            {/* Dish Info */}
            <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-[#44BACA] transition-colors">
                    {dish.name}
                </h3>

                {dish.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {dish.description}
                    </p>
                )}

                {/* Availability Indicator */}
                <div className="mt-3 flex items-center">
                    <div
                        className={`w-2 h-2 rounded-full mr-2 ${dish.status === 'AVAILABLE' ? 'bg-green-500' : 'bg-gray-400'
                            }`}
                    />
                    <span
                        className={`text-xs font-medium ${dish.status === 'AVAILABLE' ? 'text-green-600' : 'text-gray-500'
                            }`}
                    >
                        {dish.status === 'AVAILABLE' ? 'Còn món' : 'Tạm hết'}
                    </span>
                </div>
            </div>
        </div>
    );
};
