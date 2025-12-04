import React from 'react';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';

const BusinessDashboardScreen = () => (
  <Screen>
    <ThemedText accessibilityRole="header">Business Dashboard</ThemedText>
    <Card>
      <ThemedText>Monitor shop performance and manage catalog.</ThemedText>
    </Card>
  </Screen>
);

export default BusinessDashboardScreen;
