// src/services/userService.js
import api from './api/axiosConfig';

const userService = {
    getAllUsers: async () => {
        const response = await api.get('/users');
        return response.data;
    },

    getAllMembers: async () => {
        const response = await api.get('/users/members');
        return response.data;
    },

    getCurrentUser: async () => {
        const response = await api.get('/users/current');
        return response.data;
    },

    getUserById: async (id) => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },

    updateUser: async (id, userData) => {
        const response = await api.put(`/users/${id}`, userData);
        return response.data;
    },

    deleteUser: async (id) => {
        await api.delete(`/users/${id}`);
    },

    getUserCount: async () => {
        const response = await api.get('/users/count');
        return response.data;
    }
};

export default userService;