export interface VendorDish {
    dishId: string;
    restaurantId: string;
    name: string;
    images: string[];
    description: string;
    price: number;
    status: 'AVAILABLE' | 'UNAVAILABLE';
    approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
    approvedAt: string | null;
    rejectionReason: string | null;
}

export interface VendorRestaurantOption {
    id: string;
    name: string;
    address: string;
    image: string | null;
    approvalStatus: string;
}

export interface DishFormData {
    name: string;
    description: string;
    price: string;
    status: 'AVAILABLE' | 'OUT_OF_STOCK';
    restaurantId: string;
    images: string[];
}

export interface PaginationInfo {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
    first: boolean;
    last: boolean;
}
