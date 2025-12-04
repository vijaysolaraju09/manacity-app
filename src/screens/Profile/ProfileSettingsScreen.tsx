import React from 'react';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';

const ProfileSettingsScreen = () => (
  <Screen>
    <ThemedText accessibilityRole="header">Settings</ThemedText>
    <Card>
      <ThemedText>Manage security, notifications, and preferences.</ThemedText>
    </Card>
  </Screen>
);

export default ProfileSettingsScreen;
