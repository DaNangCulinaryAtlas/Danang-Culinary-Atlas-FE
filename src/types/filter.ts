// Types
interface FilterState {
  cuisineTypes: string[];
  minRating: number | null;
  maxRating: number | null;
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