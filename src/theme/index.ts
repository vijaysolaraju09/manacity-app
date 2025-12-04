import { palette } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';

export const lightTheme = {
  colors: {
    ...palette,
  },
  spacing,
  typography,
  roundness: 12,
};

export type Theme = typeof lightTheme;
