import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import ColorModeProvider, { useColorMode } from '@/context/color-mode';

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <ColorModeProvider>
      <CssBaseline />
      <MainContainer>{children}</MainContainer>
    </ColorModeProvider>
  );
}

const MainContainer = ({ children }: React.PropsWithChildren) => {
  const { mode } = useColorMode();
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          primary: {
            main: '#673ab7',
          },
          secondary: {
            main: '#f50057',
          },
          mode: mode,
        },
      }),
    [mode],
  );
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <Box
          sx={{
            display: 'flex',
            minHeight: '100vh',
            alignContent: 'center',
            justifyContent: 'center',
            backgroundColor: theme.palette.grey[800],
            padding: theme.spacing(2),
          }}
        >
          {children}
        </Box>
      </CssBaseline>
    </ThemeProvider>
  );
};
