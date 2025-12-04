import React from 'react';
import { ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';
import { UpdatesFeed } from '../../components/events/UpdatesFeed';
import { useEventDetails, useEventUpdates } from '../../hooks/useEvents';
import { EventsStackParamList } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';

type EventUpdatesProps = NativeStackScreenProps<EventsStackParamList, 'EventUpdates'>;

const EventUpdatesScreen: React.FC<EventUpdatesProps> = ({ route }) => {
  const { eventId } = route.params;
  const theme = useTheme();
  const { data: event } = useEventDetails(eventId);
  const updatesQuery = useEventUpdates(eventId, event?.isRegistered);

  if (!event) {
    return (
      <Screen>
        <ActivityIndicator color={theme.colors.primary} />
      </Screen>
    );
  }

  if (!event.isRegistered) {
    return (
      <Screen>
        <Card>
          <ThemedText style={{ color: theme.colors.muted }}>
            Register for the event to see live updates and announcements.
          </ThemedText>
        </Card>
      </Screen>
    );
  }

  if (updatesQuery.isLoading) {
    return (
      <Screen>
        <ActivityIndicator color={theme.colors.primary} />
      </Screen>
    );
  }

  return (
    <Screen>
      <UpdatesFeed eventId={eventId} updates={updatesQuery.data || []} />
    </Screen>
  );
};

export default EventUpdatesScreen;
