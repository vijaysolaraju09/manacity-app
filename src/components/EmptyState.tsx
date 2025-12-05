import React from 'react';
import { StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';
import { ThemedText } from './Themed';
import PrimaryButton from './PrimaryButton';
import { useTheme } from '../context/ThemeContext';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onActionPress?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, actionLabel, onActionPress }) => {
  const theme = useTheme();
  return (
    <View style={[styles.container, { padding: theme.spacing.lg }]}> 
      <LottieView
        source={{ uri: 'https://assets9.lottiefiles.com/packages/lf20_q5pk6p1k.json' }}
        autoPlay
        loop
        style={styles.lottie}
      />
      <ThemedText style={styles.title} accessibilityRole="header">
        {title}
      </ThemedText>
      <ThemedText style={styles.description}>{description}</ThemedText>
      {actionLabel && onActionPress ? (
        <PrimaryButton accessibilityLabel={actionLabel} text={actionLabel} onPress={onActionPress} style={styles.button} />
      ) : null}
    </View>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  lottie: {
    width: 220,
    height: 220,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
  description: {
    textAlign: 'center',
  },
  button: {
    minWidth: 160,
    alignSelf: 'center',
  },
});
