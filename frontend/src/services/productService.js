import api from './api';

const productService = {
    getProducts: async () => {
        const response = await api.get('/api/products');
        // ✅ SAFETY CHECK: If backend returns { products: [...] }, extract it.
        // Otherwise, return the data as is (if it's already an array).
        if (response.data && response.data.products) {
            return response.data.products;
        }
        return response.data;
    },

    getProductById: async (id) => {
        const response = await api.get(`/api/products/${id}`);
        return response.data;
    },

    // ✅ ADDED: Fetch categories (Required for Home page)
    getCategories: async () => {
        const response = await api.get('/api/products/categories');
        return response.data;
    },

    // ✅ OPTIONAL: You might need these later for Admin features
    createProduct: async (productData) => {
        const response = await api.post('/api/products', productData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    }
};

export default productService;