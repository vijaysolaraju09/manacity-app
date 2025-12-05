import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';
import FormTextInput from '../../components/FormTextInput';
import PrimaryButton from '../../components/PrimaryButton';
import AdminBadge from '../../components/admin/AdminBadge';
import { useAdminStore } from '../../store/useAdminStore';
import { useTheme } from '../../context/ThemeContext';

const audiences = ['all', 'shoppers', 'providers', 'admins'] as const;
const channels = ['push', 'email'] as const;

const AdminAnnouncementsScreen = () => {
  const theme = useTheme();
  const { announcements, addAnnouncement } = useAdminStore();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [audience, setAudience] = useState<(typeof audiences)[number]>('all');
  const [channel, setChannel] = useState<(typeof channels)[number]>('push');

  const send = () => {
    if (!title || !body) return;
    addAnnouncement({ title, body, audience, channel });
    setTitle('');
    setBody('');
  };

  return (
    <Screen>
      <ThemedText accessibilityRole="header" style={styles.title}>
        Announcements
      </ThemedText>
      <ThemedText style={{ color: theme.colors.muted, marginBottom: theme.spacing.md }}>
        Send push or email notifications to your audiences. Use this for downtime, promos, or urgent updates.
      </ThemedText>

      <Card>
        <ThemedText style={styles.sectionTitle}>Compose message</ThemedText>
        <FormTextInput label="Title" value={title} onChangeText={setTitle} placeholder="Service downtime" />
        <FormTextInput label="Body" value={body} onChangeText={setBody} placeholder="Share details" />
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <ThemedText style={styles.label}>Audience</ThemedText>
            <View style={styles.chipsRow}>
              {audiences.map((item) => (
                <Pressable
                  key={item}
                  onPress={() => setAudience(item)}
                  style={({ pressed }) => [
                    styles.chip,
                    {
                      backgroundColor: audience === item ? `${theme.colors.primary}12` : theme.colors.card,
                      borderColor: audience === item ? theme.colors.primary : theme.colors.border,
                      opacity: pressed ? 0.9 : 1,
                    },
                  ]}
                >
                  <ThemedText style={{ color: audience === item ? theme.colors.primary : theme.colors.text }}>
                    {item}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <ThemedText style={styles.label}>Channel</ThemedText>
            <View style={styles.chipsRow}>
              {channels.map((item) => (
                <Pressable
                  key={item}
                  onPress={() => setChannel(item)}
                  style={({ pressed }) => [
                    styles.chip,
                    {
                      backgroundColor: channel === item ? `${theme.colors.primary}12` : theme.colors.card,
                      borderColor: channel === item ? theme.colors.primary : theme.colors.border,
                      opacity: pressed ? 0.9 : 1,
                    },
                  ]}
                >
                  <ThemedText style={{ color: channel === item ? theme.colors.primary : theme.colors.text }}>
                    {item}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
        <PrimaryButton title="Send" onPress={send} />
      </Card>

      <Card>
        <ThemedText style={styles.sectionTitle}>Recent sends</ThemedText>
        {announcements.map((announcement) => (
          <View key={announcement.id} style={styles.itemRow}>
            <View style={{ flex: 1 }}>
              <ThemedText style={{ fontFamily: 'Inter_600SemiBold' }}>{announcement.title}</ThemedText>
              <ThemedText style={{ color: theme.colors.muted }}>{announcement.body}</ThemedText>
              <ThemedText style={{ color: theme.colors.muted, fontSize: 12 }}>
                {new Date(announcement.sentAt).toLocaleString()} • {announcement.audience}
              </ThemedText>
            </View>
            <AdminBadge label={announcement.channel.toUpperCase()} tone="info" />
          </View>
        ))}
        {announcements.length === 0 ? (
          <ThemedText style={{ color: theme.colors.muted }}>No announcements sent yet.</ThemedText>
        ) : null}
      </Card>
     </Screen>
   );
 };
 
const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    marginBottom: 8,
  },
  label: {
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
});

export default AdminAnnouncementsScreen;
