import { createNavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from './types';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export const navigate = (...args: Parameters<typeof navigationRef.navigate>) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate(...args);
  }
};

export const resetNavigation = (routeName: keyof RootStackParamList) => {
  if (navigationRef.isReady()) {
    navigationRef.reset({ index: 0, routes: [{ name: routeName }] });
  }
};
