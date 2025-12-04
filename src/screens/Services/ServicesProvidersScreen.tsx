import React from 'react';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';

const ServicesProvidersScreen = () => (
  <Screen>
    <ThemedText accessibilityRole="header">Service Providers</ThemedText>
    <Card>
      <ThemedText>Browse professionals and partners offering services.</ThemedText>
    </Card>
  </Screen>
);

export default ServicesProvidersScreen;
