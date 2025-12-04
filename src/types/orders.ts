export type OrderStatus =
  | 'pending'
  | 'accepted'
  | 'in_progress'
  | 'completed'
  | 'delivered'
  | 'cancelled'
  | 'rejected';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface OrderReceipt {
  subtotal: number;
  tax: number;
  deliveryFee?: number;
  total: number;
}

export interface OrderTimelineEntry {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  shopId: string;
  shopName: string;
  shopArea?: string;
  status: OrderStatus;
  items: OrderItem[];
  receipt: OrderReceipt;
  placedAt: string;
  updatedAt: string;
  eta?: string;
  customerName?: string;
  deliveryAddress?: string;
  paymentMethod?: string;
  friendlyStatus?: string;
  receiptUrl?: string;
  timeline?: OrderTimelineEntry[];
}

export interface OrderFilters {
  status?: OrderStatus;
}

export interface OrderStatusUpdate {
  status: OrderStatus;
  note?: string;
}
