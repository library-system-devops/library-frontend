// src/components/users/EditUserDialog.js
import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    IconButton,
    Alert,
    MenuItem,
    Typography,
    Divider,
    Tooltip
} from '@mui/material';
import { X, HelpCircle } from 'lucide-react';
import userService from '../../services/userService';

export default function EditUserDialog({
                                           user,
                                           open,
                                           onClose,
                                           onUserUpdated
                                       }) {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        status: 'ACTIVE',
        role: 'MEMBER',
        password: ''  // Added password field
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                email: user.email || '',
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                status: user.status || 'ACTIVE',
                role: user.role || 'MEMBER',
                password: ''  // Always empty initially
            });
            setValidationErrors({});
            setError('');
        }
    }, [user]);

    const validateForm = () => {
        const errors = {};

        // Username validation
        if (!formData.username) {
            errors.username = 'Username is required';
        } else if (!/^[a-zA-Z0-9]{3,20}$/.test(formData.username)) {
            errors.username = 'Username must be 3-20 characters and contain only letters and numbers';
        }

        // Password validation (only if a new password is being set)
        if (formData.password && !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(formData.password)) {
            errors.password = 'Password must be at least 8 characters with letters and numbers';
        }

        // Email validation
        if (!formData.email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }

        // Name validation
        if (!formData.firstName) errors.firstName = 'First name is required';
        if (!formData.lastName) errors.lastName = 'Last name is required';

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear validation error when field is edited
        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Create update payload, omitting empty password
            const updatePayload = {
                ...user,
                ...formData,
            };

            // Only include password if it was actually entered
            if (!formData.password) {
                delete updatePayload.password;
            }

            const updatedUser = await userService.updateUser(user.id, updatePayload);
            onUserUpdated(updatedUser);
            onClose();
        } catch (err) {
            setError(err.response?.data || 'Failed to update user. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle className="flex justify-between items-center">
                Edit User
                <IconButton onClick={onClose} size="small">
                    <X className="w-4 h-4" />
                </IconButton>
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent>
                    {error && (
                        <Alert severity="error" className="mb-4">
                            {error}
                        </Alert>
                    )}

                    <Box className="space-y-4">
                        <Typography variant="subtitle2" gutterBottom>
                            Account Information
                        </Typography>

                        <TextField
                            fullWidth
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            error={!!validationErrors.username}
                            helperText={validationErrors.username}
                            disabled={loading}
                        />

                        <Box className="relative">
                            <TextField
                                fullWidth
                                label="New Password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                error={!!validationErrors.password}
                                helperText={validationErrors.password || "Leave blank to keep current password"}
                                disabled={loading}
                            />
                            <Tooltip title="Enter a new password only if you want to change it. Leave blank to keep the current password.">
                                <IconButton
                                    size="small"
                                    className="absolute right-2 top-2"
                                >
                                    <HelpCircle className="w-4 h-4" />
                                </IconButton>
                            </Tooltip>
                        </Box>

                        <Divider className="my-4" />
                        <Typography variant="subtitle2" gutterBottom>
                            Personal Information
                        </Typography>

                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={!!validationErrors.email}
                            helperText={validationErrors.email}
                            disabled={loading}
                        />

                        <TextField
                            fullWidth
                            label="First Name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            error={!!validationErrors.firstName}
                            helperText={validationErrors.firstName}
                            disabled={loading}
                        />

                        <TextField
                            fullWidth
                            label="Last Name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            error={!!validationErrors.lastName}
                            helperText={validationErrors.lastName}
                            disabled={loading}
                        />

                        <Divider className="my-4" />
                        <Typography variant="subtitle2" gutterBottom>
                            Account Status
                        </Typography>

                        <TextField
                            select
                            fullWidth
                            label="Status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            disabled={loading}
                        >
                            <MenuItem value="ACTIVE">Active</MenuItem>
                            <MenuItem value="SUSPENDED">Suspended</MenuItem>
                            <MenuItem value="EXPIRED">Expired</MenuItem>
                        </TextField>

                        <TextField
                            select
                            fullWidth
                            label="Role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            disabled={loading}
                        >
                            <MenuItem value="MEMBER">Member</MenuItem>
                            <MenuItem value="LIBRARIAN">Librarian</MenuItem>
                            <MenuItem value="ADMIN">Admin</MenuItem>
                        </TextField>
                    </Box>
                </DialogContent>

                <DialogActions className="p-4">
                    <Button onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}