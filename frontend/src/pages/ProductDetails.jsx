import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productService from '../services/productService';
import { useCart } from '../context/CartContext';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import Skeleton from '../components/Skeleton';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await productService.getProductById(id);
                setProduct(data);
            } catch (error) {
                toast.error("Failed to load product details");
                navigate('/'); // Redirect to home on error
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <Skeleton className="h-96 w-full rounded-2xl mb-8" />
                <Skeleton className="h-8 w-1/2 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        );
    }

    if (!product) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-primary mb-6 transition-colors"
            >
                <ArrowLeft size={20} className="mr-2" /> Back
            </button>

            <div className="md:flex gap-8">
                {/* Product Image */}
                <div className="md:w-1/2 mb-8 md:mb-0">
                    <div className="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden shadow-lg border border-gray-100 w-full h-96 bg-gray-50 flex items-center justify-center">
                        {product.image ? (
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <span className="text-gray-400">No Image Available</span>
                        )}
                    </div>
                </div>

                {/* Product Info */}
                <div className="md:w-1/2 flex flex-col justify-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
                    <p className="text-2xl font-bold text-primary mb-6">₹{product.price}</p>

                    <div className="prose prose-sm text-gray-500 mb-8">
                        <p>{product.description}</p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => addToCart(product)}
                            className="flex-1 bg-primary text-white font-bold py-4 px-8 rounded-xl hover:bg-primary-hover shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 transform active:scale-95"
                        >
                            <ShoppingCart size={24} />
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
