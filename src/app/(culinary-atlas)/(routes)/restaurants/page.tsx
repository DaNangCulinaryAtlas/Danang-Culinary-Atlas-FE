"use client";

import { useState, useCallback, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import RestaurantCard from "@/components/restaurants/RestaurantCard";
import Pagination from "./components/Pagination";
import FilterSideBar from "./components/FilterSideBar";
import FindRestaurants from "./components/FindRestaurants";
import SearchResultPages from "./components/SearchResultPages";
import ViewToggle from "./components/ViewToggle";
import SearchResult from "./components/SearchResult";
import ViewMode from "@/types/view-mode";
import { FilterState } from "@/types/filter";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { getRestaurantsAsync, searchRestaurantsAsync } from "@/stores/restaurant/action";

function RestaurantSearchContent() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [resultsPerPage, setResultsPerPage] = useState(9);
  const [searchTime, setSearchTime] = useState<number>(0);

  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const {
    restaurants,
    loading,
    error,
    totalPages,
    totalElements
  } = useAppSelector((state) => state.restaurant);

  // Initialize from URL params
  const [currentPage, setCurrentPage] = useState(() =>
    parseInt(searchParams.get("page") || "1", 10)
  );

  const [filters, setFilters] = useState<FilterState>(() => ({
    cuisineTypes: [],
    minRating: null,
    maxRating: null,
  }));

  // Main fetch effect - fetch with filters
  useEffect(() => {
    const startTime = performance.now();
    const hasFilters = filters.cuisineTypes.length > 0 || filters.minRating !== null || filters.maxRating !== null;

    const params = {
      page: currentPage - 1,
      size: resultsPerPage,
      sortBy: 'average_rating',
      sortDirection: 'desc' as const,
      ...(filters.cuisineTypes.length > 0 && { cuisineTypes: filters.cuisineTypes }),
      ...(filters.minRating !== null && { minRating: filters.minRating }),
      ...(filters.maxRating !== null && { maxRating: filters.maxRating })
    };

    const fetchData = async () => {
      if (hasFilters) {
        await dispatch(searchRestaurantsAsync(params));
      } else {
        await dispatch(getRestaurantsAsync({
          page: currentPage - 1,
          size: resultsPerPage
        }));
      }

      const endTime = performance.now();
      const timeInSeconds = ((endTime - startTime) / 1000).toFixed(2);
      setSearchTime(parseFloat(timeInSeconds));
    };

    fetchData();
  }, [dispatch, currentPage, resultsPerPage, filters]);

  // Update URL when page or filters change
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", currentPage.toString());
    params.set("size", resultsPerPage.toString());

    if (filters.cuisineTypes.length > 0) {
      filters.cuisineTypes.forEach(cuisine => {
        params.append("cuisineTypes", cuisine);
      });
    }

    if (filters.minRating !== null) {
      params.set("minRating", filters.minRating.toString());
    }

    if (filters.maxRating !== null) {
      params.set("maxRating", filters.maxRating.toString());
    }

    router.push(`?${params.toString()}`, { scroll: false });
  }, [currentPage, resultsPerPage, filters, router]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleFilterChange = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    // Reset to page 1 when filters change
    setCurrentPage(1);
  }, []);

  const handleRestaurantClick = useCallback((restaurantId: string) => {
    router.push(`/restaurants/${restaurantId}`);
  }, [router]);

  // Show loading state on initial load
  if (loading && restaurants.length === 0) {
    return <LoadingState />;
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <button
            onClick={() => dispatch(getRestaurantsAsync({
              page: 0,
              size: resultsPerPage
            }))}
            className="mt-4 px-4 py-2 bg-[#44BACA] text-white rounded hover:bg-[#3aa3b3]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <FindRestaurants />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar - Fixed positioning */}
          <aside className="lg:w-64 w-full shrink-0">
            <div className="lg:sticky lg:top-4">
              <FilterSideBar
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 w-full">
            {/* Loading overlay for subsequent requests */}
            {loading && restaurants.length > 0 && (
              <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#44BACA]"></div>
              </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <SearchResult
                totalResults={totalElements}
                searchTime={searchTime}
              />

              <div className="flex flex-wrap items-center gap-3">
                <SearchResultPages
                  resultsPerPage={resultsPerPage}
                  setResultsPerPage={setResultsPerPage}
                />

                <ViewToggle
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                />
              </div>
            </div>

            {/* Restaurant Grid/List */}
            {restaurants.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 min-h-[500px] flex items-center justify-center">
                <div className="text-center max-w-md mx-auto">
                  <svg
                    className="w-24 h-24 mx-auto text-gray-300 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Không tìm thấy nhà hàng nào,
                  </h3>
                  <p className="text-gray-600 mb-6">
                   Chúng tôi không tìm thấy nhà hàng nào phù hợp với bộ lọc hiện tại của bạn.
                  </p>
                  <button
                    onClick={() => setFilters({ cuisineTypes: [], minRating: null, maxRating: null })}
                    className="px-6 py-3 bg-[#44BACA] text-white rounded-lg hover:bg-[#3aa3b3] transition-colors font-medium shadow-sm hover:shadow-md"
                  >
                    Xóa tất cả bộ lọc
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className={`
                  ${viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "flex flex-col gap-4"
                  }
                `}>
                  {restaurants.map((restaurant) => (
                    <RestaurantCard
                      key={restaurant.restaurantId}
                      restaurant={restaurant}
                      onClick={() => handleRestaurantClick(restaurant.restaurantId)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingState />}>
      <RestaurantSearchContent />
    </Suspense>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#44BACA] mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading restaurants...</p>
      </div>
    </div>
  );
}