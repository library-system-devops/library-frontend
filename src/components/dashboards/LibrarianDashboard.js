// src/components/dashboards/LibrarianDashboard.js
import { Paper, Typography, Grid, Card, CardContent } from '@mui/material';
import DashboardLayout from '../layouts/DashboardLayout';

function LibrarianDashboard() {
    return (
        <DashboardLayout title="Librarian Dashboard">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h5" gutterBottom>
                            Welcome, Librarian
                        </Typography>
                        <Typography variant="body1">
                            Manage books and member services from this dashboard.
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Books Available
                            </Typography>
                            <Typography variant="h4">0</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Current Loans
                            </Typography>
                            <Typography variant="h4">0</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Overdue Books
                            </Typography>
                            <Typography variant="h4">0</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </DashboardLayout>
    );
}

export default LibrarianDashboard;