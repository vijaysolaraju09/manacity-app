import React from 'react';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';

const AdminDashboardScreen = () => (
  <Screen>
    <ThemedText accessibilityRole="header">Admin Dashboard</ThemedText>
    <Card>
      <ThemedText>Oversee users, shops, services, and events.</ThemedText>
    </Card>
  </Screen>
);

export default AdminDashboardScreen;
