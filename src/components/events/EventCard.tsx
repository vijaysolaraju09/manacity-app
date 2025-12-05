import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Event } from '../../types/events';
import { ThemedText } from '../Themed';
import { useTheme } from '../../context/ThemeContext';
import { formatEventDateTime } from '../../utils/events';
import { ShimmerImage } from '../loading/ShimmerImage';

interface Props {
  event: Event;
  onPress: () => void;
}

export const EventCard: React.FC<Props> = ({ event, onPress }) => {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.card, { backgroundColor: theme.colors.surface, opacity: pressed ? 0.96 : 1 }]}
    >
      <ShimmerImage
        source={{ uri: event.image }}
        style={styles.image}
        accessibilityLabel={`${event.title} banner`}
        accessibilityIgnoresInvertColors
      />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <ThemedText style={styles.title}>{event.title}</ThemedText>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: event.category === 'tournament' ? theme.colors.accent : theme.colors.secondary,
              },
            ]}
          >
            <ThemedText style={styles.badgeText}>{event.category === 'tournament' ? 'Tournament' : 'Event'}</ThemedText>
          </View>
        </View>
        <ThemedText style={[styles.meta, { color: theme.colors.muted }]}>{formatEventDateTime(event.startsAt, event.endsAt)}</ThemedText>
        <ThemedText style={[styles.meta, { color: theme.colors.muted }]}>{event.location}</ThemedText>
        {event.isRegistered && (
          <View style={[styles.statusPill, { backgroundColor: `${theme.colors.primary}15`, borderColor: theme.colors.primary }]}> 
            <ThemedText style={[styles.statusText, { color: theme.colors.primary }]}>Registered</ThemedText>
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  image: {
    height: 160,
    width: '100%',
  },
  content: {
    padding: 16,
    gap: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    color: '#0F172A',
    fontFamily: 'Inter_600SemiBold',
  },
  meta: {
    fontSize: 14,
  },
  statusPill: {
    marginTop: 6,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
});
