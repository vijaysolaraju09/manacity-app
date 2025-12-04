import React from 'react';
import { View } from 'react-native';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';
import PrimaryButton from '../../components/PrimaryButton';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';

const ProfileSettingsScreen = () => {
  const { logout } = useAuth();
  const theme = useTheme();

  return (
    <Screen>
      <ThemedText accessibilityRole="header" style={{ fontSize: 22, fontWeight: '700' }}>
        Settings
      </ThemedText>
      <Card>
        <View style={{ gap: theme.spacing.sm }}>
          <ThemedText>Manage security, notifications, and preferences.</ThemedText>
          <PrimaryButton title="Logout securely" onPress={logout} />
        </View>
      </Card>
    </Screen>
  );
};

export default ProfileSettingsScreen;
