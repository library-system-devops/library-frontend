// src/components/auth/LoginPage.js
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    Link as MuiLink,
    Paper
} from '@mui/material';

function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError(''); // Clear error when user types
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await login(formData);
            // Navigate to appropriate dashboard
            switch (response.role) {
                case 'ADMIN':
                    navigate('/admin');  // Changed from '/admin/dashboard'
                    break;
                case 'LIBRARIAN':
                    navigate('/librarian');  // Changed from '/librarian/dashboard'
                    break;
                default:
                    navigate('/');  // Default route for members
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid username or password.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                    <Typography component="h1" variant="h5" sx={{ textAlign: 'center', mb: 3 }}>
                        Library Management System
                    </Typography>
                    <Typography component="h2" variant="h6" sx={{ textAlign: 'center', mb: 3 }}>
                        Sign In
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={formData.username}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </Button>

                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <MuiLink component={Link} to="/register" variant="body2">
                                Don't have an account? Sign up
                            </MuiLink>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}

export default LoginPage;