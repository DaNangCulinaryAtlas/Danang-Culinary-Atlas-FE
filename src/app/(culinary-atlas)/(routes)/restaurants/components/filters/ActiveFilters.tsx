import { memo } from "react";
import { FilterState } from "@/types/filter";
import { CUISINE_TAGS } from "@/constants/cuisineTags";

interface ActiveFiltersProps {
    filters: FilterState;
    onRemoveCuisine: (cuisineId: number) => void;
    onRemoveMinRating: () => void;
    onRemoveMaxRating: () => void;
    onClearAll: () => void;
}

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

const ActiveFilters = memo(function ActiveFilters({
    filters,
    onRemoveCuisine,
    onRemoveMinRating,
    onRemoveMaxRating,
    onClearAll,
}: ActiveFiltersProps) {
    const hasActiveFilters =
        filters.cuisineIds.length > 0 ||
        filters.minRating !== null ||
        filters.maxRating !== null;

    if (!hasActiveFilters) {
        return null;
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Active Filters
                </h4>
                <button
                    onClick={onClearAll}
                    className="text-xs text-[#44BACA] hover:text-[#3aa3b3] font-medium transition"
                >
                    Clear All
                </button>
            </div>

            <div className="flex flex-wrap gap-2">
                {/* Cuisine Type Tags */}
                {filters.cuisineIds.map((cuisineId) => {
                    const cuisine = CUISINE_TAGS.find(tag => tag.tagId === cuisineId);
                    return cuisine ? (
                        <FilterTag
                            key={cuisine.tagId}
                            label={cuisine.name}
                            onRemove={() => onRemoveCuisine(cuisineId)}
                        />
                    ) : null;
                })}

                {/* Min Rating Tag */}
                {filters.minRating !== null && (
                    <FilterTag
                        label={`Min: ${filters.minRating}★`}
                        onRemove={onRemoveMinRating}
                    />
                )}

                {/* Max Rating Tag */}
                {filters.maxRating !== null && (
                    <FilterTag
                        label={`Max: ${filters.maxRating}★`}
                        onRemove={onRemoveMaxRating}
                    />
                )}
            </div>
        </div>
    );
});

export default ActiveFilters;