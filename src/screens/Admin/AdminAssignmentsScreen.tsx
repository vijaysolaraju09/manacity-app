import React from 'react';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';

const AdminAssignmentsScreen = () => (
  <Screen>
    <ThemedText accessibilityRole="header">Assignments</ThemedText>
    <Card>
      <ThemedText>Assign responsibilities to team members.</ThemedText>
    </Card>
  </Screen>
);

export default AdminAssignmentsScreen;
