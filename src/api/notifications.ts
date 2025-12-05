import { Platform } from 'react-native';
import apiClient from './client';
import { DeviceRegistration, NotificationItem } from '../types/notifications';

export const registerDevice = async (token: string): Promise<void> => {
  const payload: DeviceRegistration = {
    token,
    platform: Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'web',
  };
  await apiClient.post('/notifications/devices', payload);
};

export const fetchNotifications = async (): Promise<NotificationItem[]> => {
  const response = await apiClient.get('/notifications');
  return response.data as NotificationItem[];
};

export const markNotificationRead = async (id: string): Promise<void> => {
  await apiClient.post(`/notifications/${id}/read`);
};

export const markAllNotificationsRead = async (): Promise<void> => {
  await apiClient.post('/notifications/read-all');
};
