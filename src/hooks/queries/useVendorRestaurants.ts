import { useQuery } from '@tanstack/react-query';
import { getAllVendorRestaurants, VendorRestaurantItem } from '@/services/vendor';
import { Restaurant } from '../../app/vendor/restaurants/types';

interface UseVendorRestaurantsParams {
  vendorId: string | null;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// Transform API response to Restaurant type
const transformRestaurant = (item: VendorRestaurantItem): Restaurant => ({
  id: item.restaurantId,
  ownerAccountId: item.ownerAccountId,
  name: item.name ?? 'Không xác định',
  address: item.address ?? 'N/A',
  status: (item.status || '').toUpperCase(),
  approvalStatus: (item.approvalStatus || '').toUpperCase(),
  createdAt: item.createdAt,
  image: item.images?.photo || null,
  subPhotos: Array.isArray(item.images?.sub_photo) ? item.images.sub_photo : [],
  latitude: item.latitude ?? null,
  longitude: item.longitude ?? null,
  averageRating: item.averageRating ?? null,
  totalReviews: item.totalReviews ?? null,
  wardId: item.wardId ?? null,
  rejectionReason: item.rejectionReason ?? null,
  openingHours: item.openingHours ?? {},
  tags: item.tags ?? null,
});

export function useVendorRestaurants({
  vendorId,
  sortBy = 'createdAt',
  sortDirection = 'desc'
}: UseVendorRestaurantsParams) {
  const query = useQuery({
    queryKey: ['vendorRestaurants', vendorId, sortBy, sortDirection],
    queryFn: async () => {
      if (!vendorId) {
        return [];
      }
      const response = await getAllVendorRestaurants(vendorId, sortBy, sortDirection);
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch vendor restaurants');
      }
      return response.data.map(transformRestaurant);
    },
    enabled: !!vendorId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    restaurants: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error?.message || null,
    refetch: query.refetch,
  };
}
