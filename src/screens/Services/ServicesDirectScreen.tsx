import React from 'react';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';

const ServicesDirectScreen = () => (
  <Screen>
    <ThemedText accessibilityRole="header">Direct Services</ThemedText>
    <Card>
      <ThemedText>Connect directly with providers for on-demand help.</ThemedText>
    </Card>
  </Screen>
);

export default ServicesDirectScreen;
