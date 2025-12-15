import { useQuery } from '@tanstack/react-query';
import { getAdminOverview } from '@/services/admin';

/**
 * Hook để lấy dữ liệu tổng quan Admin Dashboard
 * 
 * @returns Query result với data, isLoading, error
 * 
 * Config:
 * - staleTime: 5 phút - Thời gian data được coi là "fresh" (mới). 
 *   Trong khoảng này, React Query sẽ dùng cache thay vì gọi API lại.
 *   Admin dashboard cần data cập nhật nhưng không cần realtime.
 * 
 * - refetchOnWindowFocus: true - Tự động fetch lại data khi user 
 *   quay lại tab/window. Đảm bảo admin luôn thấy số liệu mới nhất 
 *   khi chuyển tab về.
 */
export const useAdminOverview = () => {
    return useQuery({
        queryKey: ['admin', 'overview'],
        queryFn: getAdminOverview,
        staleTime: 5 * 60 * 1000, // 5 phút
        refetchOnWindowFocus: true, // Override default (false) của project
    });
};
