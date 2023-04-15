import Layout from '@/components/layout';
import CheckoutProvider from '@/context/checkout-context';
import '@/styles/globals.css';
import { Box, Button, Typography, useTheme } from '@mui/material';
import type { AppProps } from 'next/app';
import Router from 'next/router';
import { ErrorBoundary } from 'react-error-boundary';

export default function App({ Component, pageProps }: AppProps) {
  const theme = useTheme();
  return (
    <ErrorBoundary
      fallback={
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: `${theme.palette.background}`,
          }}
        >
          <Typography variant="h1">Oops, ocorreu um erro!</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => Router.reload()}
          >
            Tentar novamente
          </Button>
        </Box>
      }
    >
      <Layout>
        <CheckoutProvider>
          <Component {...pageProps} />{' '}
        </CheckoutProvider>
      </Layout>
    </ErrorBoundary>
  );
}
