import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import PrimaryButton from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';
import { useTheme } from '../../context/ThemeContext';
import { useBusinessAnalytics, useBusinessShop } from '../../hooks/useBusiness';
import { useBusinessOrders } from '../../hooks/useOrders';
import { BusinessStackParamList } from '../../navigation/types';
import { Order } from '../../types/orders';
import { getFriendlyStatus } from '../../utils/orders';

const BusinessDashboardScreen = () => {
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const { data: analytics, isLoading: analyticsLoading } = useBusinessAnalytics();
  const { data: shop } = useBusinessShop();
  const { data: orders, isLoading: ordersLoading } = useBusinessOrders();

  const recentOrders = (orders || []).slice(0, 3);

  const navigate = (screen: keyof BusinessStackParamList) => navigation.navigate(screen);

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <ThemedText accessibilityRole="header" style={styles.title}>
          {shop?.name || 'Business Dashboard'}
        </ThemedText>
        <ThemedText style={styles.subtitle}>Stay on top of your shop, catalog, and incoming orders.</ThemedText>

        <View style={styles.actionRow}>
          <PrimaryButton title="Manage Shop" style={{ flex: 1 }} onPress={() => navigate('ManageShop')} />
          <PrimaryButton title="Products" style={{ flex: 1 }} onPress={() => navigate('ManageProducts')} />
          <PrimaryButton title="Orders" style={{ flex: 1 }} onPress={() => navigate('ManageOrders')} />
        </View>

        <View style={styles.analyticsRow}>
          <Card style={styles.metricCard}>
            <ThemedText style={styles.metricLabel}>Total Orders</ThemedText>
            {analyticsLoading ? <ActivityIndicator color={theme.colors.primary} /> : null}
            <ThemedText style={styles.metricValue}>{analytics?.totalOrders ?? '--'}</ThemedText>
            <ThemedText style={styles.metricHint}>All-time count</ThemedText>
          </Card>
          <Card style={styles.metricCard}>
            <ThemedText style={styles.metricLabel}>Monthly Orders</ThemedText>
            {analytics?.monthlyOrders?.slice(0, 3).map((month) => (
              <View key={month.month} style={styles.monthRow}>
                <ThemedText style={styles.monthLabel}>{month.month}</ThemedText>
                <ThemedText style={styles.monthValue}>{month.count}</ThemedText>
              </View>
            ))}
            {!analytics?.monthlyOrders?.length && analyticsLoading ? (
              <ActivityIndicator color={theme.colors.primary} />
            ) : null}
          </Card>
          <Card style={styles.metricCard}>
            <ThemedText style={styles.metricLabel}>Rating</ThemedText>
            <ThemedText style={styles.metricValue}>{analytics?.ratingSummary.average?.toFixed(1) || '--'}</ThemedText>
            <ThemedText style={styles.metricHint}>
              {analytics?.ratingSummary.count || 0} reviews · {shop?.area || 'Citywide'}
            </ThemedText>
          </Card>
        </View>

        <Card>
          <View style={styles.cardHeader}>
            <ThemedText style={styles.sectionTitle}>Recent Orders</ThemedText>
            <Pressable onPress={() => navigate('ManageOrders')} accessibilityRole="button">
              <ThemedText style={{ color: theme.colors.primary }}>See all</ThemedText>
            </Pressable>
          </View>
          {ordersLoading ? <ActivityIndicator color={theme.colors.primary} /> : null}
          {recentOrders.map((order: Order) => (
            <View key={order.id} style={styles.orderRow}>
              <View>
                <ThemedText style={styles.orderNumber}>{order.orderNumber}</ThemedText>
                <ThemedText style={styles.meta}>{order.customerName || order.shopArea}</ThemedText>
                <ThemedText style={styles.meta}>{getFriendlyStatus(order.status)}</ThemedText>
              </View>
              <OrderStatusBadge status={order.status} />
            </View>
          ))}
          {!recentOrders.length && !ordersLoading ? (
            <ThemedText>No incoming orders yet.</ThemedText>
          ) : null}
        </Card>

        <Card>
          <ThemedText style={styles.sectionTitle}>Quick tips</ThemedText>
          <ThemedText style={styles.meta}>• Keep stock levels updated so customers never miss out.</ThemedText>
          <ThemedText style={styles.meta}>• Respond to pending orders quickly to improve your rating.</ThemedText>
          <ThemedText style={styles.meta}>• Refresh your cover image to showcase seasonal products.</ThemedText>
        </Card>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: '#4B5563',
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  analyticsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
  },
  metricLabel: {
    fontWeight: '700',
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  metricHint: {
    color: '#4B5563',
  },
  monthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  monthLabel: {
    color: '#4B5563',
  },
  monthValue: {
    fontWeight: '700',
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 12,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E7EB',
  },
  orderNumber: {
    fontWeight: '700',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  meta: {
    color: '#4B5563',
  },
});

export default BusinessDashboardScreen;
