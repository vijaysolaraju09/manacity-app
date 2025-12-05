import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '../Themed';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  label: string;
  tone?: 'success' | 'warning' | 'info' | 'danger';
}

const toneMap: Record<NonNullable<Props['tone']>, string> = {
  success: '#1F9D55',
  warning: '#DC6B05',
  info: '#2563EB',
  danger: '#DC2626',
};

const AdminBadge: React.FC<Props> = ({ label, tone = 'info' }) => {
  const theme = useTheme();
  return (
    <View style={[styles.badge, { backgroundColor: `${toneMap[tone]}14`, borderColor: toneMap[tone] }]}> 
      <ThemedText style={{ color: toneMap[tone], fontSize: 12, fontFamily: theme.typography.medium.fontFamily }}>
        {label}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
  },
});

export default AdminBadge;
