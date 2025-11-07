"use client";
import React from 'react';
import RestaurantMap from './components/RestaurantMap';
import RestaurantList from './components/RestaurantList';

const RestaurantMapSearch: React.FC = () => {
  return (
    <div className="flex h-screen p-6 gap-6">
      {/* Left Panel - Search and Results */}
      <div className="w-full lg:w-2/5">
        <RestaurantList/>
      </div>

      {/* Right Panel - Map */}
      <div className="w-3/5 rounded-2xl overflow-hidden shadow-lg">
        <RestaurantMap />
      </div>
    </div>
  );
};

export default RestaurantMapSearch;