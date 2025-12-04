import React from 'react';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';

const ManageProductsScreen = () => (
  <Screen>
    <ThemedText accessibilityRole="header">Manage Products</ThemedText>
    <Card>
      <ThemedText>Create, update, or remove products.</ThemedText>
    </Card>
  </Screen>
);

export default ManageProductsScreen;
