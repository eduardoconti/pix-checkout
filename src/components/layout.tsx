import * as React from 'react';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { red } from '@mui/material/colors';

export default function Layout({ children }: React.PropsWithChildren) {
  const newTheme = React.useMemo(
    () =>
      createTheme({
        palette: {
          primary: {
            main: '#03d69d',
          },
          secondary: {
            main: 'rgb(248, 189, 7)',
          },
          error: {
            main: red.A400,
          },
          background: {
            default: '#F7F7F7',
            paper: '#FEFEFE',
          },
        },
      }),
    [],
  );
  return (
    <ThemeProvider theme={newTheme}>
      <CssBaseline />
      <MainContainer>{children}</MainContainer>
    </ThemeProvider>
  );
}

const MainContainer = ({ children }: React.PropsWithChildren) => {
  const theme = useTheme();
  return (
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
  );
};
