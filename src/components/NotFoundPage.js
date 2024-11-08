// src/components/NotFoundPage.js
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    Box,
    Button,
    Container,
    Typography,
    Paper,
    useTheme
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HomeIcon from '@mui/icons-material/Home';

function NotFoundPage() {
    const navigate = useNavigate();
    const { isAuthenticated, userRole } = useAuth();
    const theme = useTheme();

    const handleGoHome = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        switch (userRole) {
            case 'ADMIN':
                navigate('/admin');
                break;
            case 'LIBRARIAN':
                navigate('/librarian');
                break;
            case 'MEMBER':
                navigate('/member');
                break;
            default:
                navigate('/login');
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        width: '100%',
                        textAlign: 'center',
                        borderRadius: 2,
                        bgcolor: 'background.paper',
                    }}
                >
                    <ErrorOutlineIcon
                        sx={{
                            fontSize: 100,
                            color: theme.palette.error.main,
                            mb: 2
                        }}
                    />
                    <Typography
                        variant="h1"
                        component="h1"
                        sx={{
                            fontSize: '6rem',
                            fontWeight: 'bold',
                            color: theme.palette.error.main,
                            mb: 2
                        }}
                    >
                        404
                    </Typography>
                    <Typography
                        variant="h5"
                        component="h2"
                        sx={{
                            mb: 3,
                            color: theme.palette.text.secondary
                        }}
                    >
                        Oops! Page Not Found
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            mb: 4,
                            color: theme.palette.text.secondary
                        }}
                    >
                        The page you're looking for doesn't exist or has been moved.
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<HomeIcon />}
                        onClick={handleGoHome}
                        sx={{
                            minWidth: 200,
                            py: 1.5,
                        }}
                    >
                        {isAuthenticated ? 'Back to Dashboard' : 'Go to Login'}
                    </Button>
                </Paper>
            </Box>
        </Container>
    );
}

export default NotFoundPage;