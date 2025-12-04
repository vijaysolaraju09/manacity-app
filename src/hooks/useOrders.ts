import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef } from 'react';
import { reorderOrder, fetchOrderDetails, fetchOrders, updateOrderStatus, fetchBusinessOrders } from '../api/orders';
import { Order, OrderFilters, OrderStatusUpdate } from '../types/orders';
import { getStatusLabel } from '../utils/orders';

export const useOrders = (filters?: OrderFilters) =>
  useQuery<Order[], Error>({
    queryKey: ['orders', filters],
    queryFn: () => fetchOrders(filters),
    refetchInterval: 8000,
  });

export const useOrderDetails = (orderId?: string) => {
  const previousStatus = useRef<string | undefined>();
  const query = useQuery<Order, Error>({
    queryKey: ['order', orderId],
    queryFn: () => fetchOrderDetails(orderId as string),
    enabled: !!orderId,
    refetchInterval: 6000,
  });

  useEffect(() => {
    if (!query.data) return;
    if (previousStatus.current && previousStatus.current !== query.data.status) {
      Notifications.scheduleNotificationAsync({
        content: {
          title: 'Order status updated',
          body: `${query.data.orderNumber} is now ${getStatusLabel(query.data.status)}`,
          sound: 'default',
        },
        trigger: null,
      });
    }
    previousStatus.current = query.data.status;
  }, [query.data]);

  return query;
};

export const useBusinessOrders = () =>
  useQuery<Order[], Error>({
    queryKey: ['business-orders'],
    queryFn: () => fetchBusinessOrders(),
    refetchInterval: 5000,
  });

export const useOrderStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, update }: { orderId: string; update: OrderStatusUpdate }) =>
      updateOrderStatus(orderId, update),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['business-orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', order.id] });
      Notifications.scheduleNotificationAsync({
        content: {
          title: `Order ${order.orderNumber}`,
          body: `Status changed to ${getStatusLabel(order.status)}`,
        },
        trigger: null,
      });
    },
  });
};

export const useReorderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => reorderOrder(orderId),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      Notifications.scheduleNotificationAsync({
        content: { title: 'Reorder placed', body: `Order ${order.orderNumber} is pending` },
        trigger: null,
      });
    },
  });
};
