// src/components/RootRedirect.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';

function RootRedirect() {
    const navigate = useNavigate();
    const { userRole } = useAuth();

    useEffect(() => {
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
    }, [userRole, navigate]);

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
        >
            <CircularProgress />
        </Box>
    );
}

export default RootRedirect;