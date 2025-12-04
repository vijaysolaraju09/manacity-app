import React from 'react';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';

const ServicesOffersScreen = () => (
  <Screen>
    <ThemedText accessibilityRole="header">Service Offers</ThemedText>
    <Card>
      <ThemedText>Find limited-time offers and packages.</ThemedText>
    </Card>
  </Screen>
);

export default ServicesOffersScreen;
