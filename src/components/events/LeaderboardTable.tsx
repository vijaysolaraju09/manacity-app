import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LeaderboardEntry } from '../../types/events';
import { ThemedText, Card } from '../Themed';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  entries: LeaderboardEntry[];
}

export const LeaderboardTable: React.FC<Props> = ({ entries }) => {
  const theme = useTheme();
  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <ThemedText style={[styles.header, { color: theme.colors.muted }]}>Rank</ThemedText>
        <ThemedText style={[styles.header, { flex: 2, color: theme.colors.muted }]}>Name</ThemedText>
        <ThemedText style={[styles.header, { color: theme.colors.muted }]}>Score</ThemedText>
      </View>
      {entries.map((entry) => (
        <View key={entry.id} style={styles.row}>
          <ThemedText style={styles.cell}>#{entry.rank}</ThemedText>
          <ThemedText style={[styles.cell, { flex: 2 }]}>{entry.name}</ThemedText>
          <ThemedText style={[styles.cell, { textAlign: 'right' }]}>{entry.score}</ThemedText>
        </View>
      ))}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 12,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  cell: {
    fontSize: 14,
  },
});
