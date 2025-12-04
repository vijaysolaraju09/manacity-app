import React from 'react';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';

const SwitchRoleScreen = () => (
  <Screen>
    <ThemedText accessibilityRole="header">Switch Role</ThemedText>
    <Card>
      <ThemedText>Toggle between customer, business, and admin roles.</ThemedText>
    </Card>
  </Screen>
);

export default SwitchRoleScreen;
