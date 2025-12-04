import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { ThemedText } from './Themed';
import { useTheme } from '../context/ThemeContext';

interface Props {
  label: string;
  active?: boolean;
  onPress?: () => void;
}

const RolePill: React.FC<Props> = ({ label, active, onPress }) => {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.pill,
        {
          backgroundColor: active ? theme.colors.primary : theme.colors.card,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <ThemedText style={{ color: active ? '#fff' : theme.colors.text }}>{label}</ThemedText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    marginRight: 8,
  },
});

export default RolePill;
