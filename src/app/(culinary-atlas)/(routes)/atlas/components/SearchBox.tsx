import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useSearchRestaurantsByName, useRestaurants } from '@/hooks/queries/useRestaurants';
import { useQueryClient } from '@tanstack/react-query';

interface SearchBoxProps {
  onSearchChange?: (data: any) => void;
}

export default function SearchBox({ onSearchChange }: SearchBoxProps) {
  const [searchInput, setSearchInput] = useState('');
  const queryClient = useQueryClient();

  // Query for search by name
  const { data: searchData } = useSearchRestaurantsByName(
    searchInput,
    { page: 0, size: 20, sortBy: 'createdAt', sortDirection: 'desc' },
    !!searchInput.trim()
  );

  // Query for fetching all restaurants when search is empty
  const { data: allRestaurantsData } = useRestaurants(
    { page: 0, size: 20 }
  );

  // Debounce search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchInput.trim()) {
        // Search data is already being fetched by the hook
        onSearchChange?.(searchData);
      } else {
        // Show all restaurants when search is empty
        onSearchChange?.(allRestaurantsData);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchInput, searchData, allRestaurantsData, onSearchChange]);

  return (
    <div className="relative mb-4">
      <Input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search restaurants..."
        className="w-full px-4 py-6 pr-12 border border-gray-200 rounded-xl"
      />
      <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
    </div>
  );
}