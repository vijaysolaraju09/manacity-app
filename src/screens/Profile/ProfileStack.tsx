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
import AboutScreen from './AboutScreen';
import HelpCenterScreen from './HelpCenterScreen';
import PrivacyPolicyScreen from './PrivacyPolicyScreen';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Profile' }} />
    <Stack.Screen name="SwitchRole" component={SwitchRoleScreen} options={{ title: 'Switch role' }} />
    <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} options={{ title: 'Settings' }} />
    <Stack.Screen name="Notifications" component={NotificationsCenterScreen} />
    <Stack.Screen name="Announcement" component={AnnouncementScreen} />
    <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
    <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
    <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
    <Stack.Screen name="About" component={AboutScreen} options={{ title: 'About' }} />
    <Stack.Screen name="HelpCenter" component={HelpCenterScreen} options={{ title: 'Help center' }} />
    <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} options={{ title: 'Privacy policy' }} />
  </Stack.Navigator>
);

export default ProfileStack;
