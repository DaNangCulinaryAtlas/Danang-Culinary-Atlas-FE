interface Restaurant {
    id: number;
    name: string;
    category: string;
    price: number;
    image: string;
    rating: number;
    address: string;
    isFavorite: boolean;
    lat: number;
    lng: number;
    reviews: number;
  }
export type { Restaurant };