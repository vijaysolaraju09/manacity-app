import 'react-native-gesture-handler';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import RootNavigator from './src/navigation/RootNavigator';
import { ThemeProvider } from './src/context/ThemeContext';
import { useNotifications } from './src/hooks/useNotifications';
import { useNetwork } from './src/hooks/useNetwork';
import { AuthProvider } from './src/context/AuthContext';

const queryClient = new QueryClient();

const AppProviders = ({ children }: { children: React.ReactNode }) => {
  useNotifications();
  useNetwork();
  return <>{children}</>;
};

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <StatusBar style="dark" />
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <AppProviders>
            <StatusBar style="dark" />
            <RootNavigator />
            <Toast />
          </AppProviders>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
