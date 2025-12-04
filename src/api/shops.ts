import apiClient from './client';
import { PaginatedResponse, Product, Shop } from '../types/shops';

const fallbackShops: Shop[] = [
  {
    id: '1',
    name: 'Sunrise Grocers',
    category: 'Groceries',
    area: 'Downtown',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e',
    rating: 4.7,
    address: '123 Market Street, Downtown',
    timings: '8:00 AM - 9:00 PM',
    isOpen: true,
  },
  {
    id: '2',
    name: 'Tech Hive',
    category: 'Electronics',
    area: 'Innovation Park',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
    rating: 4.5,
    address: '45 Silicon Avenue, Innovation Park',
    timings: '10:00 AM - 8:00 PM',
    isOpen: false,
  },
  {
    id: '3',
    name: 'Fresh Bites Cafe',
    category: 'Cafe',
    area: 'Lakeside',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085',
    rating: 4.9,
    address: '77 Lakeview Road, Lakeside',
    timings: '7:00 AM - 10:00 PM',
    isOpen: true,
  },
  {
    id: '4',
    name: 'Urban Styles',
    category: 'Fashion',
    area: 'Central Plaza',
    image: 'https://images.unsplash.com/photo-1495121553079-4c61bcce1894',
    rating: 4.3,
    address: '12 Fashion Walk, Central Plaza',
    timings: '11:00 AM - 9:30 PM',
    isOpen: true,
  },
];

const fallbackProducts: Record<string, Product[]> = {
  '1': [
    {
      id: 'p1',
      name: 'Organic Apples',
      price: 3.5,
      description: 'Crisp and sweet organic apples sourced from local farms.',
      stock: 24,
      image: 'https://images.unsplash.com/photo-1574226516831-e1dff420e43e',
      category: 'Groceries',
    },
    {
      id: 'p2',
      name: 'Almond Milk',
      price: 2.99,
      description: 'Unsweetened almond milk with no preservatives.',
      stock: 18,
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
      category: 'Groceries',
    },
  ],
  '2': [
    {
      id: 'p3',
      name: 'Wireless Headphones',
      price: 129.99,
      description: 'Noise cancelling over-ear headphones with 30h battery.',
      stock: 14,
      image: 'https://images.unsplash.com/photo-1511367466-95c1c1e0fbb3',
      category: 'Electronics',
    },
    {
      id: 'p4',
      name: 'Smart Home Hub',
      price: 89.0,
      description: 'Control your smart devices with a single voice-enabled hub.',
      stock: 9,
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
      category: 'Electronics',
    },
  ],
  '3': [
    {
      id: 'p5',
      name: 'Cold Brew Coffee',
      price: 4.5,
      description: 'Slow steeped cold brew with notes of chocolate and caramel.',
      stock: 32,
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93',
      category: 'Beverages',
    },
    {
      id: 'p6',
      name: 'Avocado Toast',
      price: 6.25,
      description: 'Sourdough topped with smashed avocado, feta, and microgreens.',
      stock: 20,
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061',
      category: 'Food',
    },
  ],
  '4': [
    {
      id: 'p7',
      name: 'Denim Jacket',
      price: 59.99,
      description: 'Classic fit denim jacket with vintage wash.',
      stock: 12,
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518',
      category: 'Fashion',
    },
    {
      id: 'p8',
      name: 'Leather Boots',
      price: 120.0,
      description: 'Handcrafted leather boots built for comfort and durability.',
      stock: 6,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
      category: 'Fashion',
    },
  ],
};

export const fetchShops = async (
  page = 1,
  search?: string,
  category?: string,
  limit = 8,
): Promise<PaginatedResponse<Shop>> => {
  try {
    const response = await apiClient.get('/shops', { params: { page, search, category, limit } });
    const data = response.data?.data || response.data;
    return {
      items: data?.items || data?.shops || data || [],
      hasMore: data?.hasMore ?? data?.hasNextPage ?? false,
    };
  } catch (error) {
    const filtered = fallbackShops.filter((shop) => {
      const matchesCategory = category ? shop.category === category : true;
      const matchesSearch = search
        ? shop.name.toLowerCase().includes(search.toLowerCase()) ||
          shop.category.toLowerCase().includes(search.toLowerCase())
        : true;
      return matchesCategory && matchesSearch;
    });
    const start = (page - 1) * limit;
    const items = filtered.slice(start, start + limit);
    return { items, hasMore: start + limit < filtered.length };
  }
};

export const fetchShopDetails = async (shopId: string): Promise<Shop> => {
  try {
    const response = await apiClient.get(`/shops/${shopId}`);
    const data = response.data?.data || response.data;
    return {
      featuredProducts: data?.featuredProducts || data?.featured || [],
      ...data,
    } as Shop;
  } catch (error) {
    const shop = fallbackShops.find((s) => s.id === shopId) || fallbackShops[0];
    return {
      ...shop,
      featuredProducts: fallbackProducts[shop.id]?.slice(0, 1) || [],
    };
  }
};

export const fetchProducts = async (shopId: string): Promise<Product[]> => {
  try {
    const response = await apiClient.get(`/shops/${shopId}/products`);
    const data = response.data?.data || response.data;
    return data?.items || data?.products || data || [];
  } catch (error) {
    return fallbackProducts[shopId] || [];
  }
};
