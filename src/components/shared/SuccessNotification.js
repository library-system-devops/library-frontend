import { Snackbar, Alert } from '@mui/material';

function SuccessNotification({ open, message, onClose }) {
    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
            <Alert onClose={onClose} severity="success" sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
}