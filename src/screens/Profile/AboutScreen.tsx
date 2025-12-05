import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';
import { useTheme } from '../../context/ThemeContext';

const AboutScreen = () => {
  const theme = useTheme();

  const highlights = [
    'Connecting shoppers, businesses, and admins with one responsive experience.',
    'Curated services and events to keep the community engaged.',
    'Privacy-first foundation with transparent policies.',
  ];

  return (
    <Screen>
      <View style={{ gap: theme.spacing.md }}>
        <ThemedText accessibilityRole="header" style={{ fontSize: 22, fontWeight: '700' }}>
          About Manacity
        </ThemedText>
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, marginBottom: theme.spacing.sm }}>
            <Ionicons name="sparkles" size={24} color={theme.colors.primary} />
            <ThemedText style={{ fontSize: 18, fontWeight: '600' }}>Built for vibrant commerce</ThemedText>
          </View>
          <ThemedText style={{ marginBottom: theme.spacing.md }}>
            Manacity helps residents discover shops, services, and events while empowering local businesses and admins with the
            tools they need to thrive.
          </ThemedText>
          <View style={{ gap: theme.spacing.sm }}>
            {highlights.map((item) => (
              <View key={item} style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
                <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
                <ThemedText style={{ flex: 1 }}>{item}</ThemedText>
              </View>
            ))}
          </View>
        </Card>
        <Card>
          <ThemedText style={{ fontSize: 16, fontWeight: '600', marginBottom: theme.spacing.sm }}>Version</ThemedText>
          <ThemedText>v1.0.0 · Experience the latest marketplace improvements.</ThemedText>
        </Card>
      </View>
    </Screen>
  );
};

export default AboutScreen;
