import React from 'react';
import { ActivityIndicator, Linking, Pressable, StyleSheet, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import PrimaryButton from '../../components/PrimaryButton';
import OrderTimeline from '../../components/OrderTimeline';
import { useOrderDetails, useReorderMutation } from '../../hooks/useOrders';
import { formatDateTime, getFriendlyStatus } from '../../utils/orders';
import { ProfileStackParamList } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';

type Route = RouteProp<ProfileStackParamList, 'OrderDetails'>;

const OrderDetailsScreen = () => {
  const route = useRoute<Route>();
  const navigation = useNavigation();
  const theme = useTheme();
  const { data: order, isLoading } = useOrderDetails(route.params?.orderId);
  const reorderMutation = useReorderMutation();

  const handleReorder = () => {
    if (!order) return;
    reorderMutation.mutate(order.id);
  };

  if (isLoading || !order) {
    return (
      <Screen>
        <ActivityIndicator color={theme.colors.primary} />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.headerRow}>
        <View>
          <ThemedText accessibilityRole="header" style={styles.title}>
            Order {order.orderNumber}
          </ThemedText>
          <ThemedText style={styles.subtle}>{getFriendlyStatus(order.status)}</ThemedText>
          <ThemedText style={styles.subtle}>ETA: {order.eta || 'Updating...'}</ThemedText>
        </View>
        <OrderStatusBadge status={order.status} />
      </View>

      <Card>
        <ThemedText style={styles.sectionTitle}>Shop</ThemedText>
        <ThemedText style={styles.bold}>{order.shopName}</ThemedText>
        <ThemedText style={styles.subtle}>{order.shopArea}</ThemedText>
      </Card>

      <Card>
        <ThemedText style={styles.sectionTitle}>Items</ThemedText>
        {order.items.map((item) => (
          <View key={item.id} style={styles.row}> 
            <View>
              <ThemedText style={styles.bold}>{item.name}</ThemedText>
              <ThemedText style={styles.subtle}>Qty: {item.quantity}</ThemedText>
            </View>
            <ThemedText style={styles.bold}>${(item.price * item.quantity).toFixed(2)}</ThemedText>
          </View>
        ))}
      </Card>

      <Card>
        <ThemedText style={styles.sectionTitle}>Payment & Delivery</ThemedText>
        <ThemedText>Payment: {order.paymentMethod || '—'}</ThemedText>
        <ThemedText>Address: {order.deliveryAddress || 'No address provided'}</ThemedText>
        <ThemedText>Placed: {formatDateTime(order.placedAt)}</ThemedText>
        <ThemedText>Last update: {formatDateTime(order.updatedAt)}</ThemedText>
      </Card>

      <Card>
        <ThemedText style={styles.sectionTitle}>Receipt</ThemedText>
        <View style={styles.row}> 
          <ThemedText>Subtotal</ThemedText>
          <ThemedText>${order.receipt.subtotal.toFixed(2)}</ThemedText>
        </View>
        <View style={styles.row}> 
          <ThemedText>Tax</ThemedText>
          <ThemedText>${order.receipt.tax.toFixed(2)}</ThemedText>
        </View>
        {order.receipt.deliveryFee ? (
          <View style={styles.row}>
            <ThemedText>Delivery</ThemedText>
            <ThemedText>${order.receipt.deliveryFee.toFixed(2)}</ThemedText>
          </View>
        ) : null}
        <View style={[styles.row, styles.totalRow]}>
          <ThemedText style={styles.bold}>Total</ThemedText>
          <ThemedText style={styles.bold}>${order.receipt.total.toFixed(2)}</ThemedText>
        </View>
        {order.receiptUrl ? (
          <Pressable accessibilityRole="link" onPress={() => Linking.openURL(order.receiptUrl!)}>
            <ThemedText style={[styles.link, { color: theme.colors.primary }]}>View receipt</ThemedText>
          </Pressable>
        ) : null}
      </Card>

      <Card>
        <ThemedText style={styles.sectionTitle}>Timeline</ThemedText>
        <OrderTimeline timeline={order.timeline} />
      </Card>

      <PrimaryButton
        title="Track delivery"
        onPress={() => navigation.navigate('OrderTracking' as never, { orderId: order.id } as never)}
        style={{ marginVertical: 8 }}
      />
      <PrimaryButton
        title="Reorder"
        onPress={handleReorder}
        loading={reorderMutation.isLoading}
        style={{ marginBottom: 24, backgroundColor: theme.colors.secondary }}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtle: {
    color: '#4A5568',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  bold: {
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  totalRow: {
    marginTop: 6,
  },
  link: {
    marginTop: 8,
    fontWeight: '600',
  },
});

export default OrderDetailsScreen;
