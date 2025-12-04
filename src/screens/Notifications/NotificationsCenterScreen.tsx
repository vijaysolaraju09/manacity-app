import React from 'react';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';

const NotificationsCenterScreen = () => (
  <Screen>
    <ThemedText accessibilityRole="header">Notifications</ThemedText>
    <Card>
      <ThemedText>Review alerts, announcements, and updates.</ThemedText>
    </Card>
  </Screen>
);

export default NotificationsCenterScreen;
