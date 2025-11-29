import { useQuery } from '@tanstack/react-query';
import { getRestaurantsForMap } from '@/services/restaurant';
import { getRestaurantsForMapParams, MapRestaurant } from '@/types/restaurant/index';

interface UseRestaurantsForMapParams extends getRestaurantsForMapParams {
  enabled?: boolean;
}

// Validation functions
const isValidLatitude = (lat: number): boolean => !isNaN(lat) && lat >= -90 && lat <= 90;
const isValidLongitude = (lng: number): boolean => !isNaN(lng) && lng >= -180 && lng <= 180;

export const useRestaurantsForMap = (params: UseRestaurantsForMapParams) => {
  const { enabled = true, ...queryParams } = params;

  return useQuery({
    queryKey: [
      'restaurants-for-map',
      queryParams.zoomLevel,
      queryParams.minLat,
      queryParams.maxLat,
      queryParams.minLng,
      queryParams.maxLng,
    ],
    queryFn: async (): Promise<MapRestaurant[]> => {
      const response = await getRestaurantsForMap(queryParams);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch restaurants');
      }

      // Handle both array response and object with data property
      const data = Array.isArray(response.data) ? response.data : response.data?.data || [];
      
      // Map API response to MapRestaurant type with validation
      return data
        .map((item: any) => {
          const latitude = parseFloat(item.latitude);
          const longitude = parseFloat(item.longitude);
          
          return {
            restaurantId: item.restaurantId,
            name: item.name,
            address: item.address,
            photo: item.photo,
            wardId: item.wardId,
            latitude: isValidLatitude(latitude) ? latitude : null,
            longitude: isValidLongitude(longitude) ? longitude : null,
            averageRating: item.averageRating,
            totalReviews: item.totalReviews,
          };
        })
        .filter((restaurant): restaurant is MapRestaurant => 
          restaurant.latitude !== null && restaurant.longitude !== null
        );
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 1,
  });
};
