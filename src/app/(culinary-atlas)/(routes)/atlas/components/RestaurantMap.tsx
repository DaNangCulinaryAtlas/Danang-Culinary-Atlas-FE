"use client";
import React, { useCallback, useEffect, useRef } from 'react';
import Map, { NavigationControl, MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MAP_STYLES } from '@/styles/map-styles';
import RestaurantMarker from './RestaurantMarker';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { getRestaurantsForMapAsync } from '@/stores/atlas/action';
import { setMapBounds, setViewState } from '@/stores/atlas';
import type { ViewStateChangeEvent } from 'react-map-gl/maplibre';

const RestaurantMap: React.FC = () => {
  const dispatch = useAppDispatch();
  const mapRef = useRef<MapRef>(null);
  const { restaurants, loading, viewState } = useAppSelector((state) => state.atlas);

  // Debounce timer ref to prevent too many API calls
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Function to fetch restaurants based on current map bounds
  const fetchRestaurantsByBounds = useCallback(() => {
    if (!mapRef.current) return;

    const map = mapRef.current.getMap();
    const bounds = map.getBounds();
    const zoom = map.getZoom();

    const mapBounds = {
      minLat: bounds.getSouth(),
      maxLat: bounds.getNorth(),
      minLng: bounds.getWest(),
      maxLng: bounds.getEast(),
    };

    // Update bounds in Redux store
    dispatch(setMapBounds(mapBounds));

    // Fetch restaurants with current bounds and zoom level
    dispatch(getRestaurantsForMapAsync({
      zoomLevel: Math.round(zoom),
      minLat: mapBounds.minLat,
      maxLat: mapBounds.maxLat,
      minLng: mapBounds.minLng,
      maxLng: mapBounds.maxLng,
    }));
  }, [dispatch]);

  // Debounced fetch to avoid too many API calls during pan/zoom
  const debouncedFetch = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchRestaurantsByBounds();
    }, 500); // 500ms debounce delay
  }, [fetchRestaurantsByBounds]);

  // Handle map move (pan/zoom)
  const handleMoveEnd = useCallback((evt: ViewStateChangeEvent) => {
    const { longitude, latitude, zoom } = evt.viewState;

    // Update view state in Redux
    dispatch(setViewState({ longitude, latitude, zoom }));

    // Fetch restaurants for new bounds
    debouncedFetch();
  }, [dispatch, debouncedFetch]);

  // Load initial restaurants when map is loaded
  useEffect(() => {
    if (mapRef.current) {
      fetchRestaurantsByBounds();
    }
  }, [fetchRestaurantsByBounds]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full h-full relative">
      {/* Loading indicator */}
      {/* {loading && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-700">Loading restaurants...</span>
          </div>
        </div>
      )} */}

      <Map
        ref={mapRef}
        initialViewState={viewState}
        onMoveEnd={handleMoveEnd}
        style={{ width: '100%', height: '100%' }}
        mapStyle={MAP_STYLES.positron}
      >
        {/* Navigation Controls (Zoom +/-) */}
        <NavigationControl position="top-right" />

        {/* Restaurant Markers */}
        {restaurants?.map((restaurant) => (
          <RestaurantMarker
            key={restaurant.restaurantId}
            restaurant={restaurant}
          />
        ))}
      </Map>

      {/* Restaurant count indicator */}
      {!loading && restaurants.length > 0 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-lg">
          <span className="text-sm text-gray-700">
            {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''} found
          </span>
        </div>
      )}

      {/* No restaurants message */}
      {!loading && restaurants.length === 0 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-lg">
          <span className="text-sm text-gray-500">
            No restaurants found in this area
          </span>
        </div>
      )}
    </div>
  );
};

export default RestaurantMap;