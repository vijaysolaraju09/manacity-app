import React from 'react';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';

const ManageOrdersScreen = () => (
  <Screen>
    <ThemedText accessibilityRole="header">Manage Orders</ThemedText>
    <Card>
      <ThemedText>Handle incoming orders, statuses, and fulfilment.</ThemedText>
    </Card>
  </Screen>
);

export default ManageOrdersScreen;
