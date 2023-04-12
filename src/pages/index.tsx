import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {
  AlertColor,
  Checkbox,
  CircularProgress,
  Grid,
  useTheme,
} from '@mui/material';
import { amountBrl } from '@/services/utils/amount';
import Head from 'next/head';
import { blue } from '@mui/material/colors';
import PixIcon from '@mui/icons-material/Pix';
import { GetServerSideProps } from 'next';
import { parseCookies, setCookie } from 'nookies';
import { getAPIClient } from '@/services/api/axios';
import { createCharge } from '@/services/api/charge';
import AlertMessage from '@/components/alert';

const mockCreateChargeDTO = {
  debtor: {
    name: 'Eduardo Conti',
    cpf: '50673646459',
  },
  amount: 999999,
  merchant: {
    postal_code: '86990000',
    city: 'Marialva',
    name: 'Eduardo Dev',
    category_code: '0000',
  },
  expiration: 86400,
};

const cashback = 3;
export default function BasicModal() {
  const [checked, setChecked] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);
  const [alertInfo, setAlertInfo] = React.useState<{
    title: string;
    detail: string;
    severity: AlertColor;
  }>();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const theme = useTheme();

  return (
    <Box>
      <AlertMessage
        open={openAlert}
        onClose={() => setOpenAlert(false)}
        title={alertInfo?.title}
        detail={alertInfo?.detail}
      />
      <Head>
        <title>Woovi checkout</title>
      </Head>
      <Modal
        open={true}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            bgcolor: 'background.paper',
            borderRadius: theme.shape.borderRadius,
            boxShadow: 24,
            p: 4,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Grid container spacing={2} textAlign={'center'}>
            <Grid item xs={12}>
              <svg width="120" viewBox="0 0 377 144" version="1.1">
                <g fill="#03d69d">
                  <path d="M296.8,112L296.8,112c-5.9,0-11.2-3.5-13.4-9l-19.9-47.8c-2.5-6,1.9-12.5,8.3-12.5h0c3.7,0,7,2.2,8.4,5.7 l16.6,41.3l16.6-41.3c1.4-3.4,4.7-5.7,8.4-5.7h0c6.5,0,10.8,6.6,8.3,12.5L310.2,103C307.9,108.5,302.6,112,296.8,112z"></path>
                  <path d="M357.8,14.5c2.1,2.2,3.2,4.7,3.2,7.7c0,3-1.1,5.6-3.2,7.6c-2.1,2-4.8,3-7.9,3c-3.2,0-5.9-1-8-3 s-3.1-4.6-3.1-7.6c0-3,1.1-5.5,3.2-7.7s4.8-3.3,7.9-3.3S355.7,12.4,357.8,14.5z M340.8,102.9V52c0-5,4.1-9.1,9.1-9.1l0,0 c5,0,9.1,4.1,9.1,9.1v50.8c0,5-4.1,9.1-9.1,9.1l0,0C344.9,112,340.8,107.9,340.8,102.9z"></path>
                  <g>
                    <path d="M77.7,112L77.7,112c-5.5,0-10.2-3.6-11.6-8.8L57,69.4l-9.2,33.8c-1.4,5.2-6.1,8.8-11.5,8.8h0 c-5.3,0-10-3.5-11.5-8.7L10.6,53.7c-1.5-5.3,2.5-10.6,8-10.6h0c3.7,0,7,2.5,8,6.1L37,86.5l9.7-35.6c1.3-4.6,5.4-7.8,10.2-7.8h0 c4.8,0,9,3.2,10.2,7.8l9.7,35.6l10.3-37.3c1-3.6,4.3-6.1,8-6.1h0.1c5.5,0,9.5,5.3,8,10.6l-14.2,49.7C87.7,108.5,83,112,77.7,112z"></path>
                  </g>
                  <path d="M162.2,83.9c4.9,4.9,9.4,9.4,13.9,13.9c-10.2,12.5-22.9,20.2-39.8,17c-15.7-3-26-12.7-30.1-28.3 c-4.3-16.5,3.3-33.6,18-42c14.7-8.4,33.1-6.2,45.2,5.7c13.5,13.2,26.7,26.7,40.1,40c6.9,6.8,17.1,7.6,24.5,2.1 c8.3-6.2,9.8-18.2,3.4-26.3c-6.5-8.1-18.5-9.4-26.3-2.6c-2.7,2.3-4.9,5.2-7.2,7.8c-5-5-9.5-9.5-14-14c9.9-12.2,22.4-20.5,41-16.8 c15.5,3,27,15.7,29.6,31.6c2.5,15.6-5.7,31.7-20,39.2c-14.6,7.6-32.3,5-44.2-6.7c-13.3-13.2-26.5-26.5-39.8-39.7 c-5.7-5.7-13.7-7.4-20.7-4.2c-7.1,3.2-11,8.8-11.1,16.7c-0.1,7.8,3.5,13.7,10.6,17c7.2,3.3,14,2.3,20-2.9 C157.9,89,160,86.3,162.2,83.9z"></path>
                </g>
              </svg>
            </Grid>
            <Grid item xs={12}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Eduardo, como você deseja pagar ?
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Box
                position={'relative'}
                sx={{
                  border: `1px solid ${
                    checked
                      ? theme.palette.primary.main
                      : theme.palette.grey[400]
                  }`,
                  borderRadius: theme.shape.borderRadius,
                }}
              >
                <Box
                  sx={{
                    width: '10%',
                    height: 30,
                    position: 'absolute',
                    backgroundColor: theme.palette.grey[400],
                    zIndex: 2,
                    top: -15,
                    left: 15,
                    borderRadius: 10,
                    alignContent: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    justifyItems: 'center',
                    display: 'flex',
                  }}
                >
                  <Typography
                    id="modal-modal-title"
                    variant="subtitle1"
                    component="h4"
                  >
                    Pix
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: '100%',
                    padding: theme.spacing(2),
                    textAlign: 'left',
                    position: 'relative',
                    border: theme.shape,
                  }}
                >
                  <Box display={'flex'} alignItems="center">
                    <Typography id="modal-modal-title" variant="h6">
                      <span style={{ fontWeight: 'bold' }}>1x </span>
                      {amountBrl(mockCreateChargeDTO.amount)}
                    </Typography>
                    <Box display={'flex'} justifyContent={'right'} flex={1}>
                      <Checkbox
                        checked={checked}
                        onChange={handleChange}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    </Box>
                  </Box>

                  <Typography
                    id="modal-modal-title"
                    variant="subtitle1"
                    color={theme.palette.primary.main}
                    fontWeight={'bold'}
                  >
                    Ganhe {cashback}% de cashback de volta
                  </Typography>

                  <Box
                    sx={{
                      backgroundColor: blue[900],
                      padding: theme.spacing(1),
                      borderRadius: theme.shape.borderRadius,
                      display: 'flex',
                    }}
                  >
                    <PixIcon color={'info'} />
                    <Typography
                      id="modal-modal-title"
                      variant="subtitle1"
                      color={'#fff'}
                      marginLeft={1}
                    >
                      {amountBrl(mockCreateChargeDTO.amount * (cashback / 100))}{' '}
                      de volta no seu Pix na hora
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              {loading ? (
                <CircularProgress />
              ) : (
                <Button
                  fullWidth
                  variant="contained"
                  disabled={!checked || loading}
                  onClick={async () => {
                    try {
                      setLoading(true);
                      await createCharge(mockCreateChargeDTO);
                      setOpenAlert(true);
                      setAlertInfo({
                        title: 'Success',
                        detail: 'Charge created',
                        severity: 'success',
                      });
                    } catch (error: any) {
                      setOpenAlert(true);
                      setAlertInfo({
                        title: error.title,
                        detail: error.detail,
                        severity: 'error',
                      });
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  gerar qrcode
                </Button>
              )}
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['checkout.nextauth.token']: token } = parseCookies(ctx);

  const api = getAPIClient(ctx);
  if (!token) {
    try {
      const {
        data: { access_token },
      } = await api.post(`/login`, {
        email: process.env.NEXT_PUBLIC_API_EMAIL as string,
        password: process.env.NEXT_PUBLIC_API_PASS as string,
      });

      setCookie(ctx, 'checkout.nextauth.token', access_token, {
        maxAge: 60 * 60 * 1,
      });
      api.defaults.headers['Authorization'] = `Bearer ${access_token}`;
    } catch (error: any) {
      console.log(error);
    } finally {
    }
  }
  return {
    props: {},
  };
};
