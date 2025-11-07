export interface Restaurant {
  restaurantId: string;
  ownerAccountId: string;
  name: string;
  address: string;
  images: {
    photo: string;
    sub_photo: string[];
  };
  wardId: number;
  status: string;
  createdAt: string;
  approvalStatus: string;
  approvedByAccountId: string | null;
  approvedAt: string | null;
  rejectionReason: string | null;
  latitude: number;
  longitude: number;
  openingHours: {
    [key: string]: string;
  };
  averageRating: number;
  totalReviews: number;
}

export interface RestaurantResponse {
  content: Restaurant[];
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

export interface GetRestaurantsParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  search?: string;
  minRating?: number;
  priceRange?: [number, number];
  cuisine?: string[];
  location?: string;
  status?: string;
  wardId?: number;
  approvalStatus?: string;
}

export interface getRestaurantsForMapParams {
  zoomLevel: number;
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}