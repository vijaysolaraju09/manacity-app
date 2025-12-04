import { useCallback } from 'react';
import { handleError } from '../utils/errorHandler';

export const useErrorHandler = () => {
  return useCallback((error: unknown) => handleError(error), []);
};
