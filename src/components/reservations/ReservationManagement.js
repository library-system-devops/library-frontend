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
    Button,
    TextField
} from '@mui/material';
import { Search } from 'lucide-react';
import reservationService from '../../services/reservationService';
import { format } from 'date-fns';

export default function ReservationManagement() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
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
            setError('Failed to fetch reservations');
            setReservations([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFulfill = async (reservationId) => {
        try {
            await reservationService.fulfillReservation(reservationId);
            fetchReservations(); // Refresh the list
        } catch (err) {
            setError('Failed to fulfill reservation');
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

    const filteredReservations = reservations.filter(reservation =>
        reservation.bookTitle.toLowerCase().includes(search.toLowerCase()) ||
        reservation.userName.toLowerCase().includes(search.toLowerCase())
    );

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
                Manage Reservations
            </Typography>

            {error && (
                <Alert severity="error" className="mb-4" onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            <Box className="mb-4">
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search by book title or member name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                        startAdornment: <Search className="w-4 h-4 mr-2 text-gray-500" />
                    }}
                    size="small"
                />
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Book</TableCell>
                            <TableCell>Member</TableCell>
                            <TableCell>Reservation Date</TableCell>
                            <TableCell>Expiration Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Queue Position</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredReservations
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((reservation) => (
                                <TableRow key={reservation.id}>
                                    <TableCell>{reservation.bookTitle}</TableCell>
                                    <TableCell>{reservation.userName}</TableCell>
                                    <TableCell>
                                        {format(new Date(reservation.reservationDate), 'MMM dd, yyyy')}
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(reservation.expirationDate), 'MMM dd, yyyy')}
                                    </TableCell>
                                    <TableCell>{getStatusChip(reservation.status)}</TableCell>
                                    <TableCell>{reservation.queuePosition || '-'}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredReservations.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                />
            </TableContainer>
        </Box>
    );
}