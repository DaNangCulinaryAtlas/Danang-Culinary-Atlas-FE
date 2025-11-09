import { memo, useCallback } from "react";
import { FilterOption } from "@/types/filter";
import { cuisineTypes } from "@/lib/mock/cuisineTypes";

// Convert cuisine types to FilterOption format
const CUISINE_OPTIONS: FilterOption[] = cuisineTypes.map((type) => ({
    label: type,
    value: type,
    count: 0 // Count will be updated dynamically from API if needed
}));

interface CuisineFilterProps {
    selectedCuisines: string[];
    onChange: (cuisines: string[]) => void;
}

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
                {option.label} 
            </span>
        </label>
    );
});

const CuisineFilter = memo(function CuisineFilter({
    selectedCuisines,
    onChange,
}: CuisineFilterProps) {
    const handleToggle = useCallback((value: string) => {
        const newValues = selectedCuisines.includes(value)
            ? selectedCuisines.filter(v => v !== value)
            : [...selectedCuisines, value];
        onChange(newValues);
    }, [selectedCuisines, onChange]);

    return (
        <div className="space-y-3">
            <h3 className="font-semibold text-gray-800 text-base">Cuisine/Food Type</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {CUISINE_OPTIONS.map((option) => (
                    <FilterCheckbox
                        key={option.value}
                        option={option}
                        checked={selectedCuisines.includes(option.value)}
                        onToggle={() => handleToggle(option.value)}
                    />
                ))}
            </div>
        </div>
    );
});

export default CuisineFilter;