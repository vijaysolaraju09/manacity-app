import React from 'react';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';

const ServicesPublicScreen = () => (
  <Screen>
    <ThemedText accessibilityRole="header">Public Services</ThemedText>
    <Card>
      <ThemedText>Discover public services offered to all users.</ThemedText>
    </Card>
  </Screen>
);

export default ServicesPublicScreen;
