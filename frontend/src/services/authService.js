import api from './api';

const authService = {
    register: async (userData) => {
        const response = await api.post('/api/users/register', userData);
        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
            // Assume token might be in response.data.token
            if (response.data.token) localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },

    login: async (credentials) => {
        const response = await api.post('/api/users/login', credentials);
        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
            if (response.data.token) localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    },
};

export default authService;
