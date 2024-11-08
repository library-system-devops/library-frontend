import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Alert,
    CircularProgress
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import reservationService from '../../services/reservationService';

export default function ReserveBookDialog({ book, open, onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [queuePosition, setQueuePosition] = useState(null);
    const [confirmed, setConfirmed] = useState(false);
    const { user } = useAuth(); // Get the current user from auth context

    const handleReserve = async () => {
        if (!user?.id) {
            setError('User not authenticated');
            return;
        }

        try {
            setLoading(true);
            setError('');
            const response = await reservationService.reserveBook(book.id, user.id);
            setQueuePosition(response.queuePosition);
            setConfirmed(true);
            if (onSuccess) onSuccess(response);
        } catch (err) {
            setError(err.response?.data || 'Failed to reserve book. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setError('');
        setQueuePosition(null);
        setConfirmed(false);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                Reserve Book
            </DialogTitle>
            <DialogContent>
                {error && (
                    <Alert severity="error" className="mb-4">
                        {error}
                    </Alert>
                )}

                {!confirmed ? (
                    <Box className="space-y-4">
                        <Typography variant="h6">
                            {book?.title}
                        </Typography>
                        <Typography variant="body1">
                            Would you like to reserve this book? You'll be notified when it becomes available.
                        </Typography>
                        {loading && (
                            <Box className="flex justify-center">
                                <CircularProgress size={24} />
                            </Box>
                        )}
                    </Box>
                ) : (
                    <Box className="space-y-4">
                        <Alert severity="success">
                            Book reserved successfully!
                        </Alert>
                        {queuePosition && (
                            <Typography variant="body1">
                                Your position in the queue: {queuePosition}
                            </Typography>
                        )}
                        <Typography variant="body2" color="text.secondary">
                            We'll notify you when the book becomes available.
                        </Typography>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={loading}>
                    {confirmed ? 'Close' : 'Cancel'}
                </Button>
                {!confirmed && (
                    <Button
                        onClick={handleReserve}
                        variant="contained"
                        disabled={loading}
                    >
                        Reserve Book
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}