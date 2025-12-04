import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { EventUpdate } from '../../types/events';
import { ThemedText, Card } from '../Themed';
import PrimaryButton from '../PrimaryButton';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { useCreateEventUpdate } from '../../hooks/useEvents';

interface Props {
  eventId: string;
  updates: EventUpdate[];
  canPost?: boolean;
}

export const UpdatesFeed: React.FC<Props> = ({ eventId, updates, canPost }) => {
  const theme = useTheme();
  const { activeRole } = useAuth();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const createUpdate = useCreateEventUpdate(eventId);
  const isAdmin = activeRole === 'admin';

  const handlePost = () => {
    if (!title.trim() || !body.trim()) return;
    createUpdate.mutate({ title, body });
    setTitle('');
    setBody('');
  };

  return (
    <View style={{ gap: 12 }}>
      {updates.map((update) => (
        <Card key={update.id} style={styles.updateCard}>
          <ThemedText style={styles.updateTitle}>{update.title}</ThemedText>
          <ThemedText style={{ color: theme.colors.muted }}>{update.body}</ThemedText>
          <ThemedText style={[styles.timestamp, { color: theme.colors.muted }]}> 
            {new Date(update.createdAt).toLocaleString()} {update.author ? `· ${update.author}` : ''}
          </ThemedText>
        </Card>
      ))}

      {(canPost || isAdmin) && (
        <Card style={styles.formCard}>
          <ThemedText style={styles.formLabel}>Create update</ThemedText>
          <TextInput
            placeholder="Headline"
            value={title}
            onChangeText={setTitle}
            style={[styles.input, { borderColor: theme.colors.border }]}
          />
          <TextInput
            placeholder="Share schedule changes, announcements, or results"
            value={body}
            onChangeText={setBody}
            style={[styles.input, styles.multiline, { borderColor: theme.colors.border }]}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
          <PrimaryButton title="Post update" onPress={handlePost} loading={createUpdate.isPending} />
        </Card>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  updateCard: {
    padding: 14,
  },
  updateTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 4,
  },
  timestamp: {
    marginTop: 8,
    fontSize: 12,
  },
  formCard: {
    padding: 16,
    borderStyle: 'dashed',
    borderWidth: 1,
  },
  formLabel: {
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  multiline: {
    minHeight: 80,
  },
});
