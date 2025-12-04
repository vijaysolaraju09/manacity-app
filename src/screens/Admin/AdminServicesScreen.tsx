import React from 'react';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';

const AdminServicesScreen = () => (
  <Screen>
    <ThemedText accessibilityRole="header">Manage Services</ThemedText>
    <Card>
      <ThemedText>Moderate services and provider eligibility.</ThemedText>
    </Card>
  </Screen>
);

export default AdminServicesScreen;
