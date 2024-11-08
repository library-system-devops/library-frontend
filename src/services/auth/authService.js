// src/services/auth/authService.js
import api from '../api/axiosConfig';

const authService = {
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userRole', response.data.role);
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
    },

    register: async (userData) => {
        return await api.post('/auth/register', userData);
    },

    registerStaff: async (userData) => {
        return await api.post('/auth/register-staff', userData);
    },

    checkAuthStatus: () => {
        const token = localStorage.getItem('token');
        return !!token;
    },

    getCurrentUserRole: () => {
        return localStorage.getItem('userRole');
    }
};

export default authService;