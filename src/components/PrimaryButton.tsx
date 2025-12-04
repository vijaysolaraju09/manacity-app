import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { ThemedText } from './Themed';

interface Props {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

const PrimaryButton: React.FC<Props> = ({ title, onPress, disabled, loading, style }) => {
  const theme = useTheme();
  const isDisabled = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: isDisabled ? theme.colors.muted : theme.colors.primary,
          opacity: pressed ? 0.9 : 1,
        },
        style,
      ]}
      disabled={isDisabled}
    >
      {loading ? <ActivityIndicator color="#fff" /> : <ThemedText style={styles.label}>{title}</ThemedText>}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  label: {
    color: '#fff',
    fontSize: 16,
  },
});

export default PrimaryButton;
