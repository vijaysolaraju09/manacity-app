import React, { useCallback } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';
import { NotificationListItem } from '../../components/notifications/NotificationListItem';
import { useNotifications } from '../../hooks/useNotifications';
import { useTheme } from '../../context/ThemeContext';

const NotificationsCenterScreen = () => {
  const { notifications, unreadCount, refresh, loading, openNotification, markAll, markAsRead } = useNotifications();
  const theme = useTheme();

  const handleRefresh = useCallback(() => {
    refresh();
  }, [refresh]);

  return (
    <Screen scroll={false}>
      <View style={styles.headerRow}>
        <ThemedText accessibilityRole="header" style={styles.heading}>
          Notifications
        </ThemedText>
        {unreadCount > 0 ? (
          <ThemedText style={{ color: theme.colors.primary }}>{unreadCount} unread</ThemedText>
        ) : null}
      </View>
      <Card style={{ marginBottom: 12 }}>
        <ThemedText>Review alerts, announcements, and updates.</ThemedText>
        <ThemedText style={{ color: theme.colors.muted, marginTop: 4 }}>
          Tap a notification to jump into the right screen. Swipe down to refresh.
        </ThemedText>
        {notifications.length > 0 ? (
          <ThemedText onPress={markAll} style={[styles.markAll, { color: theme.colors.primary }]}>Mark all as read</ThemedText>
        ) : null}
      </Card>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationListItem item={item} onPress={openNotification} onMarkRead={markAsRead} />
        )}
        ListEmptyComponent={() => (
          <Card>
            <ThemedText style={{ fontWeight: '600' }}>All caught up</ThemedText>
            <ThemedText style={{ color: theme.colors.muted, marginTop: 4 }}>
              You will see order updates, services, events, and admin announcements here.
            </ThemedText>
          </Card>
        )}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={handleRefresh} />}
        contentContainerStyle={{ paddingBottom: theme.spacing.lg }}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  heading: { fontSize: 22, fontWeight: '700' },
  markAll: { marginTop: 10, fontWeight: '600' },
});

export default NotificationsCenterScreen;
