import { useQuery } from '@tanstack/react-query';
import { getProvinces, getDistrictsByProvince, getWardsByDistrict } from '@/services/location';

export const useProvinces = () => {
    return useQuery({
        queryKey: ['provinces'],
        queryFn: async () => {
            const response = await getProvinces();
            if (!response.success) {
                throw new Error(response.message || 'Failed to fetch provinces');
            }
            return response.data || [];
        },
        staleTime: 1000 * 60 * 60, // 1 hour
    });
};

export const useDistricts = (provinceId: number | null) => {
    return useQuery({
        queryKey: ['districts', provinceId],
        queryFn: async () => {
            if (!provinceId) return [];
            const response = await getDistrictsByProvince(provinceId);
            if (!response.success) {
                throw new Error(response.message || 'Failed to fetch districts');
            }
            return response.data || [];
        },
        enabled: !!provinceId,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
};

export const useWards = (districtId: number | null) => {
    return useQuery({
        queryKey: ['wards', districtId],
        queryFn: async () => {
            if (!districtId) return [];
            const response = await getWardsByDistrict(districtId);
            if (!response.success) {
                throw new Error(response.message || 'Failed to fetch wards');
            }
            return response.data || [];
        },
        enabled: !!districtId,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
};
