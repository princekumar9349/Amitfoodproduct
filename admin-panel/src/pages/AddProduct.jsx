import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Direct api usage for potential multipart/form-data if needed
import toast from 'react-hot-toast';
import { Upload, ArrowLeft } from 'lucide-react';

const AddProduct = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: '',
        image: null // For now basic url or file logic
    });
    // Assuming backend takes Multipart or URL. 
    // Looking at backend routes (Step 173), it uses `upload.single('image')`, so it expects FormData.

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('price', formData.price);
        data.append('description', formData.description);
        data.append('category', formData.category);
        if (formData.image) {
            data.append('image', formData.image);
        }

        try {
            await api.post('/products', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Product Added Successfully');
            navigate('/products');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-gray-700 mb-6 transition-colors">
                <ArrowLeft size={18} className="mr-2" /> Back to Products
            </button>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Add New Product</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary sm:text-sm p-2 border"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                            <input
                                type="number"
                                name="price"
                                required
                                className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary sm:text-sm p-2 border"
                                value={formData.price}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                name="category"
                                required
                                className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary sm:text-sm p-2 border bg-white"
                                value={formData.category}
                                onChange={handleChange}
                            >
                                <option value="">Select Category</option>
                                <option value="Pizza">Pizza</option>
                                <option value="Burger">Burger</option>
                                <option value="Drinks">Drinks</option>
                                <option value="Dessert">Dessert</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            rows={3}
                            required
                            className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary sm:text-sm p-2 border"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-primary/50 transition-colors">
                            <div className="space-y-1 text-center">
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600">
                                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none">
                                        <span>Upload a file</span>
                                        <input
                                            name="image"
                                            type="file"
                                            className="sr-only"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                        />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                                {formData.image && <p className="text-sm text-green-600 font-medium mt-2">{formData.image.name}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-colors"
                        >
                            {loading ? 'Creating...' : 'Create Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
