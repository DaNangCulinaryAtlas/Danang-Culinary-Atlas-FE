// components/FilterSideBar.tsx
import { memo, useCallback, useMemo } from "react";
import { RotateCcw } from "lucide-react";
import { FilterSideBarProps, FilterOption } from "@/types/filter";
import Star from "@/components/restaurants/Star";

// Constants
const CUISINE_OPTIONS: FilterOption[] = [
  { label: "Việt Nam", value: "vietnamese", count: 200 },
  { label: "Italian", value: "italian", count: 20 },
  { label: "French", value: "french", count: 50 },
  { label: "Japanese", value: "japanese", count: 5 },
  { label: "Californian", value: "californian", count: 15 },
  { label: "Seafood", value: "seafood", count: 10 },
];

const RATING_OPTIONS = [5, 4, 3, 2, 1];

// Subcomponents
interface CheckboxFilterProps {
  title: string;
  options: FilterOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

const CheckboxFilter = memo(function CheckboxFilter({
  title,
  options,
  selectedValues,
  onChange,
}: CheckboxFilterProps) {
  const handleToggle = useCallback((value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onChange(newValues);
  }, [selectedValues, onChange]);

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-800 text-base">{title}</h3>
      <div className="space-y-2">
        {options.map((option) => (
          <FilterCheckbox
            key={option.value}
            option={option}
            checked={selectedValues.includes(option.value)}
            onToggle={() => handleToggle(option.value)}
          />
        ))}
      </div>
    </div>
  );
});

interface FilterCheckboxProps {
  option: FilterOption;
  checked: boolean;
  onToggle: () => void;
}

const FilterCheckbox = memo(function FilterCheckbox({
  option,
  checked,
  onToggle,
}: FilterCheckboxProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="w-4 h-4 rounded border-gray-300 text-[#44BACA] focus:ring-[#44BACA] focus:ring-offset-0 cursor-pointer transition"
      />
      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition select-none">
        {option.label} <span className="text-gray-500">({option.count})</span>
      </span>
    </label>
  );
});

interface RatingFilterProps {
  selectedRating: number | null;
  onChange: (rating: number | null) => void;
}

const RatingFilter = memo(function RatingFilter({
  selectedRating,
  onChange,
}: RatingFilterProps) {
  const handleToggle = useCallback((rating: number) => {
    onChange(selectedRating === rating ? null : rating);
  }, [selectedRating, onChange]);

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-800 text-base">Ratings</h3>
      <div className="space-y-2">
        {RATING_OPTIONS.map((rating) => (
          <label key={rating} className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="rating"
              checked={selectedRating === rating}
              onChange={() => handleToggle(rating)}
              className="w-4 h-4 border-gray-300 text-[#44BACA] focus:ring-[#44BACA] focus:ring-offset-0 cursor-pointer"
            />
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} filled={i < rating} />
              ))}
              <span className="text-sm text-gray-600 ml-1">& up</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
});



// Main Component
const FilterSideBar = memo(function FilterSideBar({
  filters,
  onFilterChange,
}: FilterSideBarProps) {
  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.cuisineTypes.length > 0 ||
      filters.minRating !== null
    );
  }, [filters]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.cuisineTypes.length > 0) count += filters.cuisineTypes.length;
    if (filters.minRating !== null) count += 1;
    return count;
  }, [filters]);

  const handleClearAll = useCallback(() => {
    onFilterChange({
      cuisineTypes: [],
      minRating: null,
    });
  }, [onFilterChange]);

  const handleCuisineChange = useCallback((values: string[]) => {
    onFilterChange({ cuisineTypes: values });
  }, [onFilterChange]);

  const handleRatingChange = useCallback((rating: number | null) => {
    onFilterChange({ minRating: rating });
  }, [onFilterChange]);

  return (
    <aside
      className="w-full lg:w-64 bg-white rounded-lg shadow-sm border border-gray-100 sticky top-4 h-fit"
      role="complementary"
      aria-label="Search filters"
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <h2 className="text-[#44BACA] font-semibold text-lg">Filters</h2>
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
              aria-label="Clear all filters"
            >
              <RotateCcw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-300" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Cuisine Filter */}
        <CheckboxFilter
          title="Cuisine/Food Type"
          options={CUISINE_OPTIONS}
          selectedValues={filters.cuisineTypes}
          onChange={handleCuisineChange}
        />

        <div className="border-t border-gray-200" />

        {/* Rating Filter */}
        <RatingFilter
          selectedRating={filters.minRating}
          onChange={handleRatingChange}
        />

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <>
            <div className="border-t border-gray-200" />
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Active Filters
              </h4>
              <div className="flex flex-wrap gap-2">
                {filters.cuisineTypes.map((cuisine) => (
                  <FilterTag
                    key={cuisine}
                    label={CUISINE_OPTIONS.find(c => c.value === cuisine)?.label || cuisine}
                    onRemove={() => handleCuisineChange(filters.cuisineTypes.filter(c => c !== cuisine))}
                  />
                ))}
                {filters.minRating !== null && (
                  <FilterTag
                    label={`${filters.minRating}★`}
                    onRemove={() => handleRatingChange(null)}
                  />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
});

interface FilterTagProps {
  label: string;
  onRemove: () => void;
}

const FilterTag = memo(function FilterTag({ label, onRemove }: FilterTagProps) {
  return (
    <button
      onClick={onRemove}
      className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#44BACA]/10 text-[#44BACA] rounded-full text-sm hover:bg-[#44BACA]/20 transition group"
      aria-label={`Remove ${label} filter`}
    >
      <span>{label}</span>
      <svg
        className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  );
});

export default FilterSideBar;