import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { Theme, lightTheme } from '../theme';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme?: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({ theme: lightTheme });

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme] = useState<Theme>(lightTheme);

  const value = useMemo(() => ({ theme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext).theme;
