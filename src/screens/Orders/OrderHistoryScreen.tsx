import React from 'react';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';

const OrderHistoryScreen = () => (
  <Screen>
    <ThemedText accessibilityRole="header">Order History</ThemedText>
    <Card>
      <ThemedText>Browse your past purchases and reorder favorites.</ThemedText>
    </Card>
  </Screen>
);

export default OrderHistoryScreen;
