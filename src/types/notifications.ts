export type NotificationCategory = 'orders' | 'services' | 'events' | 'admin';

export interface NotificationMetadata {
  orderId?: string;
  serviceRequestId?: string;
  eventId?: string;
  announcementId?: string;
  deeplink?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  category: NotificationCategory;
  data?: NotificationMetadata;
  createdAt: string;
  read: boolean;
  image?: string;
}

export interface DeviceRegistration {
  token: string;
  platform: 'ios' | 'android' | 'web';
}
