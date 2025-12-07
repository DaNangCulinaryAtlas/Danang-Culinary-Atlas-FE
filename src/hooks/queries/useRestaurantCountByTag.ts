import { useQuery } from '@tanstack/react-query';
import { getRestaurantCountByTag } from '@/services/admin';

/**
 * Hook để lấy số lượng quán ăn theo tag cho biểu đồ phân bố
 * 
 * @returns Query result với data, isLoading, error
 * 
 * Config:
 * - staleTime: 10 phút - Data thống kê ít thay đổi
 * - refetchOnWindowFocus: false - Không cần refetch khi focus
 */
export const useRestaurantCountByTag = () => {
    return useQuery({
        queryKey: ['admin', 'restaurant-count-by-tag'],
        queryFn: getRestaurantCountByTag,
        staleTime: 10 * 60 * 1000, // 10 phút
        refetchOnWindowFocus: false,
    });
};
