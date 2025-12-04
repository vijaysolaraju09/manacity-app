import React from 'react';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';

const ProductsScreen = () => (
  <Screen>
    <ThemedText accessibilityRole="header">Products</ThemedText>
    <Card>
      <ThemedText>Explore products offered by this shop.</ThemedText>
    </Card>
  </Screen>
);

export default ProductsScreen;
