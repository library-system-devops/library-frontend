// src/components/dashboards/AdminDashboard.js
import { Paper, Typography, Grid, Card, CardContent, Box, CircularProgress } from '@mui/material';
import DashboardLayout from '../layouts/DashboardLayout';
import bookService from "../../services/bookService";  // Assuming you have a bookService for API calls
import { useEffect, useState } from 'react';
import userService from "../../services/userService";
import loanService from "../../services/loanService";           // Import hooks from React



function AdminDashboard() {

    const [totalBooks, setTotalBooks] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalActiveLoans, setTotalActiveLoans] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTotalBooks();
        fetchTotalUsers();
        fetchActiveLoans();
    }, []);

    const fetchTotalBooks = async () => {
        try {
            setLoading(true);
            const data = await bookService.getBookCount();
            setTotalBooks(data);
            setError('');
        } catch (err) {
            setError(err.response?.data || 'Failed to fetch book count');
            setTotalBooks(-1);
        } finally {
            setLoading(false);
        }
    };

    const fetchTotalUsers = async () => {
        try {
            setLoading(true);
            const data = await userService.getUserCount();
            setTotalUsers(data);
            setError('');
        } catch (err) {
            setError(err.response?.data || 'Failed to fetch user count');
            setTotalUsers(-1);
        } finally {
            setLoading(false);
        }

    };

    const fetchActiveLoans = async () => {
        try {
            setLoading(true);
            const data = await loanService.getActiveLoanCount();
            setTotalActiveLoans(data);
            setError('');
        } catch (err) {
            setError(err.response?.data || 'Failed to fetch active loan count');
            setTotalActiveLoans(-1);
        } finally {
            setLoading(false);
        }

    };


    if (loading) {
        return (
            <Box className="flex items-center justify-center p-4">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <DashboardLayout title="Admin Dashboard">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h5" gutterBottom>
                            Welcome, Administrator
                        </Typography>
                        <Typography variant="body1">
                            Manage your library system from this dashboard.
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Total Users
                            </Typography>
                            <Typography variant="h4">{totalUsers}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Total Books
                            </Typography>
                            <Typography variant="h4">{totalBooks}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Active Loans
                            </Typography>
                            <Typography variant="h4">{totalActiveLoans}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </DashboardLayout>

    );
}

export default AdminDashboard;