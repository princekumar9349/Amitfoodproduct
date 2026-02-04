import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import productService from "../services/productService";
import { useCart } from '../context/CartContext';
import { 
  ShoppingCart, ArrowLeft, Star, Minus, Plus, 
  Heart, Share2, Truck, ShieldCheck, Leaf, Clock, Package,
  Info, CheckCircle2, ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import Skeleton from '../components/Skeleton';
import ProductCard from '../components/ProductCard';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    
    // State
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]); // Same Category
    const [otherSuggestions, setOtherSuggestions] = useState([]); // Different Categories
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [isWishlisted, setIsWishlisted] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. Fetch current product
                const currentProduct = await productService.getProductById(id);
                setProduct(currentProduct);

                // 2. Fetch all products to generate suggestions
                const allProductsResponse = await productService.getProducts();
                
                // Handle response structure (array vs object)
                const allProducts = Array.isArray(allProductsResponse) ? allProductsResponse : (allProductsResponse.products || []);

                // Filter 1: Similar Items (Same Category, Exclude Current)
                const similar = allProducts
                    .filter(p => p._id !== id && p.category === currentProduct.category)
                    .sort(() => 0.5 - Math.random()) // Shuffle
                    .slice(0, 4);
                
                // Filter 2: More to Explore (Different Categories, Exclude Current)
                const others = allProducts
                    .filter(p => p._id !== id && p.category !== currentProduct.category)
                    .sort(() => 0.5 - Math.random()) // Shuffle
                    .slice(0, 4);

                setRelatedProducts(similar);
                setOtherSuggestions(others);

                // Reset page state
                setQuantity(1);
                setActiveTab('description');
            } catch (error) {
                console.error(error);
                toast.error("Failed to load product details");
                navigate('/'); 
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        window.scrollTo(0, 0); 
    }, [id, navigate]);

    const handleAddToCart = () => {
        // Stock Validation
        if (product.stock !== undefined && quantity > product.stock) {
            return toast.error(`Only ${product.stock} items available`);
        }
        addToCart(product, quantity);
        setQuantity(1); 
        toast.success(`Added ${quantity} ${product.name} to cart`);
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12 pt-28">
                <Skeleton className="h-[500px] w-full rounded-3xl mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Skeleton className="h-12 w-3/4 mb-4" />
                    <Skeleton className="h-12 w-full mb-4" />
                </div>
            </div>
        );
    }

    if (!product) return null;

    // --- DYNAMIC TABS LOGIC ---
    // Only add tabs if data exists in the DB
    const tabs = ['description'];
    if (product.nutrition && Object.keys(product.nutrition).length > 0) tabs.push('nutrition');
    if (product.ingredients && product.ingredients.length > 0) tabs.push('ingredients');
    if (product.reviews && product.reviews.length > 0) tabs.push('reviews');

    // Safe Category Name Access
    const categoryName = typeof product.category === 'object' ? product.category.name : product.category;

    return (
        <div className="bg-gray-50 min-h-screen pb-20 pt-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* --- BREADCRUMBS --- */}
                <nav className="flex items-center text-sm text-gray-500 mb-8">
                    <Link to="/" className="hover:text-orange-600 transition-colors">Home</Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900 font-medium truncate">{product.name}</span>
                </nav>

                {/* --- MAIN CONTENT (Image & Info) --- */}
                <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
                    
                    {/* LEFT: IMAGE SECTION */}
                    <div className="space-y-6">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="relative rounded-3xl overflow-hidden bg-white shadow-lg border border-gray-100 group"
                        >
                            <div className="aspect-w-4 aspect-h-3 w-full h-[400px] md:h-[500px] flex items-center justify-center bg-gray-100">
                                {product.image ? (
                                    <img
                                        src={product.image} // ✅ Uses real DB field 'image'
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-gray-400">
                                        <Package size={64} className="mb-4 opacity-50" />
                                        <span>No Image Available</span>
                                    </div>
                                )}
                            </div>
                            
                            {/* Dynamic Badges */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                {categoryName && (
                                    <span className="bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wide w-fit">
                                        {categoryName}
                                    </span>
                                )}
                                {product.isOrganic && (
                                    <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1 w-fit">
                                        <Leaf size={12} /> Organic
                                    </span>
                                )}
                            </div>
                        </motion.div>

                        {/* Static Trust Cards */}
                        <div className="hidden lg:grid grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-2 text-gray-800 font-bold mb-1">
                                    <ShieldCheck size={18} className="text-green-600" /> Authentic
                                </div>
                                <p className="text-xs text-gray-500">100% Original Products.</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-2 text-gray-800 font-bold mb-1">
                                    <Clock size={18} className="text-orange-600" /> Shelf Life
                                </div>
                                <p className="text-xs text-gray-500">{product.shelfLife || "Check label"}</p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: INFO SECTION */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mt-10 lg:mt-0"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
                                    {product.name}
                                </h1>
                                {/* Stock Status Badge */}
                                {product.stock > 0 ? (
                                    <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 px-2 py-1 rounded text-xs font-bold border border-green-200">
                                        <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></div>
                                        In Stock ({product.stock} available)
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2 py-1 rounded text-xs font-bold border border-red-200">
                                        Out of Stock
                                    </span>
                                )}
                            </div>
                            
                            <div className="flex gap-2">
                                <button className="p-3 rounded-full border bg-white border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-200 transition-all">
                                    <Share2 size={20} />
                                </button>
                                <button 
                                    onClick={() => setIsWishlisted(!isWishlisted)}
                                    className={`p-3 rounded-full border ${isWishlisted ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-gray-200 text-gray-400'} hover:scale-110 transition-all`}
                                >
                                    <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                                </button>
                            </div>
                        </div>

                        {/* Price & Unit */}
                        <div className="flex items-end gap-3 mb-8 bg-orange-50 p-4 rounded-2xl w-fit border border-orange-100">
                            <span className="text-4xl font-bold text-gray-900">₹{product.price}</span>
                            {product.unit && (
                                <span className="text-lg text-gray-500 font-medium mb-1">/ {product.unit}</span>
                            )}
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 text-lg leading-relaxed mb-8">
                            {product.description || "No description provided."}
                        </p>

                        {/* Quantity & Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-8 pb-8 border-b border-gray-100">
                            {product.stock > 0 ? (
                                <>
                                    <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1 w-fit shadow-sm h-14">
                                        <button 
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-12 h-full flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 text-gray-600"
                                            disabled={quantity <= 1}
                                        >
                                            <Minus size={18} />
                                        </button>
                                        <span className="w-12 text-center font-bold text-lg text-gray-900">{quantity}</span>
                                        <button 
                                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                            className="w-12 h-full flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                                            disabled={quantity >= product.stock}
                                        >
                                            <Plus size={18} />
                                        </button>
                                    </div>

                                    <button
                                        onClick={handleAddToCart}
                                        className="flex-1 bg-gray-900 text-white font-bold py-3 px-8 rounded-xl hover:bg-orange-600 shadow-xl hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-3 transform active:scale-95 h-14"
                                    >
                                        <ShoppingCart size={22} />
                                        Add to Cart
                                    </button>
                                </>
                            ) : (
                                <div className="w-full bg-gray-100 text-gray-400 font-bold py-4 rounded-xl text-center cursor-not-allowed border border-gray-200">
                                    Currently Unavailable
                                </div>
                            )}
                        </div>

                        {/* --- DYNAMIC TABS --- */}
                        <div className="mt-8">
                            <div className="flex gap-8 border-b border-gray-200 mb-6 overflow-x-auto">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`pb-3 text-base font-bold capitalize transition-all relative whitespace-nowrap ${
                                            activeTab === tab ? "text-orange-600" : "text-gray-400 hover:text-gray-600"
                                        }`}
                                    >
                                        {tab}
                                        {activeTab === tab && (
                                            <motion.div layoutId="underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-600" />
                                        )}
                                    </button>
                                ))}
                            </div>
                            
                            <div className="text-gray-600 text-sm leading-relaxed">
                                {activeTab === 'description' && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <p>{product.description}</p>
                                        {product.fssaiLicense && (
                                            <div className="mt-4 flex items-center gap-2 text-green-700 bg-green-50 w-fit px-3 py-1 rounded-full border border-green-200">
                                                <CheckCircle2 size={16}/> FSSAI Licensed: {product.fssaiLicense}
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                                
                                {activeTab === 'nutrition' && product.nutrition && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {Object.entries(product.nutrition).map(([key, val]) => (
                                                <div key={key} className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-center">
                                                    <span className="block text-xs uppercase text-gray-400 font-bold">{key}</span>
                                                    <span className="block text-gray-900 font-bold">{val}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'ingredients' && product.ingredients && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <ul className="list-disc list-inside space-y-2">
                                            {product.ingredients.map((ing, i) => (
                                                <li key={i}>{ing}</li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                )}

                                {activeTab === 'reviews' && product.reviews && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        {product.reviews.length === 0 ? (
                                            <p>No reviews yet.</p>
                                        ) : (
                                            product.reviews.map((r, i) => (
                                                <div key={i} className="mb-4 border-b pb-4 last:border-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className="font-bold text-gray-900">{r.user || "User"}</p>
                                                        <div className="flex text-yellow-400">
                                                            {[...Array(5)].map((_, starI) => (
                                                                <Star key={starI} size={12} fill={starI < r.rating ? "currentColor" : "none"} className={starI >= r.rating ? "text-gray-300" : ""} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p>{r.comment}</p>
                                                </div>
                                            ))
                                        )}
                                    </motion.div>
                                )}
                            </div>
                        </div>

                    </motion.div>
                </div>

                {/* --- SECTION 1: SIMILAR ITEMS (Same Category) --- */}
                {relatedProducts.length > 0 && (
                    <div className="mt-24 border-t border-gray-200 pt-12">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Similar Items</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                            {relatedProducts.map(p => (
                                <ProductCard key={p._id} product={p} />
                            ))}
                        </div>
                    </div>
                )}

                {/* --- SECTION 2: MORE TO EXPLORE (Different Categories) --- */}
                {otherSuggestions.length > 0 && (
                    <div className="mt-20">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">More to Explore</h2>
                                <p className="text-gray-500 mt-1">Try something new from our other categories</p>
                            </div>
                            <Link to="/" className="text-orange-600 font-bold hover:underline flex items-center gap-1">
                                View Full Menu <ArrowRight size={18} />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                            {otherSuggestions.map(p => (
                                <ProductCard key={p._id} product={p} />
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ProductDetails;