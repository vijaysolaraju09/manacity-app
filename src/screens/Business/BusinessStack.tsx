import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BusinessStackParamList } from '../../navigation/types';
import BusinessDashboardScreen from './BusinessDashboardScreen';
import ManageShopScreen from './ManageShopScreen';
import ManageProductsScreen from './ManageProductsScreen';
import ManageOrdersScreen from './ManageOrdersScreen';

const Stack = createNativeStackNavigator<BusinessStackParamList>();

const BusinessStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="BusinessDashboard" component={BusinessDashboardScreen} options={{ title: 'Business' }} />
    <Stack.Screen name="ManageShop" component={ManageShopScreen} />
    <Stack.Screen name="ManageProducts" component={ManageProductsScreen} />
    <Stack.Screen name="ManageOrders" component={ManageOrdersScreen} />
  </Stack.Navigator>
);

export default BusinessStack;
