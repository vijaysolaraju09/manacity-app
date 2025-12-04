import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from '../utils/notifications';

export const useNotifications = () => {
  useEffect(() => {
    registerForPushNotificationsAsync();
    const subscription = Notifications.addNotificationResponseReceivedListener(() => {
      // Handle notification response
    });

    return () => subscription.remove();
  }, []);
};
