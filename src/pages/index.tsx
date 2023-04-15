import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {
  AlertColor,
  Checkbox,
  CircularProgress,
  Grid,
  useTheme,
} from '@mui/material';
import { amountBrl } from '@/services/utils/amount';
import Head from 'next/head';
import PixIcon from '@mui/icons-material/Pix';
import { GetServerSideProps } from 'next';
import { parseCookies, setCookie } from 'nookies';
import { getAPIClient } from '@/services/api/axios';
import {
  createCharge,
  CreateChargeResponseData,
  CreateChargeRequestData,
} from '@/services/api/charge';
import AlertMessage from '@/components/alert';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Image from 'next/image';
import SecurityIcon from '@mui/icons-material/Security';

export default function Checkout({
  fakeDto,
  fakeCashback,
  authError,
}: {
  fakeDto: CreateChargeRequestData;
  fakeCashback: number;
  authError: any;
}) {
  const [checked, setChecked] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [alertInfo, setAlertInfo] = React.useState<{
    title: string;
    detail: string;
    severity: AlertColor;
  }>();
  const [pixResponse, setPixResponse] =
    React.useState<CreateChargeResponseData>();
  const [step, setStep] = React.useState(0);
  React.useEffect(() => {
    if (authError) {
      setAlertInfo({
        severity: 'error',
        detail: authError.detail,
        title: authError.title,
      });
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const theme = useTheme();

  return (
    <Grid container justifyContent={'center'} alignItems={'center'}>
      <Head>
        <title>Woovi checkout</title>
      </Head>
      <AlertMessage
        open={alertInfo ? true : false}
        onClose={() => setAlertInfo(undefined)}
        title={alertInfo?.title}
        detail={alertInfo?.detail}
        severity={alertInfo?.severity}
      />
      <Grid
        item
        xs={12}
        lg={4}
        sx={{
          backgroundColor: theme.palette.background.paper,
          display: 'inline-block',
          padding: theme.spacing(4),
          borderRadius: theme.shape.borderRadius,
        }}
      >
        <Grid container spacing={2} textAlign={'center'}>
          <Grid item xs={12}>
            <MainLogo />
          </Grid>
          {step === 0 ? (
            <>
              <Grid item xs={12}>
                <Typography variant="h6">
                  {fakeDto.debtor.name}, como você deseja pagar ?
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Box
                  position={'relative'}
                  sx={{
                    border: `2px solid ${
                      checked
                        ? theme.palette.primary.main
                        : theme.palette.grey[400]
                    }`,
                    borderRadius: theme.shape.borderRadius,
                  }}
                >
                  <Box
                    sx={{
                      width: '15%',
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
                    }}
                  >
                    <Box display={'flex'} alignItems="center">
                      <Typography id="modal-modal-title" variant="h6">
                        <span style={{ fontWeight: 'bold' }}>1x </span>
                        {amountBrl(fakeDto.amount)}
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
                      Ganhe {fakeCashback}% de cashback de volta
                    </Typography>

                    <Box
                      sx={{
                        backgroundColor: theme.palette.secondary.main,
                        padding: theme.spacing(1),
                        borderRadius: theme.shape.borderRadius,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <MainLogo size="26px" color={'#FFF'} />
                      <Typography
                        id="modal-modal-title"
                        variant="subtitle2"
                        color={'#fff'}
                        marginLeft={1}
                      >
                        {amountBrl(fakeDto.amount * (fakeCashback / 100))} de
                        volta no seu Pix na hora
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
                        const response = await createCharge(fakeDto);
                        setPixResponse(response);

                        setAlertInfo({
                          title: 'Success',
                          detail: 'Cobrança criada',
                          severity: 'success',
                        });
                        setStep(1);
                        setTimeout(() => {
                          setAlertInfo({
                            title: 'Confirmação de pagamento',
                            detail: 'Seu pagamento foi confirmado',
                            severity: 'success',
                          });
                          setStep(0);
                        }, 10000);
                      } catch (error: any) {
                        setAlertInfo({
                          title:
                            error.title ??
                            error.message ??
                            'Internal server Error',
                          detail: error.detail ?? 'An unexpected error ocurred',
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
            </>
          ) : (
            <>
              <Grid item xs={12}>
                <Typography variant="h6">
                  {fakeDto.debtor.name}, pague o valor de{' '}
                  {amountBrl(fakeDto.amount)} pelo Pix
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Image
                  src={pixResponse?.qr_code as string}
                  alt="Pix QrCode"
                  width={220}
                  height={220}
                ></Image>
              </Grid>
              <Grid item xs={12}>
                <Button
                  onClick={() => handleClickCopy(pixResponse?.emv as string)}
                  color={'secondary'}
                  endIcon={<ContentCopyIcon />}
                  fullWidth
                  variant="contained"
                  sx={{
                    color: '#fff',
                  }}
                >
                  Clique para copiar o qrcode
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color={theme.palette.grey[600]}>
                  Prazo de pagamento:
                </Typography>
                <Typography variant="subtitle1">
                  {new Date(pixResponse?.expiration as number).toLocaleString()}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <CircularProgress />
              </Grid>
            </>
          )}
          <Grid item xs={12} justifyContent={'center'} display={'flex'}>
            <SecurityInfo />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

function SecurityInfo() {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
      <SecurityIcon sx={{ color: theme.palette.grey[600], margin: 1 }} />
      <Typography
        variant="subtitle2"
        color={theme.palette.grey[600]}
        marginRight={1}
      >
        Pagamento 100% seguro via
      </Typography>
      <MainLogo size="26px" color={theme.palette.grey[600]} />
    </Box>
  );
}
const handleClickCopy = (text: string) => {
  navigator.clipboard.writeText(text);
};

function MainLogo({ size, color }: { size?: string; color?: string }) {
  const defaultSize = '80px';
  const theme = useTheme();
  return (
    <PixIcon
      sx={{
        color: color ?? theme.palette.primary.main,
        width: size ?? defaultSize,
        height: size ?? defaultSize,
      }}
      fontSize="inherit"
    />
  );
}
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['checkout.nextauth.token']: token } = parseCookies(ctx);

  const api = getAPIClient(ctx);
  let authError = null;
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
      authError = error.response?.data;
    } finally {
    }
  }

  const mockCreateChargeDTO = {
    debtor: {
      name: 'Eduardo Conti',
      cpf: '50673646459',
    },
    amount: Math.floor(Math.random() * 99899 + 100),
    merchant: {
      postal_code: '86990000',
      city: 'Marialva',
      name: 'Eduardo Dev',
      category_code: '0000',
    },
    expiration: 3600,
  };

  return {
    props: {
      fakeDto: mockCreateChargeDTO,
      fakeCashback: Math.floor(Math.random() * 99) + 1,
      authError: authError,
    },
  };
};
