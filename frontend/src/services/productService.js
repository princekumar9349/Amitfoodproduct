import api from './api';

const productService = {
    getProducts: async () => {
        const response = await api.get('/api/products');
        return response.data;
    },

    getProductById: async (id) => {
        const response = await api.get(`/api/products/${id}`);
        return response.data;
    },
};

export default productService;
