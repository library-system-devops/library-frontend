// src/components/loans/MemberLoans.js
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
import { History, AlertCircle, Info } from 'lucide-react';
import loanService from '../../services/loanService';
import { format } from 'date-fns';
import LoanHistoryDialog from './LoanHistoryDialog';

export default function MemberLoans() {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState(null);

    useEffect(() => {
        fetchLoans();
    }, []);

    const fetchLoans = async () => {
        try {
            setLoading(true);
            const data = await loanService.getAllLoans('MEMBER');
            setLoans(data);
            setError('');
        } catch (err) {
            setError('Failed to fetch your loans');
            setLoans([]);
        } finally {
            setLoading(false);
        }
    };

    const getDueDateInfo = (loan) => {
        const effectiveDueDate = loan.renewalDueDate || loan.dueDate;
        const isOverdue = loan.isOverdue;
        const daysUntilDue = Math.ceil((new Date(effectiveDueDate) - new Date()) / (1000 * 60 * 60 * 24));

        return (
            <Box>
                <Typography variant="body2">
                    {format(new Date(effectiveDueDate), 'MMM dd, yyyy')}
                </Typography>
                {!loan.returnDate && (
                    <Typography
                        variant="caption"
                        color={isOverdue ? "error" : daysUntilDue <= 3 ? "warning.main" : "text.secondary"}
                    >
                        {isOverdue ?
                            `${Math.abs(daysUntilDue)} days overdue` :
                            `${daysUntilDue} days remaining`}
                    </Typography>
                )}
            </Box>
        );
    };

    const getStatusChip = (loan) => {
        if (loan.returnDate) {
            return <Chip label="Returned" color="success" size="small" />;
        }

        if (loan.isOverdue) {
            return (
                <Tooltip title="This loan is overdue">
                    <Chip
                        label="Overdue"
                        color="error"
                        size="small"
                        icon={<AlertCircle className="w-4 h-4" />}
                    />
                </Tooltip>
            );
        }

        return <Chip label="Active" color="primary" size="small" />;
    };

    const getRenewalInfo = (loan) => {
        if (loan.returnDate) return null;

        const renewalMessage = loan.isRenewable ?
            "Eligible for renewal - please contact library staff" :
            loan.renewalCount >= loan.maxRenewals ?
                "Maximum renewals reached" :
                "Not eligible for renewal";

        return (
            <Box>
                <Typography variant="caption" display="block" color="text.secondary">
                    Renewals: {loan.renewalCount} of {loan.maxRenewals}
                </Typography>
                <Box className="flex items-center gap-2 mt-1">
                    <Tooltip title={renewalMessage}>
                        <IconButton size="small">
                            <Info className="w-4 h-4" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="View loan history">
                        <IconButton
                            size="small"
                            onClick={() => {
                                setSelectedLoan(loan);
                                setHistoryDialogOpen(true);
                            }}
                        >
                            <History className="w-4 h-4" />
                        </IconButton>
                    </Tooltip>
                </Box>
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
            <Typography variant="h6" gutterBottom>
                My Loans
            </Typography>

            {error && (
                <Alert severity="error" className="mb-4" onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            {loans.length === 0 ? (
                <Alert severity="info">
                    You don't have any loans yet.
                </Alert>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Book</TableCell>
                                <TableCell>Loan Date</TableCell>
                                <TableCell>Due Date</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Renewals</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loans
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((loan) => (
                                    <TableRow key={loan.id}>
                                        <TableCell>{loan.bookTitle}</TableCell>
                                        <TableCell>
                                            {format(new Date(loan.loanDate), 'MMM dd, yyyy')}
                                        </TableCell>
                                        <TableCell>{getDueDateInfo(loan)}</TableCell>
                                        <TableCell>{getStatusChip(loan)}</TableCell>
                                        <TableCell>{getRenewalInfo(loan)}</TableCell>
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
            )}

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