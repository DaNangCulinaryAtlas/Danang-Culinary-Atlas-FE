"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Map, { NavigationControl, MapRef, Source, Layer, Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MAP_STYLES } from '@/styles/map-styles';
import RestaurantMarker from './RestaurantMarker';
import DirectionsPanel from './DirectionsPanel';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { setViewState } from '@/stores/atlas';
import { useRestaurantsForMap } from '@/hooks/queries/useRestaurantsForMap';
import type { MapRestaurant, Restaurant } from '@/types/restaurant';
import type { ViewStateChangeEvent } from 'react-map-gl/maplibre';
import { getDirectionsOSRM, type RouteResponse } from '@/services/directions';
import { MapPin } from 'lucide-react';
import { toast } from 'react-hot-toast';
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
  const { viewState, searchQuery, searchResults } = useAppSelector((state) => state.atlas);

  // Map bounds state for TanStack Query
  const [mapBounds, setMapBounds] = useState({
    zoomLevel: 16,
    minLat: 16.05436760477849,
    maxLat: 16.069721958688916,
    minLng: 108.21832403109659,
    maxLng: 108.23373468121076,
  });

  // Debounce timer ref to prevent too many API calls
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Directions state
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [routeData, setRouteData] = useState<RouteResponse | null>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [selectedRestaurantForDirections, setSelectedRestaurantForDirections] = useState<MapRestaurant | null>(null);

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

    // For single restaurant, center and zoom in close
    if (validRestaurants.length === 1) {
      const restaurant = validRestaurants[0];
      map.flyTo({
        center: [parseFloat(restaurant.longitude as any), parseFloat(restaurant.latitude as any)],
        zoom: 17,
        duration: 1500,
        essential: true
      });
      return;
    }

    // Calculate bounds to fit all restaurants
    const lats = validRestaurants.map(r => parseFloat(r.latitude as any));
    const lngs = validRestaurants.map(r => parseFloat(r.longitude as any));

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    // Adjust padding and maxZoom based on number of restaurants
    const padding = validRestaurants.length <= 3 ? 100 : 80;
    const maxZoom = validRestaurants.length <= 3 ? 16 : 15;

    map.fitBounds(
      [
        [minLng, minLat],
        [maxLng, maxLat]
      ],
      {
        padding,
        duration: 1500,
        maxZoom
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

  // Get user's current location
  const getUserLocation = useCallback(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setUserLocation([longitude, latitude]);
        },
        (error) => {
          console.log('Error getting user location:', error);
          toast.error('Không thể lấy vị trí của bạn. Vui lòng cho phép truy cập vị trí.', {
            position: 'top-right',
            duration: 2500,
          });
        }
      );
    } else {
      toast.error('Trình duyệt của bạn không hỗ trợ định vị.', {
        position: 'top-right',
        duration: 2500,
      });
    }
  }, []);

  // Get directions to restaurant
  const getDirectionsToRestaurant = useCallback(async (restaurant: MapRestaurant) => {
    // Get user location first if not available
    if (!userLocation) {
      getUserLocation();
      // Wait a bit for location to be set
      setTimeout(() => {
        if (userLocation) {
          getDirectionsToRestaurant(restaurant);
        }
      }, 1000);
      return;
    }

    setIsLoadingRoute(true);
    setSelectedRestaurantForDirections(restaurant);

    try {
      const route = await getDirectionsOSRM(
        userLocation[0],
        userLocation[1],
        restaurant.longitude,
        restaurant.latitude
      );

      setRouteData(route);

      // Fit map to show entire route
      if (mapRef.current) {
        const allCoords = [userLocation, ...route.coordinates];
        const lngs = allCoords.map(c => c[0]);
        const lats = allCoords.map(c => c[1]);

        mapRef.current.fitBounds(
          [
            [Math.min(...lngs), Math.min(...lats)],
            [Math.max(...lngs), Math.max(...lats)]
          ],
          {
            padding: 100,
            duration: 1000
          }
        );
      }
    } catch (error) {
      console.error('Error getting directions:', error);
      alert('Không thể tìm đường đi. Vui lòng thử lại.');
    } finally {
      setIsLoadingRoute(false);
    }
  }, [userLocation, getUserLocation]);

  // Clear directions
  const clearDirections = useCallback(() => {
    setRouteData(null);
    setSelectedRestaurantForDirections(null);
  }, []);

  // Expose getDirections function to children via context or callback
  useEffect(() => {
    // Store function in window for access from markers
    (window as any).getDirectionsToRestaurant = getDirectionsToRestaurant;
    return () => {
      delete (window as any).getDirectionsToRestaurant;
    };
  }, [getDirectionsToRestaurant]);

  // Request user location on mount
  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  // Route layer style
  const routeLayerStyle = {
    id: 'route',
    type: 'line' as const,
    paint: {
      'line-color': '#3b82f6',
      'line-width': 5,
      'line-opacity': 0.8
    }
  };

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

        {/* Route Line */}
        {routeData && (
          <Source
            id="route"
            type="geojson"
            data={{
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: routeData.coordinates
              }
            }}
          >
            <Layer {...routeLayerStyle} />
          </Source>
        )}

        {/* User Location Marker */}
        {userLocation && routeData && (
          <Marker
            longitude={userLocation[0]}
            latitude={userLocation[1]}
            anchor="bottom"
          >
            <div className="flex flex-col items-center">
              <div className="bg-blue-600 text-white p-2 rounded-full shadow-lg border-4 border-white">
                <MapPin className="w-6 h-6" fill="white" />
              </div>
              <div className="mt-1 bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold shadow-md">
                Vị trí của bạn
              </div>
            </div>
          </Marker>
        )}

        {/* Destination Restaurant Marker */}
        {selectedRestaurantForDirections && routeData && (
          <Marker
            longitude={selectedRestaurantForDirections.longitude}
            latitude={selectedRestaurantForDirections.latitude}
            anchor="bottom"
          >
            <div className="flex flex-col items-center">
              <div className="bg-red-600 text-white p-2 rounded-full shadow-lg border-4 border-white animate-bounce">
                <MapPin className="w-6 h-6" fill="white" />
              </div>
              <div className="mt-1 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold shadow-md max-w-[150px] truncate">
                {selectedRestaurantForDirections.name}
              </div>
            </div>
          </Marker>
        )}

        {/* Restaurant Markers - Hide when showing directions */}
        {!routeData && restaurants?.filter(isValidRestaurant).map((restaurant) => (
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

      {/* Directions Info Panel */}
      {routeData && selectedRestaurantForDirections && (
        <DirectionsPanel
          routeData={routeData}
          selectedRestaurant={selectedRestaurantForDirections}
          onClose={clearDirections}
        />
      )}

      {/* Loading route indicator */}
      {isLoadingRoute && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-700">Đang tìm đường...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantMap;