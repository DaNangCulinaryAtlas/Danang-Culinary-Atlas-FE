"use client";
import { SlidersHorizontal } from 'lucide-react';
import React, { useEffect } from 'react';
import RestaurantMapCard from '@/components/restaurants/RestaurantMapCard';
import { useRouter } from 'next/navigation';
import type { Restaurant } from '@/types/restaurant';
import { Button } from '@/components/ui/button';
import SearchBox from './SearchBox';
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { getRestaurantsAsync } from '@/stores/restaurant/action';

export default function RestaurantList (){
  const dispatch = useAppDispatch();

  // Fetch restaurants from store
  const {
    restaurants,
    loading,
    error,
    totalPages,
    totalElements
  } = useAppSelector((state) => state.restaurant);
  useEffect(() => {
    if (!restaurants || restaurants.length === 0) {
      dispatch(getRestaurantsAsync({ page: 0, size: 20 }));
    }
  }, [dispatch, restaurants]);

  const router = useRouter();  
  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-lg h-full">
      {/* Search Header */}
      <div className="p-4 sm:p-6 border-b">
        <SearchBox />   
        <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
                {restaurants.length} restaurants found
            </h2>
            <Button variant="ghost" className="p-3 hover:bg-gray-100 rounded-lg transition-colors">
                <SlidersHorizontal size={20} className="text-gray-600" />
            </Button>
        </div>
      </div>

      {/* Restaurant Cards */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {restaurants.map((restaurant) => (
            <RestaurantMapCard 
              key={restaurant.restaurantId} 
              restaurant={restaurant}
              onClick={() => router.push(`/restaurants/${restaurant.restaurantId}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
