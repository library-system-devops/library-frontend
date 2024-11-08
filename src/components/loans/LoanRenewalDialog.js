import { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, Typography, List, ListItem,
    ListItemText, Divider, Alert, Box
} from '@mui/material';
import { format } from 'date-fns';

export default function LoanRenewalDialog({
    loan,
    open,
    onClose,
    onRenew
}) {
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRenewal = async () => {
        try {
            setLoading(true);
            setError('');
            await onRenew(loan.id, reason);
            onClose();
        } catch (err) {
            setError(err.response?.data || 'Failed to renew loan');
        } finally {
            setLoading(false);
        }
    };

    if (!loan) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Renew Loan</DialogTitle>
            <DialogContent>
                <Box className="space-y-4">
                    {error && (
                        <Alert severity="error" className="mt-4">
                            {error}
                        </Alert>
                    )}

                    <Box className="mt-4">
                        <Typography variant="subtitle2" gutterBottom>
                            Book Details
                        </Typography>
                        <Typography variant="body1">{loan.bookTitle}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Current due date: {format(new Date(loan.renewalDueDate || loan.dueDate), 'PPP')}
                        </Typography>
                    </Box>

                    <Box className="mt-4">
                        <Typography variant="subtitle2" gutterBottom>
                            Renewal Status
                        </Typography>
                        <Typography variant="body2">
                            Renewals used: {loan.renewalCount} of {loan.maxRenewals}
                        </Typography>
                    </Box>

                    <TextField
                        fullWidth
                        label="Reason for Renewal (Optional)"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        multiline
                        rows={2}
                        disabled={loading}
                        className="mt-4"
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button
                    onClick={handleRenewal}
                    variant="contained"
                    disabled={loading}
                >
                    {loading ? 'Renewing...' : 'Renew Loan'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}