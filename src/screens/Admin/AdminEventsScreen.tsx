import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';
import FormTextInput from '../../components/FormTextInput';
import PrimaryButton from '../../components/PrimaryButton';
import AdminTable from '../../components/admin/AdminTable';
import AdminBadge from '../../components/admin/AdminBadge';
import { useAdminStore } from '../../store/useAdminStore';
import { useTheme } from '../../context/ThemeContext';

const AdminEventsScreen = () => {
  const theme = useTheme();
  const { events, createEvent, updateEvent, addEventUpdate, setLeaderboard } = useAdminStore();
  const [selectedId, setSelectedId] = useState(events[0]?.id);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateBody, setUpdateBody] = useState('');

  const event = useMemo(() => events.find((item) => item.id === selectedId) || events[0], [events, selectedId]);

  const submitEvent = () => {
    if (!title || !location || !startsAt || !endsAt) return;
    createEvent({
      title,
      location,
      startsAt,
      endsAt,
      category: 'event',
    });
    setTitle('');
    setLocation('');
    setStartsAt('');
    setEndsAt('');
  };

  const publishUpdate = () => {
    if (!event || !updateTitle || !updateBody) return;
    addEventUpdate(event.id, { title: updateTitle, body: updateBody });
    setUpdateTitle('');
    setUpdateBody('');
  };

  const bumpScore = (id: string, delta: number) => {
    if (!event) return;
    const leaderboard = event.leaderboard.map((entry) =>
      entry.id === id ? { ...entry, score: Math.max(0, entry.score + delta) } : entry,
    );
    setLeaderboard(event.id, leaderboard);
  };

  return (
    <Screen>
      <ThemedText accessibilityRole="header" style={styles.title}>
        Events operations
      </ThemedText>
      <ThemedText style={{ color: theme.colors.muted, marginBottom: theme.spacing.md }}>
        Coordinate events, tournament scoring, and participant notifications.
      </ThemedText>

      <Card>
        <ThemedText style={styles.sectionTitle}>Create event</ThemedText>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <FormTextInput label="Title" value={title} onChangeText={setTitle} placeholder="Community meetup" />
            <FormTextInput label="Location" value={location} onChangeText={setLocation} placeholder="Innovation hub" />
          </View>
          <View style={{ flex: 1 }}>
            <FormTextInput label="Starts at" value={startsAt} onChangeText={setStartsAt} placeholder="2024-05-30T10:00" />
            <FormTextInput label="Ends at" value={endsAt} onChangeText={setEndsAt} placeholder="2024-05-30T13:00" />
          </View>
        </View>
        <PrimaryButton title="Save event" onPress={submitEvent} />
      </Card>

      <Card>
        <ThemedText style={styles.sectionTitle}>Live events</ThemedText>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          {events.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => setSelectedId(item.id)}
              style={({ pressed }) => [
                styles.eventChip,
                {
                  backgroundColor: selectedId === item.id ? `${theme.colors.primary}12` : theme.colors.card,
                  borderColor: selectedId === item.id ? theme.colors.primary : theme.colors.border,
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
            >
              <ThemedText style={{ fontFamily: 'Inter_600SemiBold' }}>{item.title}</ThemedText>
              <ThemedText style={{ color: theme.colors.muted, fontSize: 12 }}>{item.location}</ThemedText>
              <AdminBadge label={item.category === 'tournament' ? 'Tournament' : 'Event'} tone="info" />
            </Pressable>
          ))}
        </View>
      </Card>

      {event ? (
        <>
          <Card>
            <ThemedText style={styles.sectionTitle}>Event schedule</ThemedText>
            <ThemedText style={{ color: theme.colors.muted }}>Starts: {event.startsAt}</ThemedText>
            <ThemedText style={{ color: theme.colors.muted }}>Ends: {event.endsAt}</ThemedText>
            <PrimaryButton title="Mark as highlighted" onPress={() => updateEvent(event.id, { isRegistered: true })} />
          </Card>

          <Card>
            <ThemedText style={styles.sectionTitle}>Post update</ThemedText>
            <FormTextInput label="Title" value={updateTitle} onChangeText={setUpdateTitle} placeholder="New bracket" />
            <FormTextInput label="Body" value={updateBody} onChangeText={setUpdateBody} placeholder="Share logistics" />
            <PrimaryButton title="Publish" onPress={publishUpdate} />
            <View style={{ marginTop: 12 }}>
              {event.updates.map((item) => (
                <View key={item.id} style={{ marginBottom: 10 }}>
                  <ThemedText style={{ fontFamily: 'Inter_600SemiBold' }}>{item.title}</ThemedText>
                  <ThemedText style={{ color: theme.colors.muted }}>{item.body}</ThemedText>
                </View>
              ))}
            </View>
          </Card>

          <Card>
            <ThemedText style={styles.sectionTitle}>Leaderboard</ThemedText>
            <AdminTable
              columns={[
                { key: 'rank', title: '#', width: '15%', render: (row) => <ThemedText>#{row.rank}</ThemedText> },
                { key: 'name', title: 'Name', width: '40%', dataIndex: 'name' },
                { key: 'score', title: 'Score', width: '20%', dataIndex: 'score' },
                {
                  key: 'action',
                  title: 'Adjust',
                  width: '25%',
                  render: (row) => (
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <PrimaryButton title="+5" onPress={() => bumpScore(row.id, 5)} />
                      <PrimaryButton title="-5" onPress={() => bumpScore(row.id, -5)} />
                    </View>
                  ),
                },
              ]}
              data={event.leaderboard}
              rowKey={(row) => row.id}
            />
          </Card>
        </>
      ) : null}
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
  eventChip: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    width: 180,
    gap: 4,
  },
});

export default AdminEventsScreen;
