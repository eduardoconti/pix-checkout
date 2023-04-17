import AlertMessage from '@/components/alert';
import MainLogo from '@/components/main-logo';
import { useCheckout } from '@/context/checkout-context';
import { createCharge } from '@/services/api/charge';
import { amountBrl } from '@/services/utils/amount';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Grid,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import Image from 'next/image';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SecurityInfo from '@/components/checkout/security-info';
import ColorMode from '@/components/color-mode';

export default function Checkout({
  fakeDto,
  fakeCashback,
}: {
  fakeDto: any;
  fakeCashback: number;
}) {
  const theme = useTheme();
  const {
    alertInfo,
    setAlertInfo,
    checked,
    setChecked,
    loading,
    setLoading,
    pixResponse,
    setPixResponse,
    setStep,
    step,
  } = useCheckout();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const handleClickCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleClickGenerateQrCode = async () => {
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
        title: error.title ?? error.message ?? 'Internal server Error',
        detail: error.detail ?? 'An unexpected error ocurred',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container justifyContent={'center'} alignItems={'center'}>
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
          padding: theme.spacing(2),
          borderRadius: theme.shape.borderRadius,
        }}
      >
        <Grid item xs={12}>
          <ColorMode />
        </Grid>
        <Grid container spacing={2} textAlign={'center'}>
          <Grid item xs={12}>
            <MainLogo />
          </Grid>
          {step === 0 ? (
            <>
              <Grid item xs={12}>
                <Paper elevation={0}>
                  <Typography variant="h6" component="h6">
                    {fakeDto.debtor.name}, como você deseja pagar ?
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper
                  elevation={1}
                  sx={{
                    border: `2px solid ${
                      checked
                        ? theme.palette.primary.main
                        : theme.palette.grey[400]
                    }`,
                    position: 'relative',
                    borderRadius: theme.shape.borderRadius,
                  }}
                >
                  <Paper
                    elevation={4}
                    sx={{
                      width: '15%',
                      height: 30,
                      position: 'absolute',
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
                  </Paper>
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
                </Paper>
              </Grid>
              <Grid item xs={12}>
                {loading ? (
                  <CircularProgress />
                ) : (
                  <Button
                    fullWidth
                    variant="contained"
                    disabled={!checked || loading}
                    onClick={handleClickGenerateQrCode}
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
