import React from 'react';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';

const ManageShopScreen = () => (
  <Screen>
    <ThemedText accessibilityRole="header">Manage Shop</ThemedText>
    <Card>
      <ThemedText>Update storefront information and availability.</ThemedText>
    </Card>
  </Screen>
);

export default ManageShopScreen;
