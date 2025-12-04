import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EventsStackParamList } from '../../navigation/types';
import EventsListScreen from './EventsListScreen';
import EventDetailsScreen from './EventDetailsScreen';
import EventRegisterScreen from './EventRegisterScreen';
import EventLeaderboardScreen from './EventLeaderboardScreen';
import EventUpdatesScreen from './EventUpdatesScreen';

const Stack = createNativeStackNavigator<EventsStackParamList>();

const EventsStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="EventsList" component={EventsListScreen} options={{ title: 'Events' }} />
    <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
    <Stack.Screen name="EventRegister" component={EventRegisterScreen} />
    <Stack.Screen name="EventLeaderboard" component={EventLeaderboardScreen} />
    <Stack.Screen name="EventUpdates" component={EventUpdatesScreen} />
  </Stack.Navigator>
);

export default EventsStack;
