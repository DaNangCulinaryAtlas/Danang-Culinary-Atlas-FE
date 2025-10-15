"use client";
import { Heart, MapPin, Search, SlidersHorizontal, Star } from 'lucide-react';
import React, { useState } from 'react';
import RestaurantMap from './components/RestaurantMap';

interface Restaurant {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  rating: number;
  address: string;
  isFavorite: boolean;
  lat: number;
  lng: number;
}

const RestaurantMapSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('Grilled Meat');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  const restaurants: Restaurant[] = [
    {
      id: 1,
      name: 'Machirento',
      category: 'Grill Meat',
      price: 20,
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
      rating: 4.8,
      address: '20 Hồ Huỳ Tập',
      isFavorite: true,
      lat: 16.0544,
      lng: 108.2022
    },
    {
      id: 2,
      name: 'Machirento',
      category: 'Grill Meat',
      price: 20,
      image: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400&h=300&fit=crop',
      rating: 4.8,
      address: '20 Hà Huy Tập',
      isFavorite: true,
      lat: 16.0644,
      lng: 108.2122
    },
    {
      id: 3,
      name: 'Machirento',
      category: 'Grill Meat',
      price: 20,
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
      rating: 4.8,
      address: '20 Hà Huy Tập',
      isFavorite: true,
      lat: 16.0444,
      lng: 108.1922
    },
    {
      id: 4,
      name: 'Machirento',
      category: 'Grill Meat',
      price: 20,
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
      rating: 4.8,
      address: '20 Hà Huy Tập',
      isFavorite: true,
      lat: 16.0744,
      lng: 108.2222
    },
    {
      id: 5,
      name: 'Machirento',
      category: 'Grill Meat',
      price: 20,
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
      rating: 4.8,
      address: '20 Hà Huy Tập',
      isFavorite: true,
      lat: 16.0344,
      lng: 108.1822
    },
    {
      id: 6,
      name: 'Machirento',
      category: 'Grill Meat',
      price: 20,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
      rating: 4.8,
      address: '20 Hồ Huỳ Tập',
      isFavorite: true,
      lat: 16.0844,
      lng: 108.2322
    }
  ];

  const toggleFavorite = (id: number) => {
    // Handle favorite toggle
    console.log('Toggle favorite:', id);
  };

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
              <div
                key={restaurant.id}
                className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedRestaurant(restaurant)}
              >
                {/* Image */}
                <div className="relative h-40 sm:h-48 overflow-hidden">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(restaurant.id);
                    }}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
                  >
                    <Heart
                      size={18}
                      className={restaurant.isFavorite ? 'fill-cyan-500 text-cyan-500' : 'text-gray-400'}
                    />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">{restaurant.category}</p>
                      <h3 className="font-semibold text-gray-800">{restaurant.name}</h3>
                    </div>
                    <span className="text-lg font-bold text-gray-800">${restaurant.price}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <MapPin size={14} className="mr-1 text-cyan-500" />
                      <span className="text-xs">{restaurant.address}</span>
                    </div>
                    <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
                      <Star size={14} className="fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="font-semibold text-gray-700">{restaurant.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Map */}
      <div className="block w-3/5 relative">
         <RestaurantMap 
           restaurants={restaurants} 
           selectedRestaurant={selectedRestaurant} 
           onSelectRestaurant={setSelectedRestaurant} 
         />
      </div>
    </div>
  );
};

export default RestaurantMapSearch;