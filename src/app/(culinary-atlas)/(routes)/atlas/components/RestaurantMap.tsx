"use client";
import React, { useCallback, useEffect, useRef } from 'react';
import Map, { NavigationControl, MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MAP_STYLES } from '@/styles/map-styles';
import RestaurantMarker from './RestaurantMarker';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { getRestaurantsForMapAsync } from '@/stores/atlas/action';
import { setMapBounds, setViewState, syncSearchResultsToMap } from '@/stores/atlas';
import type { ViewStateChangeEvent } from 'react-map-gl/maplibre';

const RestaurantMap: React.FC = () => {
  const dispatch = useAppDispatch();
  const mapRef = useRef<MapRef>(null);
  const { restaurants, loading, viewState } = useAppSelector((state) => state.atlas);
  const { restaurants: searchResults, searchQuery } = useAppSelector((state) => state.restaurant);

  // Debounce timer ref to prevent too many API calls
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Function to fit map bounds to show all restaurants
  const fitMapToRestaurants = useCallback((restaurantList: typeof restaurants) => {
    if (!mapRef.current || restaurantList.length === 0) return;

    const map = mapRef.current;

    // Calculate bounds to fit all restaurants
    const lats = restaurantList.map(r => r.latitude);
    const lngs = restaurantList.map(r => r.longitude);

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
      // Update map markers with search results
      dispatch(syncSearchResultsToMap(searchResults));

      // Fit map to show all search results
      fitMapToRestaurants(searchResults);
    }
  }, [searchQuery, searchResults, dispatch, fitMapToRestaurants]);

  // Function to fetch restaurants based on current map bounds
  const fetchRestaurantsByBounds = useCallback(() => {
    // Don't fetch by bounds if user is searching
    if (searchQuery) return;

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
  }, [dispatch, searchQuery]);

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

    // Only fetch by bounds if not searching
    if (!searchQuery) {
      debouncedFetch();
    }
  }, [dispatch, debouncedFetch, searchQuery]);

  // Load initial restaurants when map is loaded
  useEffect(() => {
    if (mapRef.current && !searchQuery) {
      fetchRestaurantsByBounds();
    }
  }, [fetchRestaurantsByBounds, searchQuery]);

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