import { palette } from '../theme/colors';
import { Order, OrderStatus } from '../types/orders';

export const statusLabels: Record<OrderStatus, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  in_progress: 'In Progress',
  completed: 'Completed',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  rejected: 'Rejected',
};

export const friendlyStatusText: Record<OrderStatus, string> = {
  pending: 'Awaiting confirmation',
  accepted: 'Being prepared',
  in_progress: 'On the way to you',
  completed: 'Ready for pickup',
  delivered: 'Delivered successfully',
  cancelled: 'Cancelled',
  rejected: 'Rejected',
};

export const statusColors: Record<
  OrderStatus,
  { background: string; text: string; border: string }
> = {
  pending: { background: '#F0F4FF', text: palette.primary, border: '#D7E3FF' },
  accepted: { background: '#E0F7EF', text: palette.secondary, border: '#C3EEDC' },
  in_progress: { background: '#FFF7E6', text: palette.accent, border: '#FFE4B5' },
  completed: { background: '#E7F4EF', text: palette.secondary, border: '#C6E6D6' },
  delivered: { background: '#E6F2FF', text: palette.primary, border: '#C8DFFF' },
  cancelled: { background: '#FDECEC', text: palette.danger, border: '#FAC7C7' },
  rejected: { background: '#FDECEC', text: palette.danger, border: '#FAC7C7' },
};

export const getStatusColor = (status: OrderStatus) => statusColors[status];
export const getStatusLabel = (status: OrderStatus) => statusLabels[status];
export const getFriendlyStatus = (status: OrderStatus) => friendlyStatusText[status];

export const generateEtaPlaceholder = (status: OrderStatus) => {
  if (status === 'delivered' || status === 'completed') return 'Arrived';
  if (status === 'in_progress') return '10-15 mins';
  if (status === 'accepted') return '15-25 mins';
  return '20-40 mins';
};

export const formatDateTime = (iso?: string) => {
  if (!iso) return '—';
  const date = new Date(iso);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};

export const timeSince = (iso?: string) => {
  if (!iso) return 'Just now';
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export const calculateReceiptTotals = (items: Order['items']) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Number((subtotal * 0.05).toFixed(2));
  const deliveryFee = 3.5;
  const total = Number((subtotal + tax + deliveryFee).toFixed(2));
  return { subtotal, tax, deliveryFee, total };
};
