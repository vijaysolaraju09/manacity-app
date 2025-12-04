import axios from 'axios';
import Toast from 'react-native-toast-message';

export const registerNetworkInterceptors = () => {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (!error.response) {
        Toast.show({ type: 'error', text1: 'Network Issue', text2: 'Check your internet connection.' });
      }
      return Promise.reject(error);
    }
  );
};
