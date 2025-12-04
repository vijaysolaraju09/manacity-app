import React from 'react';
import { ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';
import { LeaderboardTable } from '../../components/events/LeaderboardTable';
import { useEventDetails, useLeaderboard } from '../../hooks/useEvents';
import { EventsStackParamList } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';

type EventLeaderboardProps = NativeStackScreenProps<EventsStackParamList, 'EventLeaderboard'>;

const EventLeaderboardScreen: React.FC<EventLeaderboardProps> = ({ route }) => {
  const { eventId } = route.params;
  const theme = useTheme();
  const { data: event } = useEventDetails(eventId);
  const leaderboardQuery = useLeaderboard(eventId, event?.isRegistered && event?.category === 'tournament');

  if (!event) {
    return (
      <Screen>
        <ActivityIndicator color={theme.colors.primary} />
      </Screen>
    );
  }

  if (event.category !== 'tournament') {
    return (
      <Screen>
        <Card>
          <ThemedText style={{ color: theme.colors.muted }}>Leaderboard is available only for tournaments.</ThemedText>
        </Card>
      </Screen>
    );
  }

  if (!event.isRegistered) {
    return (
      <Screen>
        <Card>
          <ThemedText style={{ color: theme.colors.muted }}>
            Register to unlock the tournament leaderboard and track standings.
          </ThemedText>
        </Card>
      </Screen>
    );
  }

  if (leaderboardQuery.isLoading) {
    return (
      <Screen>
        <ActivityIndicator color={theme.colors.primary} />
      </Screen>
    );
  }

  return (
    <Screen>
      <LeaderboardTable entries={leaderboardQuery.data || []} />
    </Screen>
  );
};

export default EventLeaderboardScreen;
