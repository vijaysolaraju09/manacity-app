import apiClient from './client';
import { Order, OrderFilters, OrderStatus, OrderStatusUpdate } from '../types/orders';
import { calculateReceiptTotals, generateEtaPlaceholder, getFriendlyStatus } from '../utils/orders';

const now = new Date();
const minutesAgo = (mins: number) => new Date(now.getTime() - mins * 60000).toISOString();

const mockOrdersSeed: Order[] = [
  {
    id: 'o-1001',
    orderNumber: 'MC-1001',
    shopId: '1',
    shopName: 'Sunrise Grocers',
    shopArea: 'Downtown',
    status: 'pending',
    placedAt: minutesAgo(12),
    updatedAt: minutesAgo(12),
    eta: generateEtaPlaceholder('pending'),
    items: [
      { id: 'p1', name: 'Organic Apples', price: 3.5, quantity: 3 },
      { id: 'p2', name: 'Almond Milk', price: 2.99, quantity: 2 },
    ],
    receipt: calculateReceiptTotals([
      { id: 'p1', name: 'Organic Apples', price: 3.5, quantity: 3 },
      { id: 'p2', name: 'Almond Milk', price: 2.99, quantity: 2 },
    ]),
    deliveryAddress: '123 Market Street',
    paymentMethod: 'Cash on Delivery',
    customerName: 'Amina Farouk',
    receiptUrl: 'https://example.com/receipts/MC-1001',
    friendlyStatus: getFriendlyStatus('pending'),
    timeline: [
      { status: 'pending', timestamp: minutesAgo(12), note: 'Awaiting confirmation' },
    ],
  },
  {
    id: 'o-1002',
    orderNumber: 'MC-1002',
    shopId: '3',
    shopName: 'Fresh Bites Cafe',
    shopArea: 'Lakeside',
    status: 'accepted',
    placedAt: minutesAgo(40),
    updatedAt: minutesAgo(8),
    eta: generateEtaPlaceholder('accepted'),
    items: [
      { id: 'p5', name: 'Cold Brew Coffee', price: 4.5, quantity: 2 },
      { id: 'p6', name: 'Avocado Toast', price: 6.25, quantity: 1 },
    ],
    receipt: calculateReceiptTotals([
      { id: 'p5', name: 'Cold Brew Coffee', price: 4.5, quantity: 2 },
      { id: 'p6', name: 'Avocado Toast', price: 6.25, quantity: 1 },
    ]),
    deliveryAddress: '45 Garden Heights',
    paymentMethod: 'Card',
    customerName: 'Leo Marcos',
    receiptUrl: 'https://example.com/receipts/MC-1002',
    friendlyStatus: getFriendlyStatus('accepted'),
    timeline: [
      { status: 'pending', timestamp: minutesAgo(40) },
      { status: 'accepted', timestamp: minutesAgo(8), note: 'Cafe started preparing your order' },
    ],
  },
  {
    id: 'o-1003',
    orderNumber: 'MC-1003',
    shopId: '2',
    shopName: 'Tech Hive',
    shopArea: 'Innovation Park',
    status: 'in_progress',
    placedAt: minutesAgo(80),
    updatedAt: minutesAgo(5),
    eta: generateEtaPlaceholder('in_progress'),
    items: [
      { id: 'p3', name: 'Wireless Headphones', price: 129.99, quantity: 1 },
    ],
    receipt: calculateReceiptTotals([{ id: 'p3', name: 'Wireless Headphones', price: 129.99, quantity: 1 }]),
    deliveryAddress: '9 Innovation Avenue',
    paymentMethod: 'Card',
    customerName: 'Mariam T.',
    receiptUrl: 'https://example.com/receipts/MC-1003',
    friendlyStatus: getFriendlyStatus('in_progress'),
    timeline: [
      { status: 'pending', timestamp: minutesAgo(80) },
      { status: 'accepted', timestamp: minutesAgo(60) },
      { status: 'in_progress', timestamp: minutesAgo(5), note: 'Courier picked up the package' },
    ],
  },
  {
    id: 'o-1004',
    orderNumber: 'MC-1004',
    shopId: '4',
    shopName: 'Urban Styles',
    shopArea: 'Central Plaza',
    status: 'delivered',
    placedAt: minutesAgo(200),
    updatedAt: minutesAgo(30),
    eta: 'Arrived',
    items: [
      { id: 'p7', name: 'Denim Jacket', price: 59.99, quantity: 1 },
      { id: 'p8', name: 'Leather Boots', price: 120, quantity: 1 },
    ],
    receipt: calculateReceiptTotals([
      { id: 'p7', name: 'Denim Jacket', price: 59.99, quantity: 1 },
      { id: 'p8', name: 'Leather Boots', price: 120, quantity: 1 },
    ]),
    deliveryAddress: '12 Fashion Walk',
    paymentMethod: 'Card',
    customerName: 'Sofia Malik',
    receiptUrl: 'https://example.com/receipts/MC-1004',
    friendlyStatus: getFriendlyStatus('delivered'),
    timeline: [
      { status: 'pending', timestamp: minutesAgo(200) },
      { status: 'accepted', timestamp: minutesAgo(170) },
      { status: 'in_progress', timestamp: minutesAgo(120) },
      { status: 'completed', timestamp: minutesAgo(60) },
      { status: 'delivered', timestamp: minutesAgo(30), note: 'Left at front desk' },
    ],
  },
];

let mockOrders = [...mockOrdersSeed];

const statusProgression: OrderStatus[] = ['pending', 'accepted', 'in_progress', 'completed', 'delivered'];

const maybeAdvanceMockOrders = () => {
  mockOrders = mockOrders.map((order) => {
    if (['delivered', 'cancelled', 'rejected'].includes(order.status)) return order;
    const shouldAdvance = Math.random() > 0.7;
    if (!shouldAdvance) return order;
    const currentIndex = statusProgression.indexOf(order.status);
    const nextStatus = statusProgression[Math.min(currentIndex + 1, statusProgression.length - 1)];
    const updatedAt = new Date().toISOString();
    const eta = generateEtaPlaceholder(nextStatus);
    return {
      ...order,
      status: nextStatus,
      updatedAt,
      eta,
      friendlyStatus: getFriendlyStatus(nextStatus),
      timeline: [...(order.timeline || []), { status: nextStatus, timestamp: updatedAt }],
    };
  });
};

const persistUpdate = (orderId: string, status: OrderStatus, note?: string) => {
  const updatedAt = new Date().toISOString();
  mockOrders = mockOrders.map((order) => {
    if (order.id !== orderId) return order;
    const eta = generateEtaPlaceholder(status);
    return {
      ...order,
      status,
      friendlyStatus: getFriendlyStatus(status),
      updatedAt,
      eta,
      timeline: [...(order.timeline || []), { status, timestamp: updatedAt, note }],
    };
  });
  return mockOrders.find((order) => order.id === orderId) as Order;
};

export const fetchOrders = async (filters?: OrderFilters): Promise<Order[]> => {
  maybeAdvanceMockOrders();
  try {
    const response = await apiClient.get('/orders', { params: filters });
    return response.data?.data || response.data || [];
  } catch (error) {
    if (filters?.status) {
      return mockOrders.filter((order) => order.status === filters.status);
    }
    return mockOrders;
  }
};

export const fetchOrderDetails = async (orderId: string): Promise<Order> => {
  maybeAdvanceMockOrders();
  try {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data?.data || response.data;
  } catch (error) {
    return mockOrders.find((order) => order.id === orderId) || mockOrders[0];
  }
};

export const fetchBusinessOrders = async (): Promise<Order[]> => {
  maybeAdvanceMockOrders();
  try {
    const response = await apiClient.get('/business/orders');
    return response.data?.data || response.data || [];
  } catch (error) {
    return mockOrders.sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime());
  }
};

export const updateOrderStatus = async (orderId: string, payload: OrderStatusUpdate): Promise<Order> => {
  try {
    const response = await apiClient.patch(`/orders/${orderId}/status`, payload);
    return response.data?.data || response.data;
  } catch (error) {
    return persistUpdate(orderId, payload.status, payload.note);
  }
};

export const reorderOrder = async (orderId: string): Promise<Order> => {
  const existing = mockOrders.find((order) => order.id === orderId);
  if (!existing) {
    throw new Error('Order not found');
  }
  const updatedAt = new Date().toISOString();
  const newOrder: Order = {
    ...existing,
    id: `copy-${existing.id}-${Date.now()}`,
    orderNumber: `RE-${Math.floor(Math.random() * 90000 + 10000)}`,
    status: 'pending',
    eta: generateEtaPlaceholder('pending'),
    friendlyStatus: getFriendlyStatus('pending'),
    placedAt: updatedAt,
    updatedAt,
    timeline: [{ status: 'pending', timestamp: updatedAt, note: 'Reorder placed' }],
  };
  mockOrders = [newOrder, ...mockOrders];
  return newOrder;
};

export const createOrder = async (
  payload: Pick<Order, 'items' | 'shopId' | 'shopName' | 'shopArea' | 'deliveryAddress' | 'paymentMethod' | 'customerName'>,
): Promise<Order> => {
  const receipt = calculateReceiptTotals(payload.items);
  const nowIso = new Date().toISOString();
  const order: Order = {
    id: `o-${Date.now()}`,
    orderNumber: `MC-${Math.floor(Math.random() * 90000 + 10000)}`,
    status: 'pending',
    eta: generateEtaPlaceholder('pending'),
    friendlyStatus: getFriendlyStatus('pending'),
    placedAt: nowIso,
    updatedAt: nowIso,
    receipt,
    timeline: [{ status: 'pending', timestamp: nowIso, note: 'Awaiting confirmation' }],
    receiptUrl: 'https://example.com/receipt',
    ...payload,
  };
  mockOrders = [order, ...mockOrders];
  return order;
};
