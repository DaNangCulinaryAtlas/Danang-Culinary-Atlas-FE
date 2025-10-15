"use client";
import React, { useState } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl/maplibre';
import { MapPin, Star, X } from 'lucide-react';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Restaurant } from '@/types/restaurant';
import { MAP_STYLES } from '@/styles/map-styles';


interface RestaurantMapProps {
  restaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
  onSelectRestaurant: (restaurant: Restaurant | null) => void;
}

const RestaurantMap: React.FC<RestaurantMapProps> = ({
  restaurants,
  selectedRestaurant,
  onSelectRestaurant,
}) => {
      
  return (
    <div className="w-full h-full relative">
      <Map
        initialViewState={{
          longitude: 108.2022, // Đà Nẵng longitude
          latitude: 16.0544,   // Đà Nẵng latitude
          zoom: 13
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={MAP_STYLES.positron} // Thay đổi style ở đây
      >
        {/* Navigation Controls (Zoom +/-) */}
        <NavigationControl position="top-right" />

        {/* Restaurant Markers */}
        {restaurants?.map((restaurant) => (
          <Marker
            key={restaurant.id}
            longitude={restaurant.lng}
            latitude={restaurant.lat}
            anchor="center"
          >
            <div
              className="cursor-pointer transform hover:scale-110 transition-transform"
              onClick={() => onSelectRestaurant(restaurant)}
            >
              <div className="w-12 h-12 rounded-full border-4 border-white shadow-lg overflow-hidden hover:border-cyan-500 hover:shadow-xl">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </Marker>
        ))}

        {/* Selected Restaurant Popup */}
        {selectedRestaurant && (
          <Popup
            longitude={selectedRestaurant.lng}
            latitude={selectedRestaurant.lat}
            anchor="bottom"
            onClose={() => onSelectRestaurant(null)}
            closeButton={false}
            offset={25}
          >
            <div className="w-80 bg-white rounded-xl shadow-2xl overflow-hidden">
              <button
                onClick={() => onSelectRestaurant(null)}
                className="absolute top-3 right-3 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100 z-10"
              >
                <X size={16} className="text-gray-600" />
              </button>

              <div className="relative h-48 overflow-hidden">
                <img
                  src={selectedRestaurant.image}
                  alt={selectedRestaurant.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      {selectedRestaurant.category}
                    </p>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {selectedRestaurant.name}
                    </h3>
                  </div>
                  <span className="text-xl font-bold text-gray-800">
                    ${selectedRestaurant.price}
                  </span>
                </div>

                <div className="flex items-center text-gray-600 text-sm mb-3">
                  <MapPin size={14} className="mr-1 text-cyan-500" />
                  <span>{selectedRestaurant.address}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center bg-yellow-50 px-3 py-1.5 rounded-lg">
                    <Star
                      size={16}
                      className="fill-yellow-400 text-yellow-400 mr-1"
                    />
                    <span className="font-semibold text-gray-700">
                      {selectedRestaurant.rating}
                    </span>
                  </div>
                  <button className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors font-medium">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
};

export default RestaurantMap;