import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdminStackParamList } from '../../navigation/types';
import AdminDashboardScreen from './AdminDashboardScreen';
import AdminUsersScreen from './AdminUsersScreen';
import AdminShopsScreen from './AdminShopsScreen';
import AdminServicesScreen from './AdminServicesScreen';
import AdminEventsScreen from './AdminEventsScreen';
import AdminAssignmentsScreen from './AdminAssignmentsScreen';
import AdminAnnouncementsScreen from './AdminAnnouncementsScreen';

const Stack = createNativeStackNavigator<AdminStackParamList>();

const AdminStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ title: 'Admin' }} />
    <Stack.Screen name="AdminUsers" component={AdminUsersScreen} />
    <Stack.Screen name="AdminShops" component={AdminShopsScreen} />
    <Stack.Screen name="AdminServices" component={AdminServicesScreen} />
    <Stack.Screen name="AdminEvents" component={AdminEventsScreen} />
    <Stack.Screen name="AdminAssignments" component={AdminAssignmentsScreen} />
    <Stack.Screen name="AdminAnnouncements" component={AdminAnnouncementsScreen} options={{ title: 'Announcements' }} />
  </Stack.Navigator>
);

export default AdminStack;
