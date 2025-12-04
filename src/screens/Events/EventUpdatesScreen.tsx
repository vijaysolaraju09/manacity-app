import React from 'react';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';

const EventUpdatesScreen = () => (
  <Screen>
    <ThemedText accessibilityRole="header">Updates</ThemedText>
    <Card>
      <ThemedText>Follow live updates, announcements, and results.</ThemedText>
    </Card>
  </Screen>
);

export default EventUpdatesScreen;
