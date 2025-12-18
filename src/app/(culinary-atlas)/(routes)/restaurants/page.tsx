"use client";

import { useState, useCallback, Suspense, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "./components/Pagination";
import FilterSideBar from "./components/FilterSideBar";
import FindRestaurants from "./components/FindRestaurants";
import RestaurantHeader from "./components/RestaurantHeader";
import RestaurantGrid from "./components/RestaurantGrid";
import ViewMode from "@/types/view-mode";
import { FilterState } from "@/types/filter";
import { useSearchRestaurants, useRestaurants, useSearchRestaurantsByName } from "@/hooks/queries/useRestaurants";
import { useTranslation } from "@/hooks/useTranslation";

function RestaurantSearchContent() {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [resultsPerPage, setResultsPerPage] = useState(9);
  const [searchTime, setSearchTime] = useState<number>(0);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Get search query from URL params
  const searchQuery = searchParams.get("name") || "";

  // Initialize from URL params
  const [currentPage, setCurrentPage] = useState(() =>
    parseInt(searchParams.get("page") || "1", 10)
  );

  const [filters, setFilters] = useState<FilterState>(() => ({
    cuisineIds: [],
    minRating: null,
    maxRating: null,
  }));

  // Prepare query params for React Query
  const hasFilters = filters.cuisineIds.length > 0 || filters.minRating !== null || filters.maxRating !== null;

  const queryParams = {
    page: currentPage - 1,
    size: resultsPerPage,
    sortBy: 'average_rating',
    sortDirection: 'desc' as const,
    ...(filters.cuisineIds.length > 0 && { cuisineIDs: filters.cuisineIds }),
    ...(filters.minRating !== null && { minRating: filters.minRating }),
    ...(filters.maxRating !== null && { maxRating: filters.maxRating })
  };

  // Fetch search by name if search query exists
  const {
    data: searchByNameData,
    isLoading: isSearchByNameLoading,
    error: searchByNameError
  } = useSearchRestaurantsByName(
    searchQuery,
    { page: currentPage - 1, size: resultsPerPage, sortBy: 'createdAt', sortDirection: 'desc' },
    !!searchQuery.trim()
  );

  // Fetch with filters or without
  const {
    data: filteredData,
    isLoading: isFilteredLoading,
    error: filteredError
  } = useSearchRestaurants(queryParams, hasFilters && !searchQuery.trim());

  const {
    data: allData,
    isLoading: isAllLoading,
    error: allError
  } = useRestaurants(
    { page: currentPage - 1, size: resultsPerPage },
    !hasFilters && !searchQuery.trim() // Only fetch if no filters and no search query
  );

  // Determine which data to use
  let data: any = null;
  let isLoading = false;
  let error: any = null;

  if (searchQuery.trim()) {
    // If search query exists, use search by name data
    data = searchByNameData;
    isLoading = isSearchByNameLoading;
    error = searchByNameError;
  } else if (hasFilters) {
    // If filters exist, use filtered data
    data = filteredData;
    isLoading = isFilteredLoading;
    error = filteredError;
  } else {
    // Otherwise use all data
    data = allData;
    isLoading = isAllLoading;
    error = allError;
  }

  const restaurants = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const totalElements = data?.totalElements || 0;

  // Measure search time
  useEffect(() => {
    if (!isLoading) {
      const timeInSeconds = ((Math.random() * 0.5 + 0.1).toFixed(2)); // Simulate time (remove in production)
      setSearchTime(parseFloat(timeInSeconds as string));
    }
  }, [isLoading]);

  // Update URL when page or filters change (but keep search query if exists)
  useEffect(() => {
    const params = new URLSearchParams();

    // Keep search query if it exists
    if (searchQuery) {
      params.set("name", searchQuery);
    }

    params.set("page", currentPage.toString());
    params.set("size", resultsPerPage.toString());

    if (filters.cuisineIds.length > 0) {
      filters.cuisineIds.forEach(id => {
        params.append("cuisineID", id.toString());
      });
    }

    if (filters.minRating !== null) {
      params.set("minRating", filters.minRating.toString());
    }

    if (filters.maxRating !== null) {
      params.set("maxRating", filters.maxRating.toString());
    }

    router.push(`?${params.toString()}`, { scroll: false });
  }, [currentPage, resultsPerPage, filters, searchQuery, router]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleFilterChange = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    // Reset to page 1 when filters change
    setCurrentPage(1);
  }, []);

  // Memoize the filter sidebar to prevent re-renders
  const filterSidebar = useMemo(() => (
    <FilterSideBar
      filters={filters}
      onFilterChange={handleFilterChange}
    />
  ), [filters, handleFilterChange]);

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <FindRestaurants />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 text-lg">
              {error instanceof Error ? error.message : t('restaurants.errorLoading')}
            </p>
            <button
              onClick={() => {
                setFilters({ cuisineIds: [], minRating: null, maxRating: null });
                setCurrentPage(1);
                router.push('/restaurants');
              }}
              className="mt-4 px-4 py-2 bg-[#44BACA] text-white rounded hover:bg-[#3aa3b3]"
            >
              {t('restaurants.tryAgain')}
            </button>
          </div>
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
              {filterSidebar}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 w-full">
            {/* Header */}
            <RestaurantHeader
              totalResults={totalElements}
              searchTime={searchTime}
              resultsPerPage={resultsPerPage}
              setResultsPerPage={setResultsPerPage}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />

            {/* Restaurant Grid with Empty State */}
            {restaurants.length === 0 && !isLoading ? (
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
                    {t('restaurants.noRestaurantsFound')}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {t('restaurants.noRestaurantsDescription')}
                  </p>
                  <button
                    onClick={() => {
                      setFilters({ cuisineIds: [], minRating: null, maxRating: null });
                      setCurrentPage(1);
                      router.push('/restaurants');
                    }}
                    className="px-6 py-3 bg-[#44BACA] text-white rounded-lg hover:bg-[#3aa3b3] transition-colors font-medium shadow-sm hover:shadow-md"
                  >
                    {t('restaurants.clearAllFilters')}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <RestaurantGrid
                  restaurants={restaurants}
                  viewMode={viewMode}
                  loading={isLoading}
                  resultsPerPage={resultsPerPage}
                />

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
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#44BACA] mx-auto"></div>
        <p className="mt-4 text-gray-600">{t('restaurants.loading')}</p>
      </div>
    </div>
  );
}