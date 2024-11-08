// src/components/dashboards/MemberDashboard.js
import { Paper, Typography, Grid, Card, CardContent } from '@mui/material';
import DashboardLayout from '../layouts/DashboardLayout';

function MemberDashboard() {
    return (
        <DashboardLayout title="Member Dashboard">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h5" gutterBottom>
                            Welcome to the Library
                        </Typography>
                        <Typography variant="body1">
                            View your loans and browse our collection.
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Current Loans
                            </Typography>
                            <Typography variant="h4">0</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Active Reservations
                            </Typography>
                            <Typography variant="h4">0</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </DashboardLayout>
    );
}

export default MemberDashboard;