import Toast from 'react-native-toast-message';

export const handleError = (error: unknown) => {
  if (error instanceof Error) {
    Toast.show({ type: 'error', text1: 'Error', text2: error.message });
    console.error(error.message);
    return;
  }

  Toast.show({ type: 'error', text1: 'Unexpected error' });
};
