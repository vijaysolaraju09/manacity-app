export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  stock: number;
  image?: string;
  category?: string;
}

export interface Shop {
  id: string;
  name: string;
  category: string;
  area: string;
  image?: string;
  rating?: number;
  address?: string;
  timings?: string;
  isOpen: boolean;
  featuredProducts?: Product[];
}

export interface CartItem extends Product {
  quantity: number;
  shopId: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  hasMore: boolean;
}
