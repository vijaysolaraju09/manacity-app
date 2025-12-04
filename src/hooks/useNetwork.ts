import { useEffect } from 'react';
import { registerNetworkInterceptors } from '../utils/network';

export const useNetwork = () => {
  useEffect(() => {
    registerNetworkInterceptors();
  }, []);
};
