import React, { ReactNode } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
  refreshControl?: React.ReactElement;
}

export const Screen: React.FC<ScreenProps> = ({ children, scroll = true, style, refreshControl }) => {
  const theme = useTheme();
  const content = scroll ? (
    <ScrollView refreshControl={refreshControl} contentContainerStyle={[styles.content, { padding: theme.spacing.lg }, style]}>
      {children}
    </ScrollView>
  ) : (
    <SafeAreaView style={[styles.content, { padding: theme.spacing.lg }, style]}>{children}</SafeAreaView>
  );
  return <SafeAreaView style={[styles.root, { backgroundColor: theme.colors.background }]}>{content}</SafeAreaView>;
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
});
