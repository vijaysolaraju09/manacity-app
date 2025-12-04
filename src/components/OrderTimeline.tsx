import React from 'react';
import { View, StyleSheet } from 'react-native';
import { OrderTimelineEntry } from '../types/orders';
import { getStatusColor, getStatusLabel, formatDateTime } from '../utils/orders';
import { ThemedText } from './Themed';

interface Props {
  timeline?: OrderTimelineEntry[];
}

const OrderTimeline: React.FC<Props> = ({ timeline }) => {
  if (!timeline?.length) return null;

  return (
    <View style={styles.container}>
      {timeline.map((entry, index) => {
        const color = getStatusColor(entry.status);
        const isLast = index === timeline.length - 1;
        return (
          <View key={`${entry.status}-${entry.timestamp}`} style={styles.row}>
            <View style={styles.iconColumn}>
              <View style={[styles.dot, { borderColor: color.text, backgroundColor: color.background }]} />
              {!isLast && <View style={[styles.line, { borderColor: color.border }]} />}
            </View>
            <View style={styles.content}>
              <ThemedText style={[styles.title, { color: color.text }]}>{getStatusLabel(entry.status)}</ThemedText>
              <ThemedText style={styles.timestamp}>{formatDateTime(entry.timestamp)}</ThemedText>
              {entry.note ? <ThemedText style={styles.note}>{entry.note}</ThemedText> : null}
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  row: {
    flexDirection: 'row',
  },
  iconColumn: {
    width: 26,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingBottom: 12,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  line: {
    flex: 1,
    borderLeftWidth: 1,
    marginTop: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
    color: '#667085',
    marginTop: 2,
  },
  note: {
    marginTop: 4,
    color: '#4B5563',
  },
});

export default OrderTimeline;
