// API Response Types
export interface DishApiResponse {
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

export interface DishListResponse {
  content: DishApiResponse[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      empty: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface DishListParams {
  page?: number;
  size?: number;
  tagId?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'name' | 'price' | 'createdAt' | 'approvedAt';
  sortOrder?: 'asc' | 'desc';
  sortDirection?: 'asc' | 'desc';
}

// Create Dish Request
export interface CreateDishRequest {
  restaurantId: string;
  name: string;
  images: string[];
  description: string;
  price: number;
  status: 'AVAILABLE' | 'OUT_OF_STOCK';
}

// Update Dish Request
export interface UpdateDishRequest {
  name: string;
  images: string[];
  description: string;
  price: number;
  status: 'AVAILABLE' | 'OUT_OF_STOCK';
}

// Dish Approval Request
export interface DishApprovalRequest {
  approvalStatus: 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
}

// Update Dish Status Request
export interface UpdateDishStatusRequest {
  status: 'AVAILABLE' | 'OUT_OF_STOCK';
}

// Legacy type for UI components
interface Dish {
  image: string;
  title: string;
  description: string;
  rating: number;
  reviewCount: number;
  price: number;
}

export type { Dish };