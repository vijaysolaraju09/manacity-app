import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { linking } from './linking';
import { AuthStackParamList, RootStackParamList, TabParamList } from './types';
import { navigationRef } from './navigationRef';
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
import { useAuth } from '../hooks/useAuth';
import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';
import { View, ActivityIndicator } from 'react-native';
import { selectCartCount, useShopStore } from '../store/useShopStore';
import { useNotifications } from '../hooks/useNotifications';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
const Auth = createNativeStackNavigator<AuthStackParamList>();

const BottomTabs = () => {
  const theme = useTheme();
  const cartCount = useShopStore(selectCartCount);
  const { unreadCount } = useNotifications();
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
        tabBarBadge:
          (route.name === 'Shops' && cartCount > 0 ? cartCount : undefined) ||
          (route.name === 'Profile' && unreadCount > 0 ? unreadCount : undefined),
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

const AuthStack = () => (
  <Auth.Navigator>
    <Auth.Screen name="Login" component={LoginScreen} />
    <Auth.Screen name="OTP" component={OTPScreen} />
    <Auth.Screen name="ProfileSetup" component={ProfileSetupScreen} options={{ title: 'Profile' }} />
  </Auth.Navigator>
);

const RootNavigator = () => {
  const { user, loading, onboardingComplete, activeRole } = useAuth();
  const theme = useTheme();
  const needsProfile = !!(user && (!user.name || !user.location));

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  const renderStack = () => {
    if (!onboardingComplete) {
      return <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />;
    }

    if (!user) {
      return <Stack.Screen name="Auth" component={AuthStack} options={{ headerShown: false }} />;
    }

    if (needsProfile) {
      return <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} options={{ headerShown: false }} />;
    }

    if (activeRole === 'business') {
      return <Stack.Screen name="Business" component={BusinessStack} options={{ headerShown: false }} />;
    }

    if (activeRole === 'admin') {
      return <Stack.Screen name="Admin" component={AdminStack} options={{ headerShown: false }} />;
    }

    return <Stack.Screen name="Root" component={BottomTabs} options={{ headerShown: false }} />;
  };

  return (
    <NavigationContainer
      testID="app-root"
      linking={linking}
      theme={DefaultTheme}
      ref={navigationRef}
      documentTitle={{ formatter: (options) => options?.title ?? 'Manacity' }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>{renderStack()}</Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
