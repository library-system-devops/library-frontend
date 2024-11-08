import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    Box,
    Alert
} from '@mui/material';
import { Search } from 'lucide-react';
import userService from '../../services/userService';

export default function UserSelectionDialog({ open, onClose, onUserSelected }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (open) {
            fetchMembers();
        } else {
            setSearchQuery('');
            setError('');
        }
    }, [open]);

    const fetchMembers = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await userService.getAllMembers();
            setUsers(response);
        } catch (err) {
            setError('Failed to fetch members. Please try again.');
            console.error('Failed to fetch members:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = searchQuery.trim() === '' ? users : users.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelectUser = (user) => {
        onUserSelected(user);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    maxHeight: '80vh'
                }
            }}
        >
            <DialogTitle>Select Member</DialogTitle>
            <DialogContent>
                <Box className="space-y-4 pt-2">
                    <TextField
                        fullWidth
                        placeholder="Search members..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: <Search className="w-4 h-4 mr-2 text-gray-500" />
                        }}
                    />

                    {error && (
                        <Alert severity="error" className="mt-2">
                            {error}
                        </Alert>
                    )}

                    {loading ? (
                        <Box className="flex justify-center p-4">
                            <CircularProgress />
                        </Box>
                    ) : (
                        <List className="max-h-96 overflow-y-auto">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <ListItem
                                        key={user.id}
                                        button
                                        onClick={() => handleSelectUser(user)}
                                    >
                                        <ListItemText
                                            primary={`${user.firstName} ${user.lastName}`}
                                            secondary={`@${user.username}`}
                                        />
                                    </ListItem>
                                ))
                            ) : (
                                <ListItem>
                                    <ListItemText
                                        primary={searchQuery ? "No members match your search" : "No members found"}
                                    />
                                </ListItem>
                            )}
                        </List>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}