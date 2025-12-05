export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  stock: number;
  image?: string;
  category?: string;
}

export interface BusinessHours {
  day: string;
  open: string;
  close: string;
  closed?: boolean;
}

export interface BusinessShopProfile extends Shop {
  description?: string;
  phone?: string;
  coverImage?: string;
  workingHours: BusinessHours[];
}

export interface RatingSummary {
  average: number;
  count: number;
  breakdown: Record<string, number>;
}

export interface BusinessAnalytics {
  totalOrders: number;
  monthlyOrders: { month: string; count: number }[];
  ratingSummary: RatingSummary;
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
