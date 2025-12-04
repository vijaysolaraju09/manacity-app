import React from 'react';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';

const EventsListScreen = () => (
  <Screen>
    <ThemedText accessibilityRole="header">Events & Tournaments</ThemedText>
    <Card>
      <ThemedText>Discover upcoming events and tournaments.</ThemedText>
    </Card>
  </Screen>
);

export default EventsListScreen;
