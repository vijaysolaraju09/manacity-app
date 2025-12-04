import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View, Vibration } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import PrimaryButton from '../../components/PrimaryButton';
import { useBusinessOrders, useOrderStatusMutation } from '../../hooks/useOrders';
import { Order, OrderStatus } from '../../types/orders';
import { getFriendlyStatus, getStatusLabel, timeSince } from '../../utils/orders';
import { useTheme } from '../../context/ThemeContext';

const filters: (OrderStatus | 'all')[] = [
  'all',
  'pending',
  'accepted',
  'in_progress',
  'completed',
  'delivered',
  'cancelled',
  'rejected',
];

const actionForStatus = (status: OrderStatus): { label: string; next: OrderStatus }[] => {
  switch (status) {
    case 'pending':
      return [
        { label: 'Accept', next: 'accepted' },
        { label: 'Reject', next: 'rejected' },
      ];
    case 'accepted':
      return [{ label: 'Mark In Progress', next: 'in_progress' }];
    case 'in_progress':
      return [{ label: 'Mark Completed', next: 'completed' }];
    case 'completed':
      return [{ label: 'Mark Delivered', next: 'delivered' }];
    default:
      return [];
  }
};

const ManageOrdersScreen = () => {
  const theme = useTheme();
  const { data, isLoading, isFetching } = useBusinessOrders();
  const mutation = useOrderStatusMutation();
  const [statusFilter, setStatusFilter] = useState<(typeof filters)[number]>('all');
  const previousCount = useRef(0);

  const orders = useMemo(() => {
    if (!data) return [] as Order[];
    if (statusFilter === 'all') return data;
    return data.filter((order) => order.status === statusFilter);
  }, [data, statusFilter]);

  useEffect(() => {
    if (!data) return;
    if (data.length > previousCount.current) {
      Vibration.vibrate(400);
      Notifications.scheduleNotificationAsync({
        content: {
          title: 'New order received',
          body: `${data[0].orderNumber} just arrived`,
          sound: 'default',
        },
        trigger: null,
      });
    }
    previousCount.current = data.length;
  }, [data]);

  const handleStatusUpdate = (orderId: string, next: OrderStatus) => {
    mutation.mutate({ orderId, update: { status: next } });
  };

  return (
    <Screen scroll={false}>
      <ThemedText accessibilityRole="header" style={styles.title}>
        Incoming Orders
      </ThemedText>
      <ThemedText style={styles.subtitle}>Realtime dashboard for your shop</ThemedText>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        {filters.map((filter) => {
          const isActive = statusFilter === filter;
          return (
            <Pressable
              key={filter}
              accessibilityRole="button"
              onPress={() => setStatusFilter(filter)}
              style={[
                styles.filterButton,
                {
                  backgroundColor: isActive ? theme.colors.primary : theme.colors.surface,
                  borderColor: isActive ? theme.colors.primary : theme.colors.border,
                },
              ]}
            >
              <ThemedText style={{ color: isActive ? '#fff' : theme.colors.text }}>
                {filter === 'all' ? 'All' : getStatusLabel(filter as OrderStatus)}
              </ThemedText>
            </Pressable>
          );
        })}
      </ScrollView>

      {isLoading ? <ActivityIndicator color={theme.colors.primary} /> : null}

      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {orders.map((order) => (
          <Card key={order.id}>
            <View style={styles.row}>
              <View>
                <ThemedText style={styles.bold}>{order.shopName}</ThemedText>
                <ThemedText style={styles.subtle}>{order.orderNumber}</ThemedText>
                <ThemedText style={styles.subtle}>Placed {timeSince(order.placedAt)}</ThemedText>
              </View>
              <OrderStatusBadge status={order.status} />
            </View>
            <ThemedText style={styles.statusText}>{getFriendlyStatus(order.status)}</ThemedText>
            <ThemedText style={styles.subtle}>{order.items.length} items · ${order.receipt.total.toFixed(2)}</ThemedText>

            <View style={styles.actionsRow}>
              {actionForStatus(order.status).map((action) => (
                <PrimaryButton
                  key={action.label}
                  title={action.label}
                  onPress={() => handleStatusUpdate(order.id, action.next)}
                  loading={mutation.isLoading}
                  style={[styles.actionButton, { flex: 1 }]}
                  disabled={mutation.isLoading}
                />
              ))}
            </View>
          </Card>
        ))}

        {!orders.length && !isLoading ? (
          <Card>
            <ThemedText>No orders in this state.</ThemedText>
          </Card>
        ) : null}
        {isFetching ? <ActivityIndicator color={theme.colors.muted} /> : null}
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    color: '#4B5563',
    marginBottom: 12,
  },
  filterRow: {
    flexGrow: 0,
    marginBottom: 12,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginRight: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bold: {
    fontWeight: '700',
  },
  subtle: {
    color: '#4B5563',
  },
  statusText: {
    marginTop: 4,
    marginBottom: 6,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  actionButton: {
    paddingVertical: 12,
  },
});

export default ManageOrdersScreen;
