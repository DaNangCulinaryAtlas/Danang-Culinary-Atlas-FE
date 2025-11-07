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
import { getRestaurantsAsync } from "@/stores/restaurant/action";

function RestaurantSearchContent() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [resultsPerPage, setResultsPerPage] = useState(9);

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
  }));

  // Main fetch effect - simple fetch without filters
  useEffect(() => {
    dispatch(getRestaurantsAsync({
      page: currentPage - 1,
      size: resultsPerPage
    }));
  }, [dispatch, currentPage, resultsPerPage]);

  // Update URL when page changes
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", currentPage.toString());
    params.set("size", resultsPerPage.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  }, [currentPage, resultsPerPage, router]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleFilterChange = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <FilterSideBar
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 relative">
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
                searchTime={54}
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
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No restaurants found.</p>
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