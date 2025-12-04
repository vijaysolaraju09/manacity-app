import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../../components/Screen';
import { ThemedText } from '../../components/Themed';
import { EventCard } from '../../components/events/EventCard';
import { useEvents } from '../../hooks/useEvents';
import { EventsStackParamList } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';

const tabs = [
  { key: 'all', label: 'All' as const },
  { key: 'event', label: 'Events' as const },
  { key: 'tournament', label: 'Tournaments' as const },
  { key: 'registered', label: 'My Registrations' as const },
];

type EventsListProps = NativeStackScreenProps<EventsStackParamList, 'EventsList'>;

const EventsListScreen: React.FC<EventsListProps> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]['key']>('all');
  const theme = useTheme();
  const filters = useMemo(
    () => ({
      category: activeTab === 'registered' ? 'all' : (activeTab as 'all' | 'event' | 'tournament'),
      registeredOnly: activeTab === 'registered',
    }),
    [activeTab],
  );
  const { data, isLoading, refetch, isRefetching } = useEvents(filters);

  const renderTabs = () => (
    <View style={styles.tabRow}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            accessibilityRole="tab"
            onPress={() => setActiveTab(tab.key)}
            style={[
              styles.tab,
              {
                backgroundColor: isActive ? `${theme.colors.primary}10` : theme.colors.surface,
                borderColor: isActive ? theme.colors.primary : theme.colors.border,
              },
            ]}
          >
            <ThemedText style={{ color: isActive ? theme.colors.primary : theme.colors.muted }}>{tab.label}</ThemedText>
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <Screen scroll={false}>
      <ThemedText accessibilityRole="header" style={styles.title}>
        Events & Tournaments
      </ThemedText>
      <ThemedText style={{ color: theme.colors.muted, marginBottom: theme.spacing.md }}>
        Discover experiences across the city. Filter by events, tournaments, or your registrations.
      </ThemedText>
      {renderTabs()}
      {isLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={data || []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventCard event={item} onPress={() => navigation.navigate('EventDetails', { eventId: item.id })} />
          )}
          ListEmptyComponent={
            <ThemedText style={{ color: theme.colors.muted }}>No events in this tab. Check back soon.</ThemedText>
          }
          contentContainerStyle={styles.listContent}
          refreshing={isRefetching}
          onRefresh={refetch}
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    marginBottom: 6,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  listContent: {
    paddingBottom: 32,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default EventsListScreen;
