import { memo, useCallback } from "react";
import { CUISINE_TAGS } from "@/constants/cuisineTags";

interface CuisineFilterProps {
    selectedCuisineIds: number[];
    onChange: (cuisineIds: number[]) => void;
}

interface FilterCheckboxProps {
    tagId: number;
    name: string;
    checked: boolean;
    onToggle: () => void;
}

const FilterCheckbox = memo(function FilterCheckbox({
    tagId,
    name,
    checked,
    onToggle,
}: FilterCheckboxProps) {
    return (
        <label className="flex items-center gap-2 cursor-pointer group">
            <input
                type="checkbox"
                checked={checked}
                onChange={onToggle}
                className="w-4 h-4 border-gray-300 text-[#44BACA] focus:ring-[#44BACA] focus:ring-offset-0 cursor-pointer transition rounded"
            />
            <span className="text-sm text-gray-700 group-hover:text-gray-900 transition select-none">
                {name}
            </span>
        </label>
    );
});

const CuisineFilter = memo(function CuisineFilter({
    selectedCuisineIds,
    onChange,
}: CuisineFilterProps) {
    const handleToggle = useCallback((tagId: number) => {
        if (selectedCuisineIds.includes(tagId)) {
            // Remove tagId from array
            onChange(selectedCuisineIds.filter(id => id !== tagId));
        } else {
            // Add tagId to array
            onChange([...selectedCuisineIds, tagId]);
        }
    }, [selectedCuisineIds, onChange]);

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800 text-base">Loại Ẩm Thực</h3>
                {selectedCuisineIds.length > 0 && (
                    <button
                        onClick={() => onChange([])}
                        className="text-xs text-[#44BACA] hover:text-[#3aa3b3] font-medium"
                    >
                        Xóa bộ lọc
                    </button>
                )}
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {CUISINE_TAGS.map((tag) => (
                    <FilterCheckbox
                        key={tag.tagId}
                        tagId={tag.tagId}
                        name={tag.name}
                        checked={selectedCuisineIds.includes(tag.tagId)}
                        onToggle={() => handleToggle(tag.tagId)}
                    />
                ))}
            </div>
        </div>
    );
});

export default CuisineFilter;