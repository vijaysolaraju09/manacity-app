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
          Services: 'services',
          Events: 'events',
          Profile: 'profile',
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
