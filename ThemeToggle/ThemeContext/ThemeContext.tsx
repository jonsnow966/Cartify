import * as React from 'react';

interface ThemeContextType {
  dark: boolean;
  setDark: React.Dispatch<React.SetStateAction<boolean>>;
}

export  const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

ThemeContext.displayName = 'ThemeContext';