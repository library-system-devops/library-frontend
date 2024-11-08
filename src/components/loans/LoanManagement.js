import { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Box,
    Typography,
    Chip,
    TablePagination,
    Alert,
    CircularProgress,
    IconButton,
    Tooltip
} from '@mui/material';
import { History, RefreshCw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import loanService from '../../services/loanService';
import { format, isAfter } from 'date-fns';
import LoanRenewalDialog from './LoanRenewalDialog';
import LoanHistoryDialog from './LoanHistoryDialog';
import UserSelectionDialog from './UserSelectionDialog';
import BookSelectionDialog from './BookSelectionDialog';

export default function LoanManagement() {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [renewalDialogOpen, setRenewalDialogOpen] = useState(false);
    const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
    const [userDialogOpen, setUserDialogOpen] = useState(false);
    const [bookDialogOpen, setBookDialogOpen] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const { userRole } = useAuth();

    const isStaff = userRole === 'ADMIN' || userRole === 'LIBRARIAN';

    useEffect(() => {
        fetchLoans();
    }, [userRole]);

    const fetchLoans = async () => {
        try {
            setLoading(true);
            const data = await loanService.getAllLoans(userRole);
            setLoans(data);
            setError('');
        } catch (err) {
            setError('Failed to fetch loans');
            setLoans([]);
        } finally {
            setLoading(false);
        }
    };

    const handleStartCheckout = () => {
        setSelectedUser(null);
        setUserDialogOpen(true);
    };

    const handleUserSelected = async (user) => {
        setSelectedUser(user);
        setUserDialogOpen(false);
        setBookDialogOpen(true);
    };

    const handleBookSelected = async (book) => {
        try {
            await loanService.checkoutBook(book.id, selectedUser.id);
            setBookDialogOpen(false);
            setError('');
            fetchLoans();
        } catch (err) {
            setError(err.response?.data || 'Failed to checkout book');
        }
    };

    const handleRenewal = async (loanId, reason) => {
        try {
            const updatedLoan = await loanService.renewLoan(loanId, reason);
            setLoans(prevLoans =>
                prevLoans.map(loan =>
                    loan.id === loanId ? updatedLoan : loan
                )
            );
            setError('');
        } catch (err) {
            throw err;
        }
    };

    const handleReturn = async (loanId) => {
        try {
            await loanService.returnBook(loanId);
            fetchLoans();
        } catch (err) {
            setError(err.response?.data || 'Failed to return book');
        }
    };

    const handleOpenRenewal = (loan) => {
        setSelectedLoan(loan);
        setRenewalDialogOpen(true);
    };

    const handleOpenHistory = (loan) => {
        setSelectedLoan(loan);
        setHistoryDialogOpen(true);
    };

    const getStatusChip = (loan) => {
        if (loan.returnDate) {
            return <Chip label="Returned" color="success" size="small" />;
        }

        const effectiveDueDate = loan.renewalDueDate || loan.dueDate;

        if (loan.isOverdue) {
            return <Chip label="Overdue" color="error" size="small" />;
        }

        return <Chip label="Active" color="primary" size="small" />;
    };

    const getRenewalStatus = (loan) => {
        if (loan.returnDate) return null;

        return (
            <Box className="flex items-center gap-2">
                <Typography variant="caption" color="text.secondary">
                    Renewals: {loan.renewalCount}/{loan.maxRenewals}
                </Typography>
                {loan.isRenewable && (
                    <Tooltip title="Renew loan">
                        <IconButton
                            size="small"
                            onClick={() => handleOpenRenewal(loan)}
                        >
                            <RefreshCw className="w-4 h-4" />
                        </IconButton>
                    </Tooltip>
                )}
                <Tooltip title="View history">
                    <IconButton
                        size="small"
                        onClick={() => handleOpenHistory(loan)}
                    >
                        <History className="w-4 h-4" />
                    </IconButton>
                </Tooltip>
            </Box>
        );
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
            <Box className="flex justify-between items-center mb-4">
                <Typography variant="h6" component="h2">
                    {isStaff ? "Loan Management" : "My Loans"}
                </Typography>
                {isStaff && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleStartCheckout}
                    >
                        New Loan
                    </Button>
                )}
            </Box>

            {error && (
                <Alert severity="error" className="mb-4" onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Book</TableCell>
                            {isStaff && <TableCell>User</TableCell>}
                            <TableCell>Loan Date</TableCell>
                            <TableCell>Due Date</TableCell>
                            <TableCell>Return Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Renewals</TableCell>
                            {isStaff && <TableCell>Actions</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loans
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((loan) => (
                                <TableRow key={loan.id}>
                                    <TableCell>{loan.bookTitle}</TableCell>
                                    {isStaff && <TableCell>{loan.userName}</TableCell>}
                                    <TableCell>
                                        {format(new Date(loan.loanDate), 'MMM dd, yyyy')}
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(loan.renewalDueDate || loan.dueDate), 'MMM dd, yyyy')}
                                    </TableCell>
                                    <TableCell>
                                        {loan.returnDate ?
                                            format(new Date(loan.returnDate), 'MMM dd, yyyy') :
                                            '-'}
                                    </TableCell>
                                    <TableCell>{getStatusChip(loan)}</TableCell>
                                    <TableCell>{getRenewalStatus(loan)}</TableCell>
                                    {isStaff && (
                                        <TableCell>
                                            {!loan.returnDate && (
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    onClick={() => handleReturn(loan.id)}
                                                >
                                                    Return
                                                </Button>
                                            )}
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={loans.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                />
            </TableContainer>

            {isStaff && (
                <>
                    <UserSelectionDialog
                        open={userDialogOpen}
                        onClose={() => setUserDialogOpen(false)}
                        onUserSelected={handleUserSelected}
                    />

                    <BookSelectionDialog
                        open={bookDialogOpen}
                        onClose={() => {
                            setBookDialogOpen(false);
                            setSelectedUser(null);
                        }}
                        onBookSelected={handleBookSelected}
                    />
                </>
            )}

            <LoanRenewalDialog
                loan={selectedLoan}
                open={renewalDialogOpen}
                onClose={() => {
                    setRenewalDialogOpen(false);
                    setSelectedLoan(null);
                }}
                onRenew={handleRenewal}
            />

            <LoanHistoryDialog
                loan={selectedLoan}
                open={historyDialogOpen}
                onClose={() => {
                    setHistoryDialogOpen(false);
                    setSelectedLoan(null);
                }}
            />
        </Box>
    );
}