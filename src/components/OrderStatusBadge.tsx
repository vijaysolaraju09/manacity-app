import React from 'react';
import { View, StyleSheet } from 'react-native';
import { OrderStatus } from '../types/orders';
import { getStatusColor, getStatusLabel } from '../utils/orders';
import { ThemedText } from './Themed';

interface Props {
  status: OrderStatus;
}

const OrderStatusBadge: React.FC<Props> = ({ status }) => {
  const { background, text, border } = getStatusColor(status);
  return (
    <View style={[styles.badge, { backgroundColor: background, borderColor: border }]}>
      <ThemedText style={[styles.label, { color: text }]}>{getStatusLabel(status)}</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    marginVertical: 4,
  },
  label: {
    fontSize: 12,
  },
});

export default OrderStatusBadge;
