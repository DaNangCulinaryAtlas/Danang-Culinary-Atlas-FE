"use client";

import React, { useState } from 'react';
import { useRestaurantDishes } from '@/hooks/queries/useRestaurantDishes';
import { DishCard } from './DishCard';
import { Loader2, ChevronLeft, ChevronRight, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MenuSectionProps {
    restaurantId: string;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ restaurantId }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 6; // Show 6 dishes per page

    const { data, isLoading, error } = useRestaurantDishes({
        restaurantId,
        page: currentPage,
        size: pageSize,
        sortBy: 'name',
        sortDirection: 'asc',
    });

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
            // Scroll to menu section
            document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleNextPage = () => {
        if (data && currentPage < data.totalPages - 1) {
            setCurrentPage(currentPage + 1);
            // Scroll to menu section
            document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    if (isLoading) {
        return (
            <section id="menu-section" className="mb-8">
                <h2 className="text-2xl font-bold text-[#44BACA] mb-6 flex items-center gap-2">
                    <UtensilsCrossed className="w-6 h-6" />
                    Menu
                </h2>
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-[#44BACA] animate-spin" />
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section id="menu-section" className="mb-8">
                <h2 className="text-2xl font-bold text-[#44BACA] mb-6 flex items-center gap-2">
                    <UtensilsCrossed className="w-6 h-6" />
                    Menu
                </h2>
                <div className="text-center py-10 bg-red-50 rounded-xl border border-red-200">
                    <p className="text-red-600 font-medium">Không thể tải menu. Vui lòng thử lại sau.</p>
                </div>
            </section>
        );
    }

    if (!data || data.content.length === 0) {
        return (
            <section id="menu-section" className="mb-8">
                <h2 className="text-2xl font-bold text-[#44BACA] mb-6 flex items-center gap-2">
                    <UtensilsCrossed className="w-6 h-6" />
                    Menu
                </h2>
                <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200">
                    <UtensilsCrossed className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 font-medium text-lg">Chưa có món ăn nào</p>
                    <p className="text-gray-500 text-sm mt-2">Menu sẽ được cập nhật sớm</p>
                </div>
            </section>
        );
    }

    return (
        <section id="menu-section" className="mb-8">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <UtensilsCrossed className="w-6 h-6 text-[#44BACA]" />
                    <h2 className="text-2xl font-bold text-[#44BACA]">Menu</h2>
                    <span className="text-sm text-gray-500 ml-2">
                        ({data.totalElements} món)
                    </span>
                </div>
            </div>

            {/* Dishes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {data.content.map((dish) => (
                    <DishCard key={dish.dishId} dish={dish} />
                ))}
            </div>

            {/* Pagination */}
            {data.totalPages > 1 && (
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    {/* Page Info */}
                    <div className="text-sm text-gray-600">
                        Trang <span className="font-semibold text-gray-900">{currentPage + 1}</span> trên{' '}
                        <span className="font-semibold text-gray-900">{data.totalPages}</span>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={handlePreviousPage}
                            disabled={currentPage === 0}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#44BACA] hover:text-white hover:border-[#44BACA] transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">Trước</span>
                        </Button>

                        {/* Page Numbers */}
                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                                let pageNumber;
                                if (data.totalPages <= 5) {
                                    pageNumber = i;
                                } else if (currentPage < 3) {
                                    pageNumber = i;
                                } else if (currentPage >= data.totalPages - 3) {
                                    pageNumber = data.totalPages - 5 + i;
                                } else {
                                    pageNumber = currentPage - 2 + i;
                                }

                                return (
                                    <button
                                        key={pageNumber}
                                        onClick={() => {
                                            setCurrentPage(pageNumber);
                                            document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        }}
                                        className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${currentPage === pageNumber
                                                ? 'bg-[#44BACA] text-white'
                                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                            }`}
                                    >
                                        {pageNumber + 1}
                                    </button>
                                );
                            })}
                        </div>

                        <Button
                            onClick={handleNextPage}
                            disabled={currentPage >= data.totalPages - 1}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#44BACA] hover:text-white hover:border-[#44BACA] transition-colors"
                        >
                            <span className="hidden sm:inline">Tiếp</span>
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}
        </section>
    );
};
