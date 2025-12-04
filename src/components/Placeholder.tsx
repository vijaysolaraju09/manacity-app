import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, ThemedText } from './Themed';
import { useTheme } from '../context/ThemeContext';

interface PlaceholderProps {
  title: string;
  description: string;
  actions?: string[];
  footnote?: string;
}

export const Placeholder: React.FC<PlaceholderProps> = ({ title, description, actions, footnote }) => {
  const theme = useTheme();

  return (
    <Card>
      <View style={styles.header}>
        <ThemedText style={[styles.title, { color: theme.colors.text, fontFamily: theme.typography.semiBold.fontFamily }]}> 
          {title}
        </ThemedText>
      </View>
      <ThemedText style={{ color: theme.colors.muted }}>{description}</ThemedText>
      {actions && (
        <View style={styles.actions}>
          {actions.map((action) => (
            <ThemedText key={action} style={{ color: theme.colors.primary }}>
              • {action}
            </ThemedText>
          ))}
        </View>
      )}
      {footnote ? <ThemedText style={{ marginTop: theme.spacing.sm, color: theme.colors.muted }}>{footnote}</ThemedText> : null}
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
  },
  actions: {
    marginTop: 8,
    gap: 4,
  },
});

export default Placeholder;
