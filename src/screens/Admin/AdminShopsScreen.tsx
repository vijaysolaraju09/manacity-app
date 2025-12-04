import React from 'react';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';

const AdminShopsScreen = () => (
  <Screen>
    <ThemedText accessibilityRole="header">Manage Shops</ThemedText>
    <Card>
      <ThemedText>Approve shop listings and verify compliance.</ThemedText>
    </Card>
  </Screen>
);

export default AdminShopsScreen;
