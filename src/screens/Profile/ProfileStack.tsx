import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import EditProfileScreen from './EditProfileScreen';
import SwitchRoleScreen from './SwitchRoleScreen';
import ProfileSettingsScreen from './ProfileSettingsScreen';
import NotificationsCenterScreen from '../Notifications/NotificationsCenterScreen';
import OrderHistoryScreen from '../Orders/OrderHistoryScreen';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Profile' }} />
    <Stack.Screen name="SwitchRole" component={SwitchRoleScreen} />
    <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} />
    <Stack.Screen name="Notifications" component={NotificationsCenterScreen} />
    <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
  </Stack.Navigator>
);

export default ProfileStack;
