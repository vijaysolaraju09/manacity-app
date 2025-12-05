import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, ThemedText } from '../Themed';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  label: string;
  value: string | number;
  helper?: string;
  accent?: string;
}

const AdminStatCard: React.FC<Props> = ({ label, value, helper, accent }) => {
  const theme = useTheme();
  return (
    <Card style={[styles.card, { borderColor: accent || theme.colors.border }]}> 
      <View style={styles.headerRow}>
        <ThemedText style={styles.label}>{label}</ThemedText>
        {accent ? <View style={[styles.dot, { backgroundColor: accent }]} /> : null}
      </View>
      <ThemedText style={[styles.value, { color: theme.colors.text }]}>{value}</ThemedText>
      {helper ? <ThemedText style={[styles.helper, { color: theme.colors.muted }]}>{helper}</ThemedText> : null}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 14,
    gap: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  value: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
  },
  helper: {
    fontSize: 13,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
});

export default AdminStatCard;
