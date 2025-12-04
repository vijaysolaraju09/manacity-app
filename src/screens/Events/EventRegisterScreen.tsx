import React from 'react';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';

const EventRegisterScreen = () => (
  <Screen>
    <ThemedText accessibilityRole="header">Register</ThemedText>
    <Card>
      <ThemedText>Join the event or tournament with quick registration.</ThemedText>
    </Card>
  </Screen>
);

export default EventRegisterScreen;
