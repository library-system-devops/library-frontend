import { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Typography,
    Chip,
    TablePagination,
    Alert,
    CircularProgress,
    IconButton,
    Tooltip
} from '@mui/material';
import { Info } from 'lucide-react';
import reservationService from '../../services/reservationService';
import { format } from 'date-fns';

export default function MemberReservations() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            setLoading(true);
            const data = await reservationService.getAllReservations();
            setReservations(data);
            setError('');
        } catch (err) {
            setError('Failed to fetch your reservations');
            setReservations([]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusChip = (status) => {
        const statusConfig = {
            ACTIVE: { color: 'primary', label: 'Active' },
            FULFILLED: { color: 'success', label: 'Fulfilled' },
            EXPIRED: { color: 'error', label: 'Expired' }
        };

        const config = statusConfig[status] || { color: 'default', label: status };
        return <Chip label={config.label} color={config.color} size="small" />;
    };

    if (loading) {
        return (
            <Box className="flex items-center justify-center p-4">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box className="p-4">
            <Typography variant="h6" gutterBottom>
                My Reservations
            </Typography>

            {error && (
                <Alert severity="error" className="mb-4" onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            {reservations.length === 0 ? (
                <Alert severity="info">
                    You don't have any reservations yet.
                </Alert>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Book</TableCell>
                                <TableCell>Reservation Date</TableCell>
                                <TableCell>Expiration Date</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Queue Position</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {reservations
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((reservation) => (
                                    <TableRow key={reservation.id}>
                                        <TableCell>{reservation.bookTitle}</TableCell>
                                        <TableCell>
                                            {format(new Date(reservation.reservationDate), 'MMM dd, yyyy')}
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(reservation.expirationDate), 'MMM dd, yyyy')}
                                        </TableCell>
                                        <TableCell>{getStatusChip(reservation.status)}</TableCell>
                                        <TableCell>
                                            {reservation.queuePosition ? (
                                                <Box className="flex items-center gap-2">
                                                    <Typography variant="body2">
                                                        Position: {reservation.queuePosition}
                                                    </Typography>
                                                    <Tooltip title="Your position in the reservation queue">
                                                        <IconButton size="small">
                                                            <Info className="w-4 h-4" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            ) : '-'}
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={reservations.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={(e, newPage) => setPage(newPage)}
                        onRowsPerPageChange={(e) => {
                            setRowsPerPage(parseInt(e.target.value, 10));
                            setPage(0);
                        }}
                    />
                </TableContainer>
            )}
        </Box>
    );
}