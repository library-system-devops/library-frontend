// src/components/pages/UsersPage.js
import DashboardLayout from '../layouts/DashboardLayout';
import UserList from '../user/UserList';
import { Paper } from '@mui/material';

export default function UsersPage() {
    return (
        <DashboardLayout title="User Management">
            <Paper className="p-4">
                <UserList />
            </Paper>
        </DashboardLayout>
    );
}