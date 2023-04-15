import * as React from 'react';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';

export default function Layout({ children }: React.PropsWithChildren) {
  const newTheme = React.useMemo(
    () =>
      createTheme({
        palette: {
          primary: {
            main: '#673ab7',
          },
          secondary: {
            main: '#f50057',
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
