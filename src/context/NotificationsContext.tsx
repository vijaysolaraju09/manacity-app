import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import { registerForPushNotificationsAsync } from '../utils/notifications';
import { fetchNotifications, markAllNotificationsRead, markNotificationRead, registerDevice } from '../api/notifications';
import { NotificationCategory, NotificationItem, NotificationMetadata } from '../types/notifications';
import { useAuth } from '../hooks/useAuth';
import { navigationRef } from '../navigation/navigationRef';

interface NotificationsContextValue {
  notifications: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  refresh: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAll: () => Promise<void>;
  openNotification: (notification: NotificationItem) => Promise<void>;
  registerDeviceToken: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined);

const buildNotificationFromPayload = (
  notification: Notifications.Notification,
  fallbackCategory: NotificationCategory = 'admin',
): NotificationItem => {
  const { content, request } = notification;
  const data = (content.data || {}) as NotificationMetadata & { category?: NotificationCategory };
  const timestamp = notification.date ?? Date.now();
  const category =
    (data.category as NotificationCategory | undefined) ||
    ((content as any).categoryIdentifier as NotificationCategory | undefined) ||
    fallbackCategory;

  return {
    id: (data?.announcementId || data?.orderId || data?.serviceRequestId || data?.eventId || request.identifier) as string,
    title: content.title || 'Notification',
    body: content.body || '',
    category,
    data,
    createdAt: new Date(timestamp).toISOString(),
    read: false,
  };
};

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const registrationAttempted = useRef(false);
  const latestList = useRef<NotificationItem[]>([]);

  const syncBadge = useCallback(async (count: number) => {
    if (Platform.OS !== 'web') {
      await Notifications.setBadgeCountAsync(count);
    }
  }, []);

  const applyUnreadCount = useCallback(
    async (items: NotificationItem[]) => {
      const unread = items.filter((item) => !item.read).length;
      setUnreadCount(unread);
      await syncBadge(unread);
    },
    [syncBadge],
  );

  const refresh = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      await applyUnreadCount([]);
      return;
    }
    setLoading(true);
    try {
      const response = await fetchNotifications();
      setNotifications(response);
      latestList.current = response;
      await applyUnreadCount(response);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Notifications unavailable', text2: 'Could not load notifications.' });
    } finally {
      setLoading(false);
    }
  }, [user, applyUnreadCount]);

  const registerDeviceToken = useCallback(async () => {
    if (!user || registrationAttempted.current) return;
    registrationAttempted.current = true;
    const token = await registerForPushNotificationsAsync();
    if (!token) return;
    try {
      await registerDevice(token);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Push registration failed', text2: 'Could not sync device token.' });
    }
  }, [user]);

  const markAsRead = useCallback(
    async (id: string) => {
      let updated: NotificationItem[] = [];
      setNotifications((prev) => {
        updated = prev.map((note) => (note.id === id ? { ...note, read: true } : note));
        latestList.current = updated;
        return updated;
      });
      await applyUnreadCount(updated);
      try {
        await markNotificationRead(id);
      } catch (error) {
        Toast.show({ type: 'info', text1: 'Offline mode', text2: 'Will sync read status when online.' });
      }
    },
    [applyUnreadCount],
  );

  const markAll = useCallback(async () => {
    let updated: NotificationItem[] = [];
    setNotifications((prev) => {
      updated = prev.map((note) => ({ ...note, read: true }));
      latestList.current = updated;
      return updated;
    });
    await applyUnreadCount(updated);
    try {
      await markAllNotificationsRead();
    } catch (error) {
      Toast.show({ type: 'info', text1: 'Offline mode', text2: 'Will sync read status when online.' });
    }
  }, [applyUnreadCount]);

  const navigateFromNotification = useCallback((notification: NotificationItem) => {
    const data = notification.data || {};
    if (!navigationRef.isReady()) return;

    switch (notification.category) {
      case 'orders':
        if (data.orderId) {
          navigationRef.navigate('Root', {
            screen: 'Profile',
            params: { screen: 'OrderDetails', params: { orderId: data.orderId } },
          });
        }
        break;
      case 'services':
        if (data.serviceRequestId) {
          navigationRef.navigate('Root', {
            screen: 'Services',
            params: { screen: 'ServiceRequestDetails', params: { requestId: data.serviceRequestId } },
          });
        }
        break;
      case 'events':
        if (data.eventId) {
          navigationRef.navigate('Root', {
            screen: 'Events',
            params: { screen: 'EventDetails', params: { eventId: data.eventId } },
          });
        }
        break;
      case 'admin':
      default:
        navigationRef.navigate('Root', {
          screen: 'Profile',
          params: { screen: 'Announcement', params: { announcementId: data.announcementId, title: notification.title, body: notification.body } },
        });
        break;
    }
  }, []);

  const openNotification = useCallback(
    async (notification: NotificationItem) => {
      setNotifications((prev) => {
        const exists = prev.find((item) => item.id === notification.id);
        const nextList = exists ? prev : [notification, ...prev];
        latestList.current = nextList;
        return nextList;
      });
      await markAsRead(notification.id);
      navigateFromNotification(notification);
    },
    [markAsRead, navigateFromNotification],
  );

  const appendIncomingNotification = useCallback(
    async (notification: Notifications.Notification) => {
      const formatted = buildNotificationFromPayload(notification, 'admin');
      let nextList: NotificationItem[] = [];
      setNotifications((prev) => {
        const exists = prev.find((note) => note.id === formatted.id);
        nextList = exists ? prev : [formatted, ...prev];
        latestList.current = nextList;
        return nextList;
      });
      await applyUnreadCount(nextList);
    },
    [applyUnreadCount],
  );

  useEffect(() => {
    latestList.current = notifications;
  }, [notifications]);

  useEffect(() => {
    registrationAttempted.current = false;
  }, [user?.id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    registerDeviceToken();
  }, [registerDeviceToken]);

  useEffect(() => {
    const receivedSub = Notifications.addNotificationReceivedListener((notification) => {
      appendIncomingNotification(notification);
    });

    const responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
      const formatted = buildNotificationFromPayload(response.notification);
      openNotification(formatted);
    });

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        const formatted = buildNotificationFromPayload(response.notification);
        openNotification(formatted);
      }
    });

    return () => {
      receivedSub.remove();
      responseSub.remove();
    };
  }, [appendIncomingNotification, openNotification]);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      loading,
      refresh,
      markAsRead,
      markAll,
      openNotification,
      registerDeviceToken,
    }),
    [notifications, unreadCount, loading, refresh, markAsRead, markAll, openNotification, registerDeviceToken],
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
};

export const useNotificationsContext = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotificationsContext must be used within NotificationsProvider');
  }
  return context;
};
