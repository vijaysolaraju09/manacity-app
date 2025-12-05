import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import EditProfileScreen from './EditProfileScreen';
import SwitchRoleScreen from './SwitchRoleScreen';
import ProfileSettingsScreen from './ProfileSettingsScreen';
import NotificationsCenterScreen from '../Notifications/NotificationsCenterScreen';
import AnnouncementScreen from '../Notifications/AnnouncementScreen';
import OrderHistoryScreen from '../Orders/OrderHistoryScreen';
import OrderDetailsScreen from '../Orders/OrderDetailsScreen';
import OrderTrackingScreen from '../Orders/OrderTrackingScreen';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Profile' }} />
    <Stack.Screen name="SwitchRole" component={SwitchRoleScreen} />
    <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} />
    <Stack.Screen name="Notifications" component={NotificationsCenterScreen} />
    <Stack.Screen name="Announcement" component={AnnouncementScreen} />
    <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
    <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
    <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
  </Stack.Navigator>
);

export default ProfileStack;
