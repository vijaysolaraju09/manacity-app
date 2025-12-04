import React from 'react';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';

const EventDetailsScreen = () => (
  <Screen>
    <ThemedText accessibilityRole="header">Event Details</ThemedText>
    <Card>
      <ThemedText>Review event schedule, rules, and prizes.</ThemedText>
    </Card>
  </Screen>
);

export default EventDetailsScreen;
