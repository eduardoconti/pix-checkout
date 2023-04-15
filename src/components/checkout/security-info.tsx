import { Box, Typography, useTheme } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import MainLogo from '@/components/main-logo';

export default function SecurityInfo() {
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
