import React from 'react';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';

const CheckoutScreen = () => (
  <Screen>
    <ThemedText accessibilityRole="header">Checkout</ThemedText>
    <Card>
      <ThemedText>Complete your purchase securely.</ThemedText>
    </Card>
  </Screen>
);

export default CheckoutScreen;
