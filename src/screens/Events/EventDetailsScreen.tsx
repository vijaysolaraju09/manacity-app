import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';
import PrimaryButton from '../../components/PrimaryButton';
import { useEventDetails, useEventRegistration, useEventUpdates, useLeaderboard } from '../../hooks/useEvents';
import { EventsStackParamList } from '../../navigation/types';
import { formatEventDateTime, openCalendarSync } from '../../utils/events';
import { useTheme } from '../../context/ThemeContext';
import { UpdatesFeed } from '../../components/events/UpdatesFeed';
import { LeaderboardTable } from '../../components/events/LeaderboardTable';

const TABS = {
  overview: 'Overview',
  updates: 'Updates',
  leaderboard: 'Leaderboard',
} as const;

type EventDetailsProps = NativeStackScreenProps<EventsStackParamList, 'EventDetails'>;

const EventDetailsScreen: React.FC<EventDetailsProps> = ({ route, navigation }) => {
  const { eventId } = route.params;
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<keyof typeof TABS>('overview');
  const { data: event, isLoading } = useEventDetails(eventId);
  const { register, unregister } = useEventRegistration(eventId);
  const updatesQuery = useEventUpdates(eventId, event?.isRegistered);
  const leaderboardQuery = useLeaderboard(eventId, event?.category === 'tournament' && event?.isRegistered);

  useEffect(() => {
    if (event?.isRegistered && activeTab === 'overview') {
      setActiveTab('updates');
    }
  }, [event?.isRegistered, activeTab]);

  const countdown = useMemo(() => {
    if (!event) return null;
    const start = new Date(event.startsAt).getTime();
    const delta = Math.max(0, start - Date.now());
    const hours = Math.floor(delta / (1000 * 60 * 60));
    const minutes = Math.floor((delta / (1000 * 60)) % 60);
    const seconds = Math.floor((delta / 1000) % 60);
    return `${hours}h ${minutes}m ${seconds}s`;
  }, [event]);

  const handleRegisterToggle = () => {
    if (!event) return;
    if (event.isRegistered) {
      unregister.mutate();
    } else {
      register.mutate(event.remindersEnabled);
    }
  };

  const handleCalendarSync = async () => {
    if (!event) return;
    try {
      await openCalendarSync(event);
      Toast.show({ type: 'success', text1: 'Calendar synced', text2: 'We added the event to your calendar.' });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Calendar error', text2: 'Unable to open your calendar app.' });
    }
  };

  const renderOverview = () => (
    <View style={{ gap: 12 }}>
      <Card>
        <ThemedText style={styles.sectionTitle}>Schedule</ThemedText>
        {event?.schedule.map((item) => (
          <View key={item.time} style={styles.listRow}>
            <ThemedText style={styles.listTime}>{item.time}</ThemedText>
            <View style={{ flex: 1 }}>
              <ThemedText style={styles.listTitle}>{item.title}</ThemedText>
              {item.description && <ThemedText style={{ color: theme.colors.muted }}>{item.description}</ThemedText>}
            </View>
          </View>
        ))}
      </Card>
      <Card>
        <ThemedText style={styles.sectionTitle}>Rules</ThemedText>
        <ThemedText style={{ color: theme.colors.muted, marginBottom: 8 }}>{event?.rules.title}</ThemedText>
        {event?.rules.details.map((rule) => (
          <View key={rule} style={styles.bulletRow}>
            <ThemedText style={styles.bullet}>•</ThemedText>
            <ThemedText style={{ flex: 1 }}>{rule}</ThemedText>
          </View>
        ))}
      </Card>
    </View>
  );

  const renderUpdates = () => {
    if (!event?.isRegistered) {
      return <Card><ThemedText style={{ color: theme.colors.muted }}>Register to unlock real-time updates.</ThemedText></Card>;
    }
    if (updatesQuery.isLoading) {
      return <ActivityIndicator color={theme.colors.primary} />;
    }
    return <UpdatesFeed eventId={eventId} updates={updatesQuery.data || []} />;
  };

  const renderLeaderboard = () => {
    if (event?.category !== 'tournament') {
      return <Card><ThemedText style={{ color: theme.colors.muted }}>Leaderboard available only for tournaments.</ThemedText></Card>;
    }
    if (!event?.isRegistered) {
      return <Card><ThemedText style={{ color: theme.colors.muted }}>Register to view the tournament leaderboard.</ThemedText></Card>;
    }
    if (leaderboardQuery.isLoading) {
      return <ActivityIndicator color={theme.colors.primary} />;
    }
    return <LeaderboardTable entries={leaderboardQuery.data || []} />;
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
      <Image source={{ uri: event.image }} style={styles.banner} />
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <ThemedText style={styles.title}>{event.title}</ThemedText>
          <ThemedText style={{ color: theme.colors.muted }}>{formatEventDateTime(event.startsAt, event.endsAt)}</ThemedText>
          <ThemedText style={{ color: theme.colors.muted }}>{event.location}</ThemedText>
        </View>
        <Card style={styles.countdownCard}>
          <ThemedText style={styles.countdownLabel}>Starts in</ThemedText>
          <ThemedText style={styles.countdownValue}>{countdown}</ThemedText>
        </Card>
      </View>

      <Card>
        <ThemedText style={styles.sectionTitle}>About</ThemedText>
        <ThemedText style={{ color: theme.colors.muted }}>{event.description}</ThemedText>
      </Card>

      <View style={styles.actionRow}>
        <PrimaryButton
          title={event.isRegistered ? 'Cancel registration' : 'Register'}
          onPress={handleRegisterToggle}
          loading={register.isPending || unregister.isPending}
          style={{ flex: 1 }}
        />
        <Pressable style={[styles.iconButton, { borderColor: theme.colors.border }]} onPress={handleCalendarSync}>
          <Ionicons name="calendar" size={22} color={theme.colors.text} />
        </Pressable>
      </View>
      <Pressable onPress={() => navigation.navigate('EventRegister', { eventId })}>
        <ThemedText style={{ color: theme.colors.primary, textDecorationLine: 'underline' }}>
          Manage reminders and calendar sync
        </ThemedText>
      </Pressable>

      <View style={styles.tabRow}>
        <Pressable
          accessibilityRole="tab"
          onPress={() => setActiveTab('overview')}
          style={[styles.tab, activeTab === 'overview' && { borderColor: theme.colors.primary }]}
        >
          <ThemedText style={{ color: activeTab === 'overview' ? theme.colors.primary : theme.colors.muted }}>
            {TABS.overview}
          </ThemedText>
        </Pressable>
        {event.isRegistered && (
          <Pressable
            accessibilityRole="tab"
            onPress={() => setActiveTab('updates')}
            style={[styles.tab, activeTab === 'updates' && { borderColor: theme.colors.primary }]}
          >
            <ThemedText style={{ color: activeTab === 'updates' ? theme.colors.primary : theme.colors.muted }}>
              {TABS.updates}
            </ThemedText>
          </Pressable>
        )}
        {event.category === 'tournament' && event.isRegistered && (
          <Pressable
            accessibilityRole="tab"
            onPress={() => setActiveTab('leaderboard')}
            style={[styles.tab, activeTab === 'leaderboard' && { borderColor: theme.colors.primary }]}
          >
            <ThemedText style={{ color: activeTab === 'leaderboard' ? theme.colors.primary : theme.colors.muted }}>
              {TABS.leaderboard}
            </ThemedText>
          </Pressable>
        )}
      </View>

      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'updates' && renderUpdates()}
      {activeTab === 'leaderboard' && renderLeaderboard()}
    </Screen>
  );
};

const styles = StyleSheet.create({
  banner: {
    height: 220,
    borderRadius: 16,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    marginBottom: 4,
  },
  countdownCard: {
    padding: 12,
    borderRadius: 12,
    minWidth: 110,
    alignItems: 'center',
  },
  countdownLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  countdownValue: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 8,
  },
  listRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  listTime: {
    fontFamily: 'Inter_600SemiBold',
    width: 80,
  },
  listTitle: {
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 2,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 4,
  },
  bullet: {
    color: '#475569',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 12,
  },
  iconButton: {
    width: 52,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
});

export default EventDetailsScreen;
