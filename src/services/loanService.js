// src/services/loanService.js
import api from './api/axiosConfig';

const loanService = {
    getAllLoans: async (userRole) => {
        // For admin/librarian, get all loans
        // For members, get only their loans
        const endpoint = userRole === 'MEMBER' ? '/loans/my-loans' : '/loans';
        const response = await api.get(endpoint);
        return response.data;
    },

    getLoanById: async (id) => {
        const response = await api.get(`/loans/${id}`);
        return response.data;
    },

    getLoansByUserId: async (userId) => {
        const response = await api.get(`/loans/user/${userId}`);
        return response.data;
    },

    getLoansByBookId: async (bookId) => {
        const response = await api.get(`/loans/book/${bookId}`);
        return response.data;
    },

    checkoutBook: async (bookId, userId) => {
        const response = await api.post('/loans/checkout', null, {
            params: {bookId, userId}
        });
        return response.data;
    },

    returnBook: async (loanId) => {
        const response = await api.post(`/loans/${loanId}/return`);
        return response.data;
    },


    getActiveLoanCount: async () => {
        const response = await api.get('/loans/activeCount');
        return response.data;
    },

    renewLoan: async (loanId, reason) => {
        const response = await api.post(`/loans/${loanId}/renew`, null, {
            params: {reason}
        });
        return response.data;
    },

    getLoanHistory: async (loanId) => {
        const response = await api.get(`/loans/${loanId}/history`);
        return response.data;
    },
};

export default loanService;