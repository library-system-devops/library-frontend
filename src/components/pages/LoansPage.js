// src/components/pages/LoansPage.js
import DashboardLayout from '../layouts/DashboardLayout';
import LoanManagement from '../loans/LoanManagement';
import { Paper } from '@mui/material';

export default function LoansPage() {
    return (
        <DashboardLayout title="Loan Management">
            <Paper className="p-4">
                <LoanManagement />
            </Paper>
        </DashboardLayout>
    );
}