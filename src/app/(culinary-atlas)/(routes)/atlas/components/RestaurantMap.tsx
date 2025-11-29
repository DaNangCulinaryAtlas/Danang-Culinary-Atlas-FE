"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Map, { NavigationControl, MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MAP_STYLES } from '@/styles/map-styles';
import RestaurantMarker from './RestaurantMarker';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { setViewState } from '@/stores/atlas';
import { useRestaurantsForMap } from '@/hooks/queries/useRestaurantsForMap';
import type { MapRestaurant, Restaurant } from '@/types/restaurant';
import type { ViewStateChangeEvent } from 'react-map-gl/maplibre';

// Validation helpers
const isValidLatitude = (lat: any): boolean => {
  const num = parseFloat(lat);
  return !isNaN(num) && num >= -90 && num <= 90;
};

const isValidLongitude = (lng: any): boolean => {
  const num = parseFloat(lng);
  return !isNaN(num) && num >= -180 && num <= 180;
};

const isValidRestaurant = (restaurant: any): boolean => {
  return (
    restaurant &&
    restaurant.restaurantId &&
    isValidLatitude(restaurant.latitude) &&
    isValidLongitude(restaurant.longitude)
  );
};

// Convert Restaurant (from search) to MapRestaurant (for map rendering)
const restaurantToMapRestaurant = (restaurant: Restaurant): MapRestaurant => {
  return {
    restaurantId: restaurant.restaurantId,
    name: restaurant.name,
    address: restaurant.address,
    photo: restaurant.images?.photo || '',
    wardId: restaurant.wardId,
    latitude: restaurant.latitude,
    longitude: restaurant.longitude,
    averageRating: restaurant.averageRating,
    totalReviews: restaurant.totalReviews,
  };
};

const RestaurantMap: React.FC = () => {
  const mapRef = useRef<MapRef>(null);
  const dispatch = useAppDispatch();
  const { viewState } = useAppSelector((state) => state.atlas);
  const { restaurants: searchResults, searchQuery } = useAppSelector((state) => state.restaurant);

  // Map bounds state for TanStack Query
  const [mapBounds, setMapBounds] = useState({
    zoomLevel: 15,
    minLat: 16.0228683164663,
    maxLat: 16.085970325587937,
    minLng: 108.17567930024103,
    maxLng: 108.22859051574727,
  });

  // Debounce timer ref to prevent too many API calls
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Determine if we should fetch from map bounds or use search results
  const shouldFetchFromBounds = !searchQuery;

  // Use TanStack Query for restaurants from map bounds
  const { data: mapRestaurants = [], isLoading, isFetching } = useRestaurantsForMap({
    ...mapBounds,
    enabled: shouldFetchFromBounds,
  });

  // Display either search results or map restaurants (cast to MapRestaurant for rendering)
  const restaurants: MapRestaurant[] = searchQuery 
    ? searchResults.map(restaurantToMapRestaurant)
    : mapRestaurants;
  const loading = isLoading || isFetching;

  // Function to fit map bounds to show all restaurants
  const fitMapToRestaurants = useCallback((restaurantList: typeof restaurants) => {
    if (!mapRef.current || restaurantList.length === 0) return;

    const map = mapRef.current;
    
    // Filter only valid restaurants
    const validRestaurants = restaurantList.filter(isValidRestaurant);
    if (validRestaurants.length === 0) return;

    // Calculate bounds to fit all restaurants
    const lats = validRestaurants.map(r => parseFloat(r.latitude as any));
    const lngs = validRestaurants.map(r => parseFloat(r.longitude as any));

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    // Add padding to bounds
    const padding = 50;

    map.fitBounds(
      [
        [minLng, minLat],
        [maxLng, maxLat]
      ],
      {
        padding,
        duration: 1000,
        maxZoom: 15
      }
    );
  }, []);

  // Sync search results to map when user searches
  useEffect(() => {
    if (searchQuery && searchResults.length > 0) {
      // Fit map to show all search results
      fitMapToRestaurants(searchResults.map(restaurantToMapRestaurant));
    }
  }, [searchQuery, searchResults, fitMapToRestaurants]);

  // Function to fetch restaurants based on current map bounds
  const updateMapBoundsFromMap = useCallback(() => {
    // Don't fetch by bounds if user is searching
    if (searchQuery) return;

    if (!mapRef.current) return;

    const map = mapRef.current.getMap();
    const bounds = map.getBounds();
    const zoom = map.getZoom();

    const newBounds = {
      zoomLevel: Math.round(zoom),
      minLat: bounds.getSouth(),
      maxLat: bounds.getNorth(),
      minLng: bounds.getWest(),
      maxLng: bounds.getEast(),
    };

    // Update local state to trigger TanStack Query
    setMapBounds(newBounds);
  }, [searchQuery]);

  // Debounced fetch to avoid too many API calls during pan/zoom
  const debouncedUpdate = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      updateMapBoundsFromMap();
    }, 500); // 500ms debounce delay
  }, [updateMapBoundsFromMap]);

  // Handle map move (pan/zoom)
  const handleMoveEnd = useCallback((evt: ViewStateChangeEvent) => {
    const { longitude, latitude, zoom } = evt.viewState;

    // Update view state in Redux
    dispatch(setViewState({ longitude, latitude, zoom }));

    // Only fetch by bounds if not searching
    if (!searchQuery) {
      debouncedUpdate();
    }
  }, [dispatch, debouncedUpdate, searchQuery]);

  // Load initial restaurants when map is loaded
  useEffect(() => {
    if (mapRef.current && !searchQuery) {
      updateMapBoundsFromMap();
    }
  }, []); // Only run on mount

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
      {loading && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-700">Loading restaurants...</span>
          </div>
        </div>
      )}

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
        {restaurants?.filter(isValidRestaurant).map((restaurant) => (
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
            {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''} {searchQuery ? 'found' : 'in view'}
          </span>
        </div>
      )}

      {/* No restaurants message */}
      {!loading && restaurants.length === 0 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-lg">
          <span className="text-sm text-gray-500">
            {searchQuery ? 'No restaurants match your search' : 'No restaurants found in this area'}
          </span>
        </div>
      )}
    </div>
  );
};

export default RestaurantMap;