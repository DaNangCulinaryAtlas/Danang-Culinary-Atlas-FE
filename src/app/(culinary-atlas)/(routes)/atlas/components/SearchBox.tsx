import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '@/hooks/useRedux';
import { searchRestaurantsByNameAsync, getRestaurantsAsync } from '@/stores/restaurant/action';
import { setSearchQuery } from '@/stores/restaurant';

export default function SearchBox() {
  const dispatch = useAppDispatch();
  const [searchInput, setSearchInput] = useState('');

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchInput.trim()) {
        // Update Redux state
        dispatch(setSearchQuery(searchInput));
        // Search by name
        dispatch(searchRestaurantsByNameAsync({
          name: searchInput,
          page: 0,
          size: 20,
          sortBy: 'createdAt',
          sortDirection: 'desc'
        }));
      } else {
        // If search is empty, fetch all restaurants
        dispatch(setSearchQuery(''));
        dispatch(getRestaurantsAsync({ page: 0, size: 20 }));
      }
    }, 500); // 500ms debounce delay

    return () => clearTimeout(timeoutId);
  }, [searchInput, dispatch]);

  return (
    <div className="relative mb-4">
      <Input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search restaurants..."
        className="w-full px-4 py-6 pr-12 border border-gray-200 rounded-xl "
      />
      <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
    </div>
  )
}