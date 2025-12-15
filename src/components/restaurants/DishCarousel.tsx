"use client";
import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useRestaurantDishes, RestaurantDish } from '@/hooks/queries/useRestaurantDishes';

interface DishCarouselProps {
    restaurantId: string;
}

const DishCarousel: React.FC<DishCarouselProps> = ({ restaurantId }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const { data: dishesData, isLoading, error } = useRestaurantDishes({
        restaurantId,
        page: 0,
        size: 10,
        sortBy: 'name',
        sortDirection: 'asc',
    });

    const dishes = dishesData?.content || [];

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 400;
            const newScrollLeft = direction === 'left'
                ? scrollContainerRef.current.scrollLeft - scrollAmount
                : scrollContainerRef.current.scrollLeft + scrollAmount;

            scrollContainerRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth',
            });
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="w-12 h-12 animate-spin text-[#44BACA]" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10">
                <p className="text-red-600">Không thể tải danh sách món ăn</p>
            </div>
        );
    }

    if (dishes.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-gray-500">Nhà hàng chưa có món ăn nào</p>
            </div>
        );
    }

    return (
        <div className="relative group py-4">
            {/* Left Navigation Button */}
            <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                aria-label="Scroll left"
            >
                <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>

            {/* Dishes Container */}
            <div
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-4 py-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {dishes.map((dish) => (
                    <div
                        key={dish.dishId}
                        className="flex-none w-80 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden mb-2"
                    >
                        {/* Dish Image */}
                        <div className="relative w-full h-48 bg-gray-200">
                            {dish.images && dish.images.length > 0 ? (
                                <img
                                    src={dish.images[0]}
                                    alt={dish.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-gray-400 text-sm">No image</span>
                                </div>
                            )}

                        </div>
                        {/* Dish Info */}
                        <div className="p-5">
                            <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
                                {dish.name}
                            </h3>

                            <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]">
                                {dish.description}
                            </p>

                            <div className="flex items-center justify-between">
                                <span className="text-[#44BACA] font-bold text-xl">
                                    {formatPrice(dish.price)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Right Navigation Button */}
            <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                aria-label="Scroll right"
            >
                <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
        </div>
    );
};

export default DishCarousel;
