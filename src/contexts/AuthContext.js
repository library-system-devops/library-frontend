import { createContext, useContext, useState, useCallback } from 'react';
import authService from '../services/auth/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return !!localStorage.getItem('token');
    });
    const [userRole, setUserRole] = useState(() => {
        return localStorage.getItem('userRole') || null;
    });
    const [user, setUser] = useState(() => {
        const userId = localStorage.getItem('userId');
        return userId ? { id: userId } : null;
    });

    const login = useCallback(async (credentials) => {
        const response = await authService.login(credentials);
        setIsAuthenticated(true);
        setUserRole(response.role);
        // Store user ID from response
        if (response.userId) {
            setUser({ id: response.userId });
            localStorage.setItem('userId', response.userId);
        }
        return response;
    }, []);

    const logout = useCallback(() => {
        authService.logout();
        setIsAuthenticated(false);
        setUserRole(null);
        setUser(null);
        localStorage.removeItem('userId');
    }, []);

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            userRole,
            user,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};