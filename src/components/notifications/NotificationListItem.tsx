import React from 'react';
import { GestureResponderEvent, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NotificationItem } from '../../types/notifications';
import { Card, ThemedText } from '../Themed';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  item: NotificationItem;
  onPress: (item: NotificationItem) => void;
  onMarkRead: (id: string) => void;
}

const iconMap: Record<NotificationItem['category'], keyof typeof Ionicons.glyphMap> = {
  orders: 'bag-handle',
  services: 'construct',
  events: 'calendar',
  admin: 'megaphone',
};

export const NotificationListItem: React.FC<Props> = ({ item, onPress, onMarkRead }) => {
  const theme = useTheme();
  const iconName = iconMap[item.category];
  const timeLabel = new Date(item.createdAt).toLocaleString();

  return (
    <Pressable onPress={() => onPress(item)} style={{ opacity: item.read ? 0.75 : 1 }}>
      <Card style={styles.card}>
        <View style={styles.row}>
          <View style={[styles.iconWrapper, { backgroundColor: theme.colors.surface }]}> 
            <Ionicons name={iconName} size={22} color={theme.colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <ThemedText style={styles.title}>{item.title}</ThemedText>
            <ThemedText style={{ color: theme.colors.muted, marginTop: 4 }}>{item.body}</ThemedText>
            <View style={styles.metaRow}>
              <ThemedText style={[styles.meta, { color: theme.colors.muted }]}>{item.category.toUpperCase()}</ThemedText>
              <ThemedText style={[styles.meta, { color: theme.colors.muted }]}>{timeLabel}</ThemedText>
            </View>
          </View>
          {!item.read ? <View style={[styles.unreadDot, { backgroundColor: theme.colors.primary }]} /> : null}
        </View>
        {!item.read ? (
          <Pressable
            onPress={(event: GestureResponderEvent) => {
              event.stopPropagation();
              onMarkRead(item.id);
            }}
            hitSlop={8}
            style={{ alignSelf: 'flex-end' }}
          >
            <ThemedText style={{ color: theme.colors.primary, fontWeight: '600', marginTop: 6 }}>Mark as read</ThemedText>
          </Pressable>
        ) : null}
      </Card>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: { marginVertical: 4 },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  unreadDot: { width: 10, height: 10, borderRadius: 5, marginLeft: 10, marginTop: 4 },
  title: { fontWeight: '700', fontSize: 16 },
  metaRow: { flexDirection: 'row', marginTop: 6, gap: 8, flexWrap: 'wrap' },
  meta: { fontSize: 12 },
});

export default NotificationListItem;
