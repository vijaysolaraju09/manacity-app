import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';
import { useTheme } from '../../context/ThemeContext';

const HelpCenterScreen = () => {
  const theme = useTheme();

  const topics = [
    { title: 'Account & profile', description: 'Update your info, manage roles, and keep your account secure.' },
    { title: 'Orders & services', description: 'Track orders, schedule services, and view past activity.' },
    { title: 'Notifications', description: 'Control alerts, reminders, and announcements from Manacity.' },
  ];

  return (
    <Screen>
      <View style={{ gap: theme.spacing.md }}>
        <ThemedText accessibilityRole="header" style={{ fontSize: 22, fontWeight: '700' }}>
          Help center
        </ThemedText>
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, marginBottom: theme.spacing.sm }}>
            <Ionicons name="chatbubbles" size={24} color={theme.colors.primary} />
            <ThemedText style={{ fontSize: 18, fontWeight: '600' }}>How can we help?</ThemedText>
          </View>
          <ThemedText style={{ marginBottom: theme.spacing.md }}>
            Browse quick answers or reach out to our support team for anything you need.
          </ThemedText>
          <View style={{ gap: theme.spacing.md }}>
            {topics.map((topic) => (
              <View key={topic.title} style={{ gap: 6 }}>
                <ThemedText style={{ fontWeight: '700' }}>{topic.title}</ThemedText>
                <ThemedText style={{ color: theme.colors.muted }}>{topic.description}</ThemedText>
              </View>
            ))}
          </View>
        </Card>
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
            <Ionicons name="mail" size={20} color={theme.colors.primary} />
            <ThemedText>support@manacity.app</ThemedText>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, marginTop: theme.spacing.sm }}>
            <Ionicons name="call" size={20} color={theme.colors.primary} />
            <ThemedText>+1 (800) 555-0199</ThemedText>
          </View>
        </Card>
      </View>
    </Screen>
  );
};

export default HelpCenterScreen;
