// Types
interface FilterState {
  cuisineIds: number[]; // Changed to array to support multiple selection
  minRating: number | null;
  maxRating: number | null;
}

interface CuisineTag {
  tagId: number;
  name: string;
}

interface FilterSideBarProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
}

interface FilterOption {
  label: string;
  value: string;
  count: number;
}

export type { FilterState, FilterSideBarProps, FilterOption };