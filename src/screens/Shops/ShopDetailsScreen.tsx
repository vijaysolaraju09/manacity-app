import React from 'react';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';

const ShopDetailsScreen = () => (
  <Screen>
    <ThemedText accessibilityRole="header">Shop Details</ThemedText>
    <Card>
      <ThemedText>View shop info, reviews, and featured items.</ThemedText>
    </Card>
  </Screen>
);

export default ShopDetailsScreen;
