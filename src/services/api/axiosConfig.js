import axios from 'axios';

const api = axios.create({
    baseURL: 'http://35.210.246.177/api', // Backend API base URL (updated from localhost to VM IP)
    withCredentials: true, // Include credentials (cookies, JWT tokens, etc.)
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login'; // Redirect to login if unauthorized
        }
        return Promise.reject(error);
    }
);

export default api;
