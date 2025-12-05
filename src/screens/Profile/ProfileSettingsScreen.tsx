import React, { useState } from 'react';
import { Pressable, Switch, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';
import PrimaryButton from '../../components/PrimaryButton';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';

const SettingsRow: React.FC<{
  label: string;
  description?: string;
  children: React.ReactNode;
}> = ({ label, description, children }) => {
  const theme = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: theme.spacing.sm }}>
      <View style={{ flex: 1, paddingRight: theme.spacing.sm }}>
        <ThemedText style={{ fontWeight: '600' }}>{label}</ThemedText>
        {description ? <ThemedText style={{ color: theme.colors.muted }}>{description}</ThemedText> : null}
      </View>
      {children}
    </View>
  );
};

const LanguagePill: React.FC<{ label: string; active?: boolean; onPress: () => void }> = ({ label, active, onPress }) => {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: active ? theme.colors.primary : theme.colors.border,
        backgroundColor: active ? theme.colors.primary + '12' : theme.colors.surface,
      }}
    >
      <ThemedText style={{ color: active ? theme.colors.primary : theme.colors.text }}>{label}</ThemedText>
    </Pressable>
  );
};

const ProfileSettingsScreen = () => {
  const { logout } = useAuth();
  const theme = useTheme();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [language, setLanguage] = useState('English');

  return (
    <Screen>
      <ThemedText accessibilityRole="header" style={{ fontSize: 22, fontWeight: '700' }}>
        Settings
      </ThemedText>
      <Card>
        <ThemedText style={{ fontSize: 16, fontWeight: '700', marginBottom: theme.spacing.sm }}>
          Notification preferences
        </ThemedText>
        <SettingsRow label="Push" description="Service updates, reminders, and alerts on this device.">
          <Switch value={pushEnabled} onValueChange={setPushEnabled} thumbColor={theme.colors.primary} />
        </SettingsRow>
        <SettingsRow label="Email" description="Receipts and announcements sent to your inbox.">
          <Switch value={emailEnabled} onValueChange={setEmailEnabled} thumbColor={theme.colors.primary} />
        </SettingsRow>
        <SettingsRow label="SMS" description="Text confirmations for orders and deliveries.">
          <Switch value={smsEnabled} onValueChange={setSmsEnabled} thumbColor={theme.colors.primary} />
        </SettingsRow>
      </Card>

      <Card>
        <ThemedText style={{ fontSize: 16, fontWeight: '700', marginBottom: theme.spacing.sm }}>Language</ThemedText>
        <ThemedText style={{ color: theme.colors.muted, marginBottom: theme.spacing.sm }}>
          Choose your preferred language. More options are coming soon.
        </ThemedText>
        <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
          {['English', 'Spanish', 'French'].map((lang) => (
            <LanguagePill key={lang} label={lang} active={language === lang} onPress={() => setLanguage(lang)} />
          ))}
        </View>
      </Card>

      <Card>
        <ThemedText style={{ fontSize: 16, fontWeight: '700', marginBottom: theme.spacing.sm }}>Security</ThemedText>
        <ThemedText style={{ color: theme.colors.muted, marginBottom: theme.spacing.md }}>
          Log out of all sessions to keep your account safe.
        </ThemedText>
        <PrimaryButton title="Logout securely" onPress={logout} />
      </Card>
    </Screen>
  );
};

export default ProfileSettingsScreen;
