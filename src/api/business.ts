import apiClient from './client';
import { fetchBusinessOrders } from './orders';
import {
  BusinessAnalytics,
  BusinessHours,
  BusinessShopProfile,
  Product,
} from '../types/shops';

const defaultHours: BusinessHours[] = [
  { day: 'Monday', open: '08:00', close: '21:00' },
  { day: 'Tuesday', open: '08:00', close: '21:00' },
  { day: 'Wednesday', open: '08:00', close: '21:00' },
  { day: 'Thursday', open: '08:00', close: '21:00' },
  { day: 'Friday', open: '08:00', close: '21:00' },
  { day: 'Saturday', open: '09:00', close: '20:00' },
  { day: 'Sunday', open: '09:00', close: '18:00', closed: false },
];

let businessShop: BusinessShopProfile = {
  id: 'biz-1',
  name: 'Sunrise Grocers',
  category: 'Groceries',
  area: 'Downtown',
  address: '123 Market Street, Downtown',
  description: 'Neighborhood grocer focused on freshness and convenience.',
  image: 'https://images.unsplash.com/photo-1542838132-92c53300491e',
  coverImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
  phone: '+233 555 010 010',
  timings: '8:00 AM - 9:00 PM',
  workingHours: defaultHours,
  isOpen: true,
  rating: 4.7,
};

let businessProducts: Product[] = [
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
  {
    id: 'p9',
    name: 'Granola Bites',
    price: 5.25,
    description: 'House-made granola with honey and almonds.',
    stock: 32,
    image: 'https://images.unsplash.com/photo-1514996937319-344454492b37',
    category: 'Snacks',
  },
];

const deriveAnalytics = async (): Promise<BusinessAnalytics> => {
  const orders = await fetchBusinessOrders();
  const monthlyCounts = orders.reduce<Record<string, number>>((acc, order) => {
    const month = new Date(order.placedAt).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  return {
    totalOrders: orders.length,
    monthlyOrders: Object.entries(monthlyCounts).map(([month, count]) => ({ month, count })),
    ratingSummary: {
      average: businessShop.rating || 4.6,
      count: 182,
      breakdown: { '5': 120, '4': 46, '3': 12, '2': 3, '1': 1 },
    },
  };
};

export const fetchBusinessShop = async (): Promise<BusinessShopProfile> => {
  try {
    const response = await apiClient.get('/business/shop');
    return response.data?.data || response.data;
  } catch (error) {
    return businessShop;
  }
};

export const updateBusinessShop = async (
  payload: Partial<BusinessShopProfile>,
): Promise<BusinessShopProfile> => {
  try {
    const response = await apiClient.put('/business/shop', payload);
    return response.data?.data || response.data;
  } catch (error) {
    businessShop = {
      ...businessShop,
      ...payload,
      workingHours: payload.workingHours || businessShop.workingHours,
    };
    return businessShop;
  }
};

export const fetchBusinessProducts = async (): Promise<Product[]> => {
  try {
    const response = await apiClient.get('/business/products');
    return response.data?.data || response.data || [];
  } catch (error) {
    return businessProducts;
  }
};

export const createBusinessProduct = async (payload: Omit<Product, 'id'>): Promise<Product> => {
  try {
    const response = await apiClient.post('/business/products', payload);
    return response.data?.data || response.data;
  } catch (error) {
    const product: Product = { ...payload, id: `prod-${Date.now()}` };
    businessProducts = [product, ...businessProducts];
    return product;
  }
};

export const updateBusinessProduct = async (
  id: string,
  payload: Partial<Product>,
): Promise<Product> => {
  try {
    const response = await apiClient.put(`/business/products/${id}`, payload);
    return response.data?.data || response.data;
  } catch (error) {
    businessProducts = businessProducts.map((product) => (product.id === id ? { ...product, ...payload } : product));
    return businessProducts.find((product) => product.id === id) as Product;
  }
};

export const deleteBusinessProduct = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/business/products/${id}`);
  } catch (error) {
    businessProducts = businessProducts.filter((product) => product.id !== id);
  }
};

export const uploadProductImage = async (uri: string): Promise<string> => {
  try {
    const response = await apiClient.post('/business/uploads', { uri });
    return response.data?.url || response.data?.data?.url || uri;
  } catch (error) {
    return `${uri}?cacheBust=${Date.now()}`;
  }
};

export const fetchBusinessAnalytics = async (): Promise<BusinessAnalytics> => {
  try {
    const response = await apiClient.get('/business/analytics');
    const data = response.data?.data || response.data;
    if (data) return data;
  } catch (error) {
    // Fallback to derived analytics
  }
  return deriveAnalytics();
};

