import { useTheme } from '@mui/material';
import PixIcon from '@mui/icons-material/Pix';

export default function MainLogo({
  size,
  color,
}: {
  size?: string;
  color?: string;
}) {
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
