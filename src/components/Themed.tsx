import React from 'react';
import { Text, TextProps, View, ViewProps, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export const ThemedView: React.FC<ViewProps> = ({ style, ...rest }) => {
  const theme = useTheme();
  return <View style={[{ backgroundColor: theme.colors.background }, style]} {...rest} />;
};

export const Card: React.FC<ViewProps> = ({ style, ...rest }) => {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderRadius: theme.roundness },
        style,
      ]}
      {...rest}
    />
  );
};

export const ThemedText: React.FC<TextProps> = ({ style, ...rest }) => {
  const theme = useTheme();
  return <Text style={[styles.text, { color: theme.colors.text, fontFamily: theme.typography.regular.fontFamily }, style]} {...rest} />;
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 1,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2,
  },
  text: {
    fontSize: 16,
  },
});
