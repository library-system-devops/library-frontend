import DashboardLayout from '../layouts/DashboardLayout';
import BookList from '../books/BookList';
import { Paper } from '@mui/material';

export default function BooksPage() {
    return (
        <DashboardLayout title="Book Collection">
            <Paper className="p-4">
                <BookList />
            </Paper>
        </DashboardLayout>
    );
}