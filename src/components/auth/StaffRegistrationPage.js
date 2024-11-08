// src/components/auth/StaffRegistrationPage.js
import { useState } from 'react';
import {
    TextField,
    Button,
    MenuItem,
    Alert,
    Snackbar,
    Paper,
    Box,
    Typography
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import authService from '../../services/auth/authService';
import DashboardLayout from '../layouts/DashboardLayout';

function StaffRegistrationPage() {
    const { userRole } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        firstName: '',
        lastName: '',
        role: 'MEMBER',
    });
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const roles = userRole === 'ADMIN'
        ? ['MEMBER', 'LIBRARIAN', 'ADMIN']
        : ['MEMBER'];

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username) {
            newErrors.username = 'Username is required';
        } else if (!/^[a-zA-Z0-9]{3,20}$/.test(formData.username)) {
            newErrors.username = 'Username must be 3-20 characters and contain only letters and numbers';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(formData.password)) {
            newErrors.password = 'Password must be at least 8 characters with letters and numbers';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.lastName) newErrors.lastName = 'Last name is required';
        if (!formData.role) newErrors.role = 'Role is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setErrors(prev => ({
            ...prev,
            [name]: ''
        }));
        setSubmitError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            await authService.registerStaff(formData);
            setShowSuccess(true);
            // Clear form
            setFormData({
                username: '',
                password: '',
                email: '',
                firstName: '',
                lastName: '',
                role: 'MEMBER',
            });
        } catch (err) {
            setSubmitError(err.response?.data || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DashboardLayout title="Register New User">
            <Box className="p-4">
                <Paper className="p-6 max-w-2xl mx-auto">
                    <Typography variant="h6" gutterBottom>
                        Create New User Account
                    </Typography>

                    {submitError && (
                        <Alert severity="error" className="mb-4">
                            {submitError}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <TextField
                            fullWidth
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            error={!!errors.username}
                            helperText={errors.username}
                            disabled={isLoading}
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            error={!!errors.password}
                            helperText={errors.password}
                            disabled={isLoading}
                        />

                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={!!errors.email}
                            helperText={errors.email}
                            disabled={isLoading}
                        />

                        <TextField
                            fullWidth
                            label="First Name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            error={!!errors.firstName}
                            helperText={errors.firstName}
                            disabled={isLoading}
                        />

                        <TextField
                            fullWidth
                            label="Last Name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            error={!!errors.lastName}
                            helperText={errors.lastName}
                            disabled={isLoading}
                        />

                        <TextField
                            select
                            fullWidth
                            label="Role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            error={!!errors.role}
                            helperText={errors.role}
                            disabled={isLoading}
                        >
                            {roles.map((role) => (
                                <MenuItem key={role} value={role}>
                                    {role}
                                </MenuItem>
                            ))}
                        </TextField>

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={isLoading}
                            className="mt-4"
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </Button>
                    </form>
                </Paper>
            </Box>

            <Snackbar
                open={showSuccess}
                autoHideDuration={6000}
                onClose={() => setShowSuccess(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setShowSuccess(false)}
                    severity="success"
                    sx={{ width: '100%' }}
                >
                    User registered successfully!
                </Alert>
            </Snackbar>
        </DashboardLayout>
    );
}

export default StaffRegistrationPage;