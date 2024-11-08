import api from './api/axiosConfig';

const loanPolicyService = {
    getAllPolicies: async () => {
        const response = await api.get('/loan-policies');
        return response.data;
    },

    getPolicyByType: async (itemType) => {
        const response = await api.get(`/loan-policies/${itemType}`);
        return response.data;
    }
};

export default loanPolicyService;