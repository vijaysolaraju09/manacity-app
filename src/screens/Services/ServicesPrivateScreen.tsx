import React from 'react';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';

const ServicesPrivateScreen = () => (
  <Screen>
    <ThemedText accessibilityRole="header">Private Services</ThemedText>
    <Card>
      <ThemedText>Access private services tailored to your account.</ThemedText>
    </Card>
  </Screen>
);

export default ServicesPrivateScreen;
