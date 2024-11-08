// src/components/auth/RouteGuard.js
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const RouteGuard = ({ children, allowedRoles = [] }) => {
    const { isAuthenticated, userRole } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        return <Navigate to="/" />;
    }

    return children;
};