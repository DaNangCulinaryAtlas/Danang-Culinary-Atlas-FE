import { useQuery } from '@tanstack/react-query';
import { searchRestaurantsByDish } from '@/services/restaurant';

interface UseRestaurantsByDishParams {
  dishName: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  enabled?: boolean;
}

export const useRestaurantsByDish = ({
  dishName,
  page = 0,
  size = 20,
  sortBy = 'createdAt',
  sortDirection = 'desc',
  enabled = true
}: UseRestaurantsByDishParams) => {
  return useQuery({
    queryKey: ['restaurants-by-dish', dishName, page, size, sortBy, sortDirection],
    queryFn: () => searchRestaurantsByDish({
      dishName,
      page,
      size,
      sortBy,
      sortDirection
    }),
    enabled: enabled && dishName.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
