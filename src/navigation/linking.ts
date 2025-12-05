import * as Linking from 'expo-linking';
import { LinkingOptions } from '@react-navigation/native';
import { RootStackParamList } from './types';

const prefix = Linking.createURL('/');

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [prefix, 'manacity://'],
  config: {
    screens: {
      Root: {
        screens: {
          Home: 'home',
          Shops: 'shops',
          Services: {
            path: 'services',
            screens: {
              ServicesPublic: '',
              ServicesPrivate: 'private',
              ServicesDirect: 'direct',
              ServicesOffers: 'offers',
              ServicesProviders: 'providers',
              ServicesRequestForm: 'request',
              ServiceRequestDetails: 'request/:requestId',
            },
          },
          Events: {
            path: 'events',
            screens: {
              EventsList: '',
              EventDetails: ':eventId',
              EventRegister: ':eventId/register',
              EventLeaderboard: ':eventId/leaderboard',
              EventUpdates: ':eventId/updates',
            },
          },
          Profile: {
            path: 'profile',
            screens: {
              ProfileSettings: '',
              Notifications: 'notifications',
              OrderHistory: 'orders',
              OrderDetails: 'orders/:orderId',
              OrderTracking: 'orders/:orderId/tracking',
              Announcement: 'announcements/:announcementId?',
            },
          },
        },
      },
      Auth: {
        screens: {
          Login: 'login',
          OTP: 'otp',
          ProfileSetup: 'profile-setup',
        },
      },
      Business: {
        screens: {
          BusinessDashboard: 'business',
          ManageShop: 'business/manage-shop',
          ManageProducts: 'business/manage-products',
          ManageOrders: 'business/manage-orders',
        },
      },
      Admin: {
        screens: {
          AdminDashboard: 'admin',
          AdminUsers: 'admin/users',
          AdminShops: 'admin/shops',
          AdminServices: 'admin/services',
          AdminEvents: 'admin/events',
          AdminAssignments: 'admin/assignments',
        },
      },
    },
  },
};
