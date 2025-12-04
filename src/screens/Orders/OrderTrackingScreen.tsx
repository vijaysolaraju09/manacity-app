import React from 'react';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';

const OrderTrackingScreen = () => (
  <Screen>
    <ThemedText accessibilityRole="header">Order Tracking</ThemedText>
    <Card>
      <ThemedText>Track delivery status and driver updates.</ThemedText>
    </Card>
  </Screen>
);

export default OrderTrackingScreen;
