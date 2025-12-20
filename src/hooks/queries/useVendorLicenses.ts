import { useQuery } from '@tanstack/react-query';
import { getMyLicenses } from '@/services/license';

export const useVendorLicenses = () => {
    return useQuery({
        queryKey: ['vendor-licenses'],
        queryFn: getMyLicenses,
    });
};
