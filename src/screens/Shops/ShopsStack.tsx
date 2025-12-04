import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ShopsStackParamList } from '../../navigation/types';
import ShopsListScreen from './ShopsListScreen';
import ShopDetailsScreen from './ShopDetailsScreen';
import ProductsScreen from './ProductsScreen';
import CartScreen from './CartScreen';
import CheckoutScreen from './CheckoutScreen';

const Stack = createNativeStackNavigator<ShopsStackParamList>();

const ShopsStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="ShopsList" component={ShopsListScreen} options={{ title: 'Shops' }} />
    <Stack.Screen name="ShopDetails" component={ShopDetailsScreen} />
    <Stack.Screen name="Products" component={ProductsScreen} />
    <Stack.Screen name="Cart" component={CartScreen} />
    <Stack.Screen name="Checkout" component={CheckoutScreen} />
  </Stack.Navigator>
);

export default ShopsStack;
