import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/products');
            setProducts(data);
        } catch (error) {
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            await api.delete(`/products/${id}`);
            toast.success("Product Deleted");
            fetchProducts();
        } catch (error) {
            toast.error("Failed to delete product");
        }
    }

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Products</h1>
                <Link
                    to="/add-product"
                    className="bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary-hover flex items-center transition-colors"
                >
                    <Plus size={18} className="mr-2" />
                    Add Product
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="h-10 w-10 flex-shrink-0">
                                            {product.image ? (
                                                <img className="h-10 w-10 rounded-full object-cover" src={product.image} alt="" />
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-gray-200" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">₹{product.price}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end space-x-3">
                                            {/* Edit functionality to be implemented, adding placeholder button */}
                                            <button className="text-primary hover:text-blue-900"><Edit size={18} /></button>
                                            <button onClick={() => handleDelete(product._id)} className="text-red-500 hover:text-red-900"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageProducts;
