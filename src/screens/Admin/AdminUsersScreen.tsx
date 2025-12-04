import React from 'react';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';

const AdminUsersScreen = () => (
  <Screen>
    <ThemedText accessibilityRole="header">Manage Users</ThemedText>
    <Card>
      <ThemedText>Review registrations, permissions, and roles.</ThemedText>
    </Card>
  </Screen>
);

export default AdminUsersScreen;
