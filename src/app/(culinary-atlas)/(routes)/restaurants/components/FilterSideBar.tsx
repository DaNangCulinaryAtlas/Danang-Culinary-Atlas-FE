// components/FilterSideBar.tsx
import { memo, useCallback, useMemo } from "react";
import { RotateCcw } from "lucide-react";
import { FilterSideBarProps } from "@/types/filter";
import CuisineFilter from "./filters/CuisineFilter";
import RatingFilter from "./filters/RatingFilter";
import ActiveFilters from "./filters/ActiveFilters";
import { useTranslation } from "@/hooks/useTranslation";

const FilterSideBar = memo(function FilterSideBar({
  filters,
  onFilterChange,
}: FilterSideBarProps) {
  const { t } = useTranslation();
  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.cuisineIds.length > 0 ||
      filters.minRating !== null ||
      filters.maxRating !== null
    );
  }, [filters]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.cuisineIds.length > 0) count += filters.cuisineIds.length;
    if (filters.minRating !== null) count += 1;
    if (filters.maxRating !== null) count += 1;
    return count;
  }, [filters]);

  const handleClearAll = useCallback(() => {
    onFilterChange({
      cuisineIds: [],
      minRating: null,
      maxRating: null,
    });
  }, [onFilterChange]);

  const handleCuisineChange = useCallback((cuisineIds: number[]) => {
    onFilterChange({ cuisineIds });
  }, [onFilterChange]);

  const handleRatingChange = useCallback((minRating: number | null, maxRating: number | null) => {
    onFilterChange({ minRating, maxRating });
  }, [onFilterChange]);

  const handleRemoveCuisine = useCallback((cuisineId: number) => {
    onFilterChange({ cuisineIds: filters.cuisineIds.filter(id => id !== cuisineId) });
  }, [onFilterChange, filters.cuisineIds]);

  const handleRemoveMinRating = useCallback(() => {
    onFilterChange({ minRating: null });
  }, [onFilterChange]);

  const handleRemoveMaxRating = useCallback(() => {
    onFilterChange({ maxRating: null });
  }, [onFilterChange]);

  return (
    <aside
      className="w-full bg-white rounded-lg shadow-sm border border-gray-100 h-fit"
      role="complementary"
      aria-label="Search filters"
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <h2 className="text-[#44BACA] font-semibold text-lg">{t('restaurants.filters.title')}</h2>
            {activeFilterCount > 0 && (
              <span className="bg-[#44BACA] text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-[#44BACA] transition group"
              aria-label={t('restaurants.clearAllFilters')}
            >
              <RotateCcw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-300" />
              <span>{t('restaurants.filters.clear')}</span>
            </button>
          )}
        </div>

        {/* Cuisine Filter */}
        <CuisineFilter
          selectedCuisineIds={filters.cuisineIds}
          onChange={handleCuisineChange}
        />

        <div className="border-t border-gray-200" />

        {/* Rating Filter */}
        <RatingFilter
          minRating={filters.minRating}
          maxRating={filters.maxRating}
          onChange={handleRatingChange}
        />

        {/* Active Filters */}
        {hasActiveFilters && (
          <>
            <div className="border-t border-gray-200" />
            <ActiveFilters
              filters={filters}
              onRemoveCuisine={handleRemoveCuisine}
              onRemoveMinRating={handleRemoveMinRating}
              onRemoveMaxRating={handleRemoveMaxRating}
              onClearAll={handleClearAll}
            />
          </>
        )}
      </div>
    </aside>
  );
});

export default FilterSideBar;