import React from 'react';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';

const OrderDetailsScreen = () => (
  <Screen>
    <ThemedText accessibilityRole="header">Order Details</ThemedText>
    <Card>
      <ThemedText>Review your order items, payment, and delivery details.</ThemedText>
    </Card>
  </Screen>
);

export default OrderDetailsScreen;
