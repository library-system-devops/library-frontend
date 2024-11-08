import api from './api/axiosConfig';

const bookService = {
    getAllBooks: async () => {
        const response = await api.get('/books');
        return response.data;
    },

    getBookById: async (id) => {
        const response = await api.get(`/books/${id}`);
        return response.data;
    },

    searchBooks: async (query) => {
        const response = await api.get(`/books/search?query=${encodeURIComponent(query)}`);
        return response.data;
    },

    createBook: async (bookData) => {
        const response = await api.post('/books/google', bookData);
        return response.data;
    },

    updateBook: async (id, bookData) => {
        const response = await api.put(`/books/${id}`, bookData);
        return response.data;
    },

    updateInventory: async (id, newCopiesOwned) => {
        const response = await api.put(`/books/${id}/inventory?newCopiesOwned=${newCopiesOwned}`);
        return response.data;
    },

    deleteBook: async (id) => {
        await api.delete(`/books/${id}`);
    },

    getBookCount: async () => {
        const response = await api.get('/books/count');
        return response.data;
    }
};

export default bookService;