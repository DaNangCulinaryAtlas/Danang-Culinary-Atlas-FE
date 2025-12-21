"use client";
import { useState, useMemo, useEffect } from "react";
import { Search, SlidersHorizontal, Grid3x3, List, X, Loader2, TrendingUp, CircleDollarSign, Layers2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDishes } from "@/hooks/queries/useDishes";
import { CUISINE_TAGS } from "@/constants/cuisineTags";
import Link from "next/link";
import { useTranslation } from '@/hooks/useTranslation';

export default function DishPage() {
  const { t } = useTranslation();
  
  const PRICE_RANGES = [
    { label: t('dishes.priceRanges.under30k'), min: 0, max: 30000, key: 'under30k' },
    { label: t('dishes.priceRanges.30k50k'), min: 30000, max: 50000, key: '30k50k' },
    { label: t('dishes.priceRanges.50k100k'), min: 50000, max: 100000, key: '50k100k' },
    { label: t('dishes.priceRanges.100k200k'), min: 100000, max: 200000, key: '100k200k' },
    { label: t('dishes.priceRanges.over200k'), min: 200000, max: 10000000, key: 'over200k' }
  ];
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTagId, setSelectedTagId] = useState<number | undefined>(undefined);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("");
  const [sortBy, setSortBy] = useState<"name" | "price">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  // When user types in search, clear other filters
  useEffect(() => {
    if (searchQuery) {
      setSelectedTagId(undefined);
      setSelectedPriceRange("");
    }
  }, [searchQuery]);

  // Get price range values
  const priceRange = useMemo(() => {
    if (!selectedPriceRange) return undefined;
    const range = PRICE_RANGES.find(r => r.key === selectedPriceRange);
    return range ? { min: range.min, max: range.max } : undefined;
  }, [selectedPriceRange]);

  // Fetch dishes with filters
  // When searching, only use search param and ignore other filters
  const { data: dishesResponse, isLoading, error } = useDishes(
    searchQuery
      ? {
        page: currentPage,
        size: 20,
        search: searchQuery,
      }
      : {
        page: currentPage,
        size: 20,
        tagId: selectedTagId,
        minPrice: priceRange?.min,
        maxPrice: priceRange?.max,
        sortBy,
        sortOrder,
      }
  );

  // Filter dishes by search query locally
  const filteredDishes = useMemo(() => {
    if (!dishesResponse?.data?.content) return [];

    if (!searchQuery) return dishesResponse.data.content;

    return dishesResponse.data.content.filter(dish =>
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [dishesResponse, searchQuery]);

  const totalPages = dishesResponse?.data?.totalPages || 0;
  const totalElements = dishesResponse?.data?.totalElements || 0;

  const toggleTag = (tagId: number) => {
    setSelectedTagId(prev => prev === tagId ? undefined : tagId);
    setCurrentPage(0); // Reset to first page when filter changes
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTagId(undefined);
    setSelectedPriceRange("");
    setCurrentPage(0);
  };

  const handleSortChange = (value: string) => {
    switch (value) {
      case "name-asc":
        setSortBy("name");
        setSortOrder("asc");
        break;
      case "name-desc":
        setSortBy("name");
        setSortOrder("desc");
        break;
      case "price-asc":
        setSortBy("price");
        setSortOrder("asc");
        break;
      case "price-desc":
        setSortBy("price");
        setSortOrder("desc");
        break;
    }
    setCurrentPage(0);
  };

  const hasActiveFilters = selectedTagId !== undefined || selectedPriceRange !== "";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div
        className="relative text-white py-24 overflow-hidden"
        style={{
          backgroundImage: "url('/images/bg-dish.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#44BACA]/80 via-[#44BACA]/70 to-[#69C3CF]/80"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <h1 className="font-volkhov font-bold text-4xl md:text-5xl text-center mb-6 drop-shadow-lg">
            {t('dishes.title')}
          </h1>
          <p className="text-center text-lg mb-8 opacity-95 drop-shadow">
            {totalElements > 0 ? t('dishes.subtitle', { count: totalElements }) : t('dishes.subtitleEmpty')}
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('dishes.searchPlaceholder')}
                className="w-full pl-12 pr-4 py-4 rounded-full text-gray-900 font-mulish text-base focus:outline-none focus:ring-2 focus:ring-white/50 shadow-xl"
              />
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {CUISINE_TAGS.slice(0, 6).map((tag) => (
              <Button
                key={tag.tagId}
                onClick={() => {
                  toggleTag(tag.tagId);
                  setShowMobileFilters(false);
                }}
                className={`backdrop-blur-sm border rounded-full px-6 py-2 ${selectedTagId === tag.tagId
                  ? 'bg-white text-[#44BACA] border-white'
                  : 'bg-white/20 hover:bg-white/30 border-white/30'
                  }`}
              >
                {tag.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-[#44BACA]">{t('dishes.filters')}</h3>
                {hasActiveFilters && (
                  <Button
                    onClick={clearFilters}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    {t('dishes.clearFilters')}
                  </Button>
                )}
              </div>

              {/* Tags Filter */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-[#44BACA] mb-3">
                  <Layers2 className="w-5 h-5" />
                  <h4 className="font-semibold">{t('dishes.cuisineType')}</h4>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {CUISINE_TAGS.map(tag => (
                    <label key={tag.tagId} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="cuisineTag"
                        checked={selectedTagId === tag.tagId}
                        onChange={() => toggleTag(tag.tagId)}
                        className="border-gray-300 text-[#44BACA] focus:ring-[#44BACA]"
                      />
                      <span className="text-sm">{tag.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-[#44BACA] mb-3">
                  <CircleDollarSign className="w-5 h-5" />
                  <h4 className="font-semibold">{t('dishes.priceRange')}</h4>
                </div>
                <div className="space-y-2">
                  {PRICE_RANGES.map(range => (
                    <label key={range.key} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="priceRange"
                        checked={selectedPriceRange === range.key}
                        onChange={() => setSelectedPriceRange(range.key)}
                        className="border-gray-300 text-[#44BACA] focus:ring-[#44BACA]"
                      />
                      <span className="text-sm">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort Filter */}
              <div>
                <div className="flex items-center gap-2 text-[#44BACA] mb-3">
                  <TrendingUp className="w-5 h-5" />
                  <h4 className="font-semibold">{t('dishes.sort')}</h4>
                </div>
                <div className="space-y-2">
                  {[
                    { value: "name-asc", label: t('dishes.sortNameAsc') },
                    { value: "name-desc", label: t('dishes.sortNameDesc') },
                    { value: "price-asc", label: t('dishes.sortPriceAsc') },
                    { value: "price-desc", label: t('dishes.sortPriceDesc') }
                  ].map(option => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="sortBy"
                        checked={sortBy === option.value.split('-')[0] && sortOrder === option.value.split('-')[1]}
                        onChange={() => handleSortChange(option.value)}
                        className="border-gray-300 text-[#44BACA] focus:ring-[#44BACA]"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div>
            {/* Results Toolbar */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="font-semibold text-gray-700">
                  {t('dishes.found')} <span className="text-[#44BACA]">{filteredDishes.length}</span> {t('dishes.dishes')}
                </div>

                <div className="flex items-center gap-3">
                  {/* Mobile Filter Button */}
                  <Button
                    onClick={() => setShowMobileFilters(true)}
                    className="lg:hidden bg-[#44BACA] hover:bg-[#3aa3b3] text-white rounded-lg px-4 py-2"
                  >
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    {t('dishes.filter')}
                  </Button>

                  {/* View Toggle */}
                  <div className="hidden md:flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded ${viewMode === "grid" ? "bg-white shadow-sm" : ""}`}
                    >
                      <Grid3x3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded ${viewMode === "list" ? "bg-white shadow-sm" : ""}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Mobile Sort */}
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="lg:hidden border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="name-asc">{t('dishes.sortNameAsc')}</option>
                    <option value="name-desc">{t('dishes.sortNameDesc')}</option>
                    <option value="price-asc">{t('dishes.sortPriceAsc')}</option>
                    <option value="price-desc">{t('dishes.sortPriceDesc')}</option>
                  </select>
                </div>
              </div>

              {/* Active Filters */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedTagId && (
                    <span className="inline-flex items-center gap-1 bg-[#44BACA]/10 text-[#44BACA] px-3 py-1 rounded-full text-sm">
                      {CUISINE_TAGS.find(t => t.tagId === selectedTagId)?.name}
                      <button onClick={() => setSelectedTagId(undefined)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedPriceRange && (
                    <span className="inline-flex items-center gap-1 bg-[#44BACA]/10 text-[#44BACA] px-3 py-1 rounded-full text-sm">
                      {PRICE_RANGES.find(r => r.key === selectedPriceRange)?.label || selectedPriceRange}
                      <button onClick={() => setSelectedPriceRange("")}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Dishes Grid */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-[#44BACA] animate-spin mb-4" />
                <p className="text-gray-600">{t('dishes.loading')}</p>
              </div>
            ) : error ? (
              <div className="text-center py-16 bg-white rounded-xl">
                <div className="w-16 h-16 mx-auto mb-4 text-red-400">
                  <X className="w-full h-full" />
                </div>
                <h3 className="font-bold text-xl mb-2">{t('dishes.error')}</h3>
                <p className="text-gray-600 mb-6">{t('dishes.errorMessage')}</p>
              </div>
            ) : filteredDishes.length > 0 ? (
              <>
                <div className={`grid gap-6 ${viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
                  }`}>
                  {filteredDishes.map(dish => (
                    <Link key={dish.dishId} href={`/dishes/${dish.dishId}`}>
                      <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden cursor-pointer h-full">
                        <div className="aspect-[4/3] relative overflow-hidden">
                          <img
                            src={dish.images?.[0] || '/images/default-dish.png'}
                            alt={dish.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />

                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-lg mb-2 line-clamp-2">{dish.name}</h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{dish.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-[#44BACA] font-bold text-xl">
                              {dish.price.toLocaleString('vi-VN')}₫
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${dish.status === 'AVAILABLE'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                              }`}>
                              {dish.status === 'AVAILABLE' ? t('dishes.available') : t('dishes.unavailable')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <Button
                      onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                      disabled={currentPage === 0}
                      className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {t('dishes.previous')}
                    </Button>
                    <div className="flex gap-2">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i;
                        } else if (currentPage < 3) {
                          pageNum = i;
                        } else if (currentPage > totalPages - 3) {
                          pageNum = totalPages - 5 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <Button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-10 h-10 rounded-lg ${currentPage === pageNum
                              ? 'bg-[#44BACA] text-white'
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                          >
                            {pageNum + 1}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                      disabled={currentPage === totalPages - 1}
                      className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {t('dishes.next')}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <div className="text-center py-16 bg-white rounded-xl">
                <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                  <Search className="w-full h-full" />
                </div>
                <h3 className="font-bold text-xl mb-2">{t('dishes.noResults')}</h3>
                <p className="text-gray-600 mb-6">{t('dishes.noResultsMessage')}</p>
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={clearFilters}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg px-6 py-2"
                  >
                    {t('dishes.clearAllFilters')}
                  </Button>
                  <Button
                    onClick={() => {
                      clearFilters();
                      setSearchQuery("");
                    }}
                    className="bg-[#44BACA] hover:bg-[#3aa3b3] text-white rounded-lg px-6 py-2"
                  >
                    {t('dishes.viewAll')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg">{t('dishes.filters')}</h3>
              <button onClick={() => setShowMobileFilters(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Same filters as desktop */}
            <div className="space-y-6">
              {/* Tags */}
              <div>
                <h4 className="font-semibold mb-3">🍽️ {t('dishes.cuisineType')}</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {CUISINE_TAGS.map(tag => (
                    <label key={tag.tagId} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="mobileCuisineTag"
                        checked={selectedTagId === tag.tagId}
                        onChange={() => toggleTag(tag.tagId)}
                        className="border-gray-300 text-[#44BACA] focus:ring-[#44BACA]"
                      />
                      <span className="text-sm">{tag.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <h4 className="font-semibold mb-3">💰 {t('dishes.priceRange')}</h4>
                <div className="space-y-2">
                  {PRICE_RANGES.map(range => (
                    <label key={range.key} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="mobilePriceRange"
                        checked={selectedPriceRange === range.key}
                        onChange={() => setSelectedPriceRange(range.key)}
                        className="border-gray-300 text-[#44BACA] focus:ring-[#44BACA]"
                      />
                      <span className="text-sm">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={clearFilters}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg py-3"
              >
                {t('dishes.clearAllFilters')}
              </Button>
              <Button
                onClick={() => setShowMobileFilters(false)}
                className="flex-1 bg-[#44BACA] hover:bg-[#3aa3b3] text-white rounded-lg py-3"
              >
                {t('dishes.apply')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}