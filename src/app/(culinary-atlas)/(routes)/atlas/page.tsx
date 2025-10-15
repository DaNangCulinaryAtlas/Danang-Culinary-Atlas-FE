"use client";
import { Heart, Link, MapPin, Search, SlidersHorizontal, Star } from 'lucide-react';
import React, { useState } from 'react';
import RestaurantMap from './components/RestaurantMap';
import RestaurantMapCard from '@/components/restaurants/RestaurantMapCard';
import { useRouter } from 'next/navigation';
import restaurants from '@/stores/mockRestaurants';
const RestaurantMapSearch: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('Grilled Meat');
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Panel - Search and Results */}
      <div className="w-full lg:w-2/5 flex flex-col bg-white overflow-hidden">
        {/* Search Header */}
        <div className="p-4 sm:p-6 border-b">
          <div className="relative mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search restaurants..."
              className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
          
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              {restaurants.length} restaurants found
            </h2>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <SlidersHorizontal size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Restaurant Cards */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {restaurants.map((restaurant) => (
              <RestaurantMapCard 
                key={restaurant.id} 
                restaurant={restaurant} 
                onClick={() => router.push(`/restaurants/${restaurant.id}`) }
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Map */}
      <div className="block w-3/5 relative">
         <RestaurantMap 
           restaurants={restaurants} 
         />
      </div>
    </div>
  );
};

export default RestaurantMapSearch;