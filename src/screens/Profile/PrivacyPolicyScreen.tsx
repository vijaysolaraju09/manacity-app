import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';
import { useTheme } from '../../context/ThemeContext';

const PrivacyPolicyScreen = () => {
  const theme = useTheme();

  const commitments = [
    'We ask only for the permissions required to provide core features.',
    'Your data is encrypted in transit and handled securely.',
    'You control notifications and can delete your account at any time.',
  ];

  return (
    <Screen>
      <View style={{ gap: theme.spacing.md }}>
        <ThemedText accessibilityRole="header" style={{ fontSize: 22, fontWeight: '700' }}>
          Privacy policy
        </ThemedText>
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, marginBottom: theme.spacing.sm }}>
            <Ionicons name="shield-checkmark" size={24} color={theme.colors.primary} />
            <ThemedText style={{ fontSize: 18, fontWeight: '600' }}>Your trust matters</ThemedText>
          </View>
          <ThemedText style={{ marginBottom: theme.spacing.md }}>
            We are committed to being transparent about how data is collected and used across the Manacity experience.
          </ThemedText>
          <View style={{ gap: theme.spacing.sm }}>
            {commitments.map((item) => (
              <View key={item} style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
                <Ionicons name="lock-closed" size={18} color={theme.colors.success} />
                <ThemedText style={{ flex: 1 }}>{item}</ThemedText>
              </View>
            ))}
          </View>
        </Card>
        <Card>
          <ThemedText style={{ fontWeight: '700', marginBottom: theme.spacing.sm }}>Need more details?</ThemedText>
          <ThemedText>
            Contact privacy@manacity.app and we will respond with a copy of our latest data policy.
          </ThemedText>
        </Card>
      </View>
    </Screen>
  );
};

export default PrivacyPolicyScreen;
