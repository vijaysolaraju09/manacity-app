import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { NotificationCategory } from '../types/notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const categoryChannels: Record<NotificationCategory, { channelId: string; name: string }> = {
  orders: { channelId: 'orders', name: 'Orders' },
  services: { channelId: 'services', name: 'Services' },
  events: { channelId: 'events', name: 'Events' },
  admin: { channelId: 'admin', name: 'Announcements' },
};

export const configureNotificationCategories = async () => {
  if (Platform.OS === 'android') {
    await Promise.all(
      Object.values(categoryChannels).map((category) =>
        Notifications.setNotificationChannelAsync(category.channelId, {
          name: category.name,
          importance: Notifications.AndroidImportance.HIGH,
          sound: 'default',
          vibrationPattern: [0, 250, 250, 250],
        }),
      ),
    );
  } else {
    await Promise.all(
      Object.keys(categoryChannels).map((categoryId) =>
        Notifications.setNotificationCategoryAsync(categoryId, [
          { identifier: `${categoryId}-mark-read`, buttonTitle: 'Mark as read', options: { isDestructive: false } },
        ]),
      ),
    );
  }
};

export const registerForPushNotificationsAsync = async (): Promise<string | undefined> => {
  await configureNotificationCategories();

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return undefined;
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
  const pushToken = await Notifications.getExpoPushTokenAsync(projectId ? { projectId } : undefined);
  const token = pushToken.data;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  return token;
};
