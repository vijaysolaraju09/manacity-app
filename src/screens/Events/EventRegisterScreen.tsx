import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Switch, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';
import PrimaryButton from '../../components/PrimaryButton';
import { useEventDetails, useEventRegistration } from '../../hooks/useEvents';
import { EventsStackParamList } from '../../navigation/types';
import { formatEventDateTime, openCalendarSync } from '../../utils/events';
import { useTheme } from '../../context/ThemeContext';

type EventRegisterProps = NativeStackScreenProps<EventsStackParamList, 'EventRegister'>;

const EventRegisterScreen: React.FC<EventRegisterProps> = ({ route }) => {
  const { eventId } = route.params;
  const theme = useTheme();
  const { data: event, isLoading } = useEventDetails(eventId);
  const { register, unregister } = useEventRegistration(eventId);
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  useEffect(() => {
    if (event?.remindersEnabled !== undefined) {
      setRemindersEnabled(event.remindersEnabled);
    }
  }, [event?.remindersEnabled]);

  const handleCalendar = async () => {
    if (!event) return;
    try {
      await openCalendarSync(event);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Could not open calendar' });
    }
  };

  const handleSubmit = () => {
    if (!event) return;
    if (event.isRegistered) {
      unregister.mutate();
    } else {
      register.mutate(remindersEnabled);
    }
  };

  if (isLoading || !event) {
    return (
      <Screen>
        <ActivityIndicator color={theme.colors.primary} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Card style={styles.heroCard}>
        <ThemedText style={styles.title}>{event.title}</ThemedText>
        <ThemedText style={{ color: theme.colors.muted }}>{formatEventDateTime(event.startsAt, event.endsAt)}</ThemedText>
        <ThemedText style={{ color: theme.colors.muted }}>{event.location}</ThemedText>
      </Card>

      <Card>
        <ThemedText style={styles.sectionTitle}>Registration</ThemedText>
        <ThemedText style={{ color: theme.colors.muted, marginBottom: 12 }}>
          Secure your spot and receive reminders before the event starts.
        </ThemedText>
        <View style={styles.row}>
          <ThemedText style={{ flex: 1 }}>Enable reminders</ThemedText>
          <Switch value={remindersEnabled} onValueChange={setRemindersEnabled} thumbColor={theme.colors.primary} />
        </View>
        <View style={styles.row}>
          <ThemedText style={{ flex: 1 }}>Calendar sync</ThemedText>
          <Pressable onPress={handleCalendar} style={[styles.iconButton, { borderColor: theme.colors.border }]}>
            <Ionicons name="calendar" size={20} color={theme.colors.text} />
          </Pressable>
        </View>
        <PrimaryButton
          title={event.isRegistered ? 'Cancel registration' : 'Confirm registration'}
          onPress={handleSubmit}
          loading={register.isPending || unregister.isPending}
          style={{ marginTop: 12 }}
        />
      </Card>

      {event.isRegistered && (
        <Card>
          <ThemedText style={styles.sectionTitle}>My registration</ThemedText>
          <ThemedText style={{ color: theme.colors.muted }}>
            You are registered and will receive notifications for schedule changes and updates.
          </ThemedText>
        </Card>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  heroCard: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});

export default EventRegisterScreen;
