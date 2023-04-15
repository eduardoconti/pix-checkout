/* eslint-disable @typescript-eslint/ban-types */
import { useMediaQuery } from '@mui/material';
import React, { PropsWithChildren, useContext } from 'react';

type ColorModeContextType = {
  toggleColorMode: () => void;
  mode: 'light' | 'dark';
};
const ColorModeContext = React.createContext<ColorModeContextType | null>(null);

function ColorModeProvider({ children }: PropsWithChildren) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = React.useState<'light' | 'dark'>(
    prefersDarkMode ? 'dark' : 'light',
  );

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ColorModeContext.Provider
      value={{
        mode,
        toggleColorMode,
      }}
    >
      {children}
    </ColorModeContext.Provider>
  );
}

export default ColorModeProvider;

export const useColorMode = () => {
  const context = useContext(ColorModeContext);

  if (context === null) {
    throw new Error(
      'useColorMode deve ser usado dentro de um ColorModeProvider',
    );
  }

  return context;
};
