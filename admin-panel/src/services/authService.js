import api from './api';

const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data) {
        localStorage.setItem('admin', JSON.stringify(response.data));
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem('admin');
};

const getCurrentAdmin = () => {
    return JSON.parse(localStorage.getItem('admin'));
};

const authService = {
    login,
    logout,
    getCurrentAdmin,
};

export default authService;
