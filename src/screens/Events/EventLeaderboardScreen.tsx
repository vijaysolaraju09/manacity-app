import React from 'react';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';

const EventLeaderboardScreen = () => (
  <Screen>
    <ThemedText accessibilityRole="header">Leaderboard</ThemedText>
    <Card>
      <ThemedText>Track rankings and performance in real time.</ThemedText>
    </Card>
  </Screen>
);

export default EventLeaderboardScreen;
