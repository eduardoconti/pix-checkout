import { Alert, AlertColor, AlertTitle, Snackbar } from '@mui/material';

export default function AlertMessage({
  open,
  severity,
  title,
  detail,
  onClose,
}: {
  open: boolean;
  severity?: AlertColor;
  title?: string;
  detail?: string;
  onClose: () => void;
}) {
  return open ? (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={open}
      autoHideDuration={3000}
      onClose={() => onClose()}
    >
      <Alert
        severity={severity}
        onClose={() => onClose()}
      >
        <AlertTitle>{title}</AlertTitle>
        {detail}
      </Alert>
    </Snackbar>
  ) : null;
}