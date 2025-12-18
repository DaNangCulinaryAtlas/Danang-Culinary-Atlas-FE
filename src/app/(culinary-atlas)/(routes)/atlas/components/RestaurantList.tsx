"use client";
import { SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import RestaurantMapCard from '@/components/restaurants/RestaurantMapCard';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import SearchBox from './SearchBox';
import { useRestaurants } from '@/hooks/queries/useRestaurants';

export default function RestaurantList() {
  const router = useRouter();
  const [restaurantsData, setRestaurantsData] = useState<any>(null);

  // Fetch initial restaurants
  const { data: initialData, isLoading, error } = useRestaurants({
    page: 0,
    size: 20
  });

  // Use searched data if available, otherwise use initial data
  const data = restaurantsData || initialData;
  const restaurants = data?.content || [];
  const totalElements = data?.totalElements || 0;

  const handleSearchChange = (searchData: any) => {
    setRestaurantsData(searchData);
  };

  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-lg h-full">
      {/* Search Header */}
      <div className="p-4 sm:p-6 border-b">
        <SearchBox onSearchChange={handleSearchChange} />
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            {restaurants.length} restaurants found
          </h2>
        </div>
      </div>

      {/* Restaurant Cards */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {isLoading && !restaurants.length ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Loading restaurants...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-red-500">Failed to load restaurants</p>
          </div>
        ) : restaurants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {restaurants.map((restaurant: any) => (
              <RestaurantMapCard
                key={restaurant.restaurantId}
                restaurant={restaurant}
                onClick={() => router.push(`/restaurants/${restaurant.restaurantId}`)}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No restaurants found</p>
          </div>
        )}
      </div>
    </div>
  );
};
