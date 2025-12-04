import React from 'react';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';

const AdminEventsScreen = () => (
  <Screen>
    <ThemedText accessibilityRole="header">Manage Events</ThemedText>
    <Card>
      <ThemedText>Review event proposals and logistics.</ThemedText>
    </Card>
  </Screen>
);

export default AdminEventsScreen;
