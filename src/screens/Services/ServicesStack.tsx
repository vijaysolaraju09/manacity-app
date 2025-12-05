import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ServicesStackParamList } from '../../navigation/types';
import ServicesPublicScreen from './ServicesPublicScreen';
import ServicesPrivateScreen from './ServicesPrivateScreen';
import ServicesDirectScreen from './ServicesDirectScreen';
import ServicesOffersScreen from './ServicesOffersScreen';
import ServicesProvidersScreen from './ServicesProvidersScreen';
import ServicesRequestFormScreen from './ServicesRequestFormScreen';
import ServiceRequestDetailsScreen from './ServiceRequestDetailsScreen';

const Stack = createNativeStackNavigator<ServicesStackParamList>();

const ServicesStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="ServicesPublic" component={ServicesPublicScreen} options={{ title: 'Services' }} />
    <Stack.Screen name="ServicesPrivate" component={ServicesPrivateScreen} />
    <Stack.Screen name="ServicesDirect" component={ServicesDirectScreen} />
    <Stack.Screen name="ServicesOffers" component={ServicesOffersScreen} />
    <Stack.Screen name="ServicesProviders" component={ServicesProvidersScreen} />
    <Stack.Screen name="ServicesRequestForm" component={ServicesRequestFormScreen} />
    <Stack.Screen name="ServiceRequestDetails" component={ServiceRequestDetailsScreen} />
  </Stack.Navigator>
);

export default ServicesStack;
