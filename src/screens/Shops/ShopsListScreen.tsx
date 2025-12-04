import React from 'react';
import { Screen } from '../../components/Screen';
import { ThemedText, Card } from '../../components/Themed';

const ShopsListScreen = () => (
  <Screen>
    <ThemedText accessibilityRole="header">Shops</ThemedText>
    <Card>
      <ThemedText>Browse nearby shops and categories.</ThemedText>
    </Card>
  </Screen>
);

export default ShopsListScreen;
