import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { linking } from './linking';
import { AuthStackParamList, RootStackParamList, TabParamList } from './types';
import HomeScreen from '../screens/HomeScreen';
import ShopsStack from '../screens/Shops/ShopsStack';
import ServicesStack from '../screens/Services/ServicesStack';
import EventsStack from '../screens/Events/EventsStack';
import ProfileStack from '../screens/Profile/ProfileStack';
import LoginScreen from '../screens/Auth/LoginScreen';
import OTPScreen from '../screens/Auth/OTPScreen';
import ProfileSetupScreen from '../screens/Auth/ProfileSetupScreen';
import BusinessStack from '../screens/Business/BusinessStack';
import AdminStack from '../screens/Admin/AdminStack';
import { useTheme } from '../context/ThemeContext';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
const Auth = createNativeStackNavigator<AuthStackParamList>();

const BottomTabs = () => {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.muted,
        tabBarIcon: ({ color, size }) => {
          const icons: Record<keyof TabParamList, keyof typeof Ionicons.glyphMap> = {
            Home: 'home',
            Shops: 'cart',
            Services: 'construct',
            Events: 'calendar',
            Profile: 'person',
          };
          return <Ionicons name={icons[route.name as keyof TabParamList]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Shops" component={ShopsStack} />
      <Tab.Screen name="Services" component={ServicesStack} />
      <Tab.Screen name="Events" component={EventsStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};

const RootNavigator = () => {
  return (
    <NavigationContainer linking={linking} theme={DefaultTheme}>
      <Stack.Navigator>
        <Stack.Screen name="Root" component={BottomTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Auth" component={AuthStack} options={{ headerShown: false }} />
        <Stack.Screen name="Business" component={BusinessStack} options={{ headerShown: false }} />
        <Stack.Screen name="Admin" component={AdminStack} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const AuthStack = () => (
  <Auth.Navigator>
    <Auth.Screen name="Login" component={LoginScreen} />
    <Auth.Screen name="OTP" component={OTPScreen} />
    <Auth.Screen name="ProfileSetup" component={ProfileSetupScreen} />
  </Auth.Navigator>
);

export default RootNavigator;
