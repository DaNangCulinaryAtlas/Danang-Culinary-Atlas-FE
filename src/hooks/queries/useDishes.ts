import { useQuery } from '@tanstack/react-query';
import { getDishList } from '@/services/dish';
import type { DishListParams } from '@/types/dish';

export const useDishes = (params?: DishListParams) => {
    return useQuery({
        queryKey: ['dishes', params],
        queryFn: () => getDishList(params),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
