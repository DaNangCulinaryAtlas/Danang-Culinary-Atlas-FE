"use client";
import React from 'react';
import Map, { NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Restaurant } from '@/types/restaurant';
import { MAP_STYLES } from '@/styles/map-styles';
import RestaurantMarker from './RestaurantMarker';


interface RestaurantMapProps {
  restaurants: Restaurant[];
}

const RestaurantMap: React.FC<RestaurantMapProps> = ({
  restaurants,
}) => {
      
  return (
    <div className="w-full h-full relative">
      <Map
        initialViewState={{
          longitude: 108.2022, // Danang longitude
          latitude: 16.0544,   // Danang latitude
          zoom: 13
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={MAP_STYLES.positron} // Change map style here
      >
        {/* Navigation Controls (Zoom +/-) */}
        <NavigationControl position="top-right" />

        {/* Restaurant Markers */}
        {restaurants?.map((restaurant) => (
          <RestaurantMarker restaurant= {restaurant}/>
        ))}
      </Map>
    </div>
  );
};

export default RestaurantMap;