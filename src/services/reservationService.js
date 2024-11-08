import api from './api/axiosConfig';

const reservationService = {
    getAllReservations: async () => {
        const response = await api.get('/reservations');
        return response.data;
    },

    getReservationById: async (id) => {
        const response = await api.get(`/reservations/${id}`);
        return response.data;
    },

    getReservationsByUserId: async (userId) => {
        const response = await api.get(`/reservations/user/${userId}`);
        return response.data;
    },

    getReservationsByBookId: async (bookId) => {
        const response = await api.get(`/reservations/book/${bookId}`);
        return response.data;
    },

    reserveBook: async (bookId, userId) => {
        const response = await api.post(`/reservations/reserve`, null, {
            params: { bookId, userId }
        });
        return response.data;
    },

    fulfillReservation: async (reservationId) => {
        const response = await api.post(`/reservations/${reservationId}/fulfill`);
        return response.data;
    }
};

export default reservationService;