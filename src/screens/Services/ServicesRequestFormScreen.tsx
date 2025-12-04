import React from 'react';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';

const ServicesRequestFormScreen = () => (
  <Screen>
    <ThemedText accessibilityRole="header">Service Request</ThemedText>
    <Card>
      <ThemedText>Submit a request describing the service you need.</ThemedText>
    </Card>
  </Screen>
);

export default ServicesRequestFormScreen;
