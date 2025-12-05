import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Root: NavigatorScreenParams<TabParamList> | undefined;
  Auth: undefined;
  Business: undefined;
  Admin: undefined;
  Onboarding: undefined;
  ProfileSetup: undefined;
};

export type TabParamList = {
  Home: undefined;
  Shops: NavigatorScreenParams<ShopsStackParamList> | undefined;
  Services: NavigatorScreenParams<ServicesStackParamList> | undefined;
  Events: NavigatorScreenParams<EventsStackParamList> | undefined;
  Profile: NavigatorScreenParams<ProfileStackParamList> | undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  OTP: undefined;
  ProfileSetup: undefined;
};

export type ShopsStackParamList = {
  ShopsList: undefined;
  ShopDetails: { shopId: string };
  Products: { shopId: string } | undefined;
  Cart: undefined;
  Checkout: { orderNumber?: string } | undefined;
};

export type ServicesStackParamList = {
  ServicesPublic: undefined;
  ServicesPrivate: undefined;
  ServicesDirect: undefined;
  ServicesOffers: undefined;
  ServicesProviders: undefined;
  ServicesRequestForm:
    | {
        categoryId?: string;
        providerId?: string;
        mode?: 'public' | 'private' | 'direct';
      }
    | undefined;
  ServiceRequestDetails: { requestId: string };
};

export type EventsStackParamList = {
  EventsList: undefined;
  EventDetails: { eventId: string };
  EventRegister: { eventId: string };
  EventLeaderboard: { eventId: string };
  EventUpdates: { eventId: string };
};

export type ProfileStackParamList = {
  ProfileSettings: undefined;
  EditProfile: undefined;
  SwitchRole: undefined;
  Notifications: undefined;
  OrderHistory: undefined;
  OrderDetails: { orderId: string };
  OrderTracking: { orderId: string };
  Announcement: { announcementId?: string; title?: string; body?: string };
};

export type BusinessStackParamList = {
  BusinessDashboard: undefined;
  ManageShop: undefined;
  ManageProducts: undefined;
  ManageOrders: undefined;
};

export type AdminStackParamList = {
  AdminDashboard: undefined;
  AdminUsers: undefined;
  AdminShops: undefined;
  AdminServices: undefined;
  AdminEvents: undefined;
  AdminAssignments: undefined;
};
