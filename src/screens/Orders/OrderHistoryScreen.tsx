import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import PrimaryButton from '../../components/PrimaryButton';
import { useOrders, useReorderMutation } from '../../hooks/useOrders';
import { OrderStatus } from '../../types/orders';
import { formatDateTime, getFriendlyStatus, timeSince } from '../../utils/orders';
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

const OrderHistoryScreen = () => {
  const [statusFilter, setStatusFilter] = useState<(typeof filters)[number]>('all');
  const theme = useTheme();
  const navigation = useNavigation();
  const reorderMutation = useReorderMutation();
  const { data, isLoading, isFetching } = useOrders(
    statusFilter === 'all' ? undefined : { status: statusFilter as OrderStatus },
  );

  const orders = useMemo(() => data || [], [data]);

  return (
    <Screen scroll={false}>
      <View style={styles.header}>
        <ThemedText accessibilityRole="header" style={styles.title}>
          Order History
        </ThemedText>
        <ThemedText style={styles.subtle}>Reorder and download receipts</ThemedText>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {filters.map((status) => (
            <Pressable
              key={status}
              onPress={() => setStatusFilter(status)}
              style={[
                styles.filter,
                statusFilter === status && { backgroundColor: theme.colors.primary },
              ]}
            >
              <ThemedText style={{ color: statusFilter === status ? '#fff' : theme.colors.text }}>
                {status === 'all' ? 'All' : getFriendlyStatus(status as OrderStatus)}
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>

        {isLoading ? <ActivityIndicator color={theme.colors.primary} /> : null}

        {orders.map((order) => (
          <Card key={order.id}>
            <View style={styles.row}>
              <View>
                <ThemedText style={styles.bold}>{order.orderNumber}</ThemedText>
                <ThemedText style={styles.subtle}>{order.shopName}</ThemedText>
                <ThemedText style={styles.subtle}>Placed {timeSince(order.placedAt)}</ThemedText>
              </View>
              <OrderStatusBadge status={order.status} />
            </View>

            <View style={[styles.row, { marginTop: 8 }]}>
              <ThemedText>{getFriendlyStatus(order.status)}</ThemedText>
              <ThemedText style={styles.bold}>${order.receipt.total.toFixed(2)}</ThemedText>
            </View>

            <View style={styles.buttonRow}>
              <PrimaryButton
                title="Details"
                onPress={() => navigation.navigate('OrderDetails' as never, { orderId: order.id } as never)}
                style={[styles.smallButton, { flex: 1 }]}
              />
              <PrimaryButton
                title="Reorder"
                onPress={() => reorderMutation.mutate(order.id)}
                loading={reorderMutation.isLoading}
                style={[styles.smallButton, { flex: 1, backgroundColor: theme.colors.secondary }]}
              />
            </View>

            {order.receiptUrl ? (
              <Pressable accessibilityRole="link" onPress={() => Linking.openURL(order.receiptUrl!)}>
                <ThemedText style={[styles.link, { color: theme.colors.primary }]}>View receipt</ThemedText>
              </Pressable>
            ) : null}
            <ThemedText style={styles.timestamp}>Last update: {formatDateTime(order.updatedAt)}</ThemedText>
          </Card>
        ))}

        {!orders.length && !isLoading ? (
          <Card>
            <ThemedText>No orders found for this filter.</ThemedText>
          </Card>
        ) : null}

        {isFetching ? <ActivityIndicator color={theme.colors.muted} /> : null}
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtle: {
    color: '#4B5563',
  },
  filterRow: {
    flexGrow: 0,
    marginVertical: 8,
  },
  filter: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bold: {
    fontWeight: '700',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  smallButton: {
    paddingVertical: 12,
  },
  link: {
    marginTop: 10,
    fontWeight: '600',
  },
  timestamp: {
    marginTop: 6,
    color: '#718096',
  },
});

export default OrderHistoryScreen;
