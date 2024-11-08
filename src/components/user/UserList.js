// src/components/users/UserList.js
import { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
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
import { Pencil, Search } from 'lucide-react';
import userService from '../../services/userService';
import EditUserDialog from './EditUserDialog';

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await userService.getAllUsers();
            setUsers(data);
            setError('');
        } catch (err) {
            setError('Failed to fetch users');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setEditDialogOpen(true);
    };

    const handleUserUpdated = (updatedUser) => {
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === updatedUser.id ? updatedUser : user
            )
        );
    };

    const handleSearch = (event) => {
        setSearch(event.target.value);
        setPage(0);
    };

    const getStatusChip = (status) => {
        const statusColors = {
            ACTIVE: 'success',
            SUSPENDED: 'error',
            EXPIRED: 'warning'
        };
        return <Chip label={status} color={statusColors[status]} size="small" />;
    };

    const getRoleChip = (role) => {
        const roleColors = {
            ADMIN: 'error',
            LIBRARIAN: 'warning',
            MEMBER: 'primary'
        };
        return <Chip label={role} color={roleColors[role]} size="small" />;
    };

    const filteredUsers = users.filter((user) =>
        user.username.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(search.toLowerCase())
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
            <Box className="flex justify-between items-center mb-4">
                <Typography variant="h6" component="h2">
                    User Management
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" className="mb-4" onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            <Box className="mb-4">
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search users..."
                    value={search}
                    onChange={handleSearch}
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
                            <TableCell>Username</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <Typography variant="body2" className="font-medium">
                                            {user.username}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {`${user.firstName} ${user.lastName}`}
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{getRoleChip(user.role)}</TableCell>
                                    <TableCell>{getStatusChip(user.status)}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={() => handleEditClick(user)}
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredUsers.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                />
            </TableContainer>

            <EditUserDialog
                user={selectedUser}
                open={editDialogOpen}
                onClose={() => {
                    setEditDialogOpen(false);
                    setSelectedUser(null);
                }}
                onUserUpdated={handleUserUpdated}
            />
        </Box>
    );
}