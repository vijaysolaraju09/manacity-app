import React from 'react';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';

const CartScreen = () => (
  <Screen>
    <ThemedText accessibilityRole="header">Cart</ThemedText>
    <Card>
      <ThemedText>Items added to your cart will appear here.</ThemedText>
    </Card>
  </Screen>
);

export default CartScreen;
