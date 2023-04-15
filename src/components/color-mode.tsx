import { Box, useTheme } from '@mui/material';
import { IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import React from 'react';
import { useColorMode } from '@/context/color-mode';
export default function ColorMode() {
  const theme = useTheme();
  const { toggleColorMode } = useColorMode();
  return (
    <Box
      sx={{
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'right',
      }}
    >
      <IconButton
        sx={{ ml: 1 }}
        onClick={() => toggleColorMode()}
        color="primary"
      >
        {theme.palette.mode === 'dark' ? (
          <Brightness7Icon />
        ) : (
          <Brightness4Icon />
        )}
      </IconButton>
    </Box>
  );
}
