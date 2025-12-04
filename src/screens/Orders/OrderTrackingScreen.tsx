import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import OrderTimeline from '../../components/OrderTimeline';
import PrimaryButton from '../../components/PrimaryButton';
import { useOrderDetails } from '../../hooks/useOrders';
import { ProfileStackParamList } from '../../navigation/types';
import { formatDateTime, getFriendlyStatus, timeSince } from '../../utils/orders';
import { useTheme } from '../../context/ThemeContext';

type Route = RouteProp<ProfileStackParamList, 'OrderTracking'>;

const OrderTrackingScreen = () => {
  const route = useRoute<Route>();
  const theme = useTheme();
  const { data: order, isLoading, refetch, isFetching } = useOrderDetails(route.params?.orderId);

  if (isLoading || !order) {
    return (
      <Screen>
        <ActivityIndicator color={theme.colors.primary} />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <View>
          <ThemedText accessibilityRole="header" style={styles.title}>
            Live Tracking
          </ThemedText>
          <ThemedText style={styles.subtitle}>{getFriendlyStatus(order.status)}</ThemedText>
          <ThemedText style={styles.subtitle}>Updated {timeSince(order.updatedAt)}</ThemedText>
        </View>
        <OrderStatusBadge status={order.status} />
      </View>

      <Card>
        <ThemedText style={styles.sectionTitle}>Current ETA</ThemedText>
        <ThemedText style={styles.eta}>{order.eta || 'Updating…'}</ThemedText>
        <ThemedText style={styles.subtitle}>Placed {formatDateTime(order.placedAt)}</ThemedText>
      </Card>

      <Card>
        <ThemedText style={styles.sectionTitle}>Status Journey</ThemedText>
        <OrderTimeline timeline={order.timeline} />
      </Card>

      <PrimaryButton
        title={isFetching ? 'Refreshing…' : 'Refresh now'}
        onPress={() => refetch()}
        loading={isFetching}
        style={{ marginTop: 12 }}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    color: '#4B5563',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  eta: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
});

export default OrderTrackingScreen;
