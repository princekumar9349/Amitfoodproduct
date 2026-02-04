import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import orderService from '../services/orderService';
import { 
    Package, Calendar, Clock, ChevronRight, 
    ShoppingBag, AlertCircle, CheckCircle2, Truck 
} from 'lucide-react';
import toast from 'react-hot-toast';
import Skeleton from '../components/Skeleton';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await orderService.getMyOrders();
                // Sort by date (newest first)
                const sortedOrders = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setOrders(sortedOrders);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load orders");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // Helper for Status Badge Styling
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Delivered':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'Processing':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Shipped':
                return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'Cancelled':
                return 'bg-red-100 text-red-700 border-red-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        if (status === 'Delivered') return <CheckCircle2 size={14} />;
        if (status === 'Shipped') return <Truck size={14} />;
        if (status === 'Cancelled') return <AlertCircle size={14} />;
        return <Clock size={14} />;
    };

    // --- LOADING STATE ---
    if (loading) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-12 pt-28">
                <h1 className="text-3xl font-bold mb-8">My Orders</h1>
                <div className="space-y-6">
                    {[1, 2, 3].map(i => (
                        <Skeleton key={i} className="h-48 w-full rounded-2xl" />
                    ))}
                </div>
            </div>
        );
    }

    // --- EMPTY STATE ---
    if (orders.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 pt-20">
                <div className="bg-white p-8 rounded-full shadow-lg mb-6">
                    <Package size={64} className="text-orange-200" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
                <p className="text-gray-500 mb-8 text-center">Looks like you haven't placed any orders yet.</p>
                <Link to="/" className="bg-orange-600 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-700 transition-colors shadow-lg">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-28 pb-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3 mb-8">
                    <ShoppingBag className="text-orange-600" size={32} />
                    <h1 className="text-3xl font-extrabold text-gray-900">My Orders</h1>
                    <span className="bg-gray-200 text-gray-600 text-sm font-bold px-3 py-1 rounded-full">
                        {orders.length}
                    </span>
                </div>

                <div className="space-y-6">
                    {orders.map((order, index) => (
                        <motion.div
                            key={order._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                        >
                            {/* Order Header */}
                            <div className="bg-gray-50/50 p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-lg text-gray-900">
                                            Order #{order._id.slice(-6).toUpperCase()}
                                        </h3>
                                        <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full border ${getStatusStyle(order.status || 'Processing')}`}>
                                            {getStatusIcon(order.status || 'Processing')}
                                            {(order.status || 'Processing').toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={14} /> 
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={14} /> 
                                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Total Amount</p>
                                    <p className="text-xl font-extrabold text-gray-900">₹{order.totalPrice}</p>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="p-6">
                                <div className="space-y-4">
                                    {order.orderItems.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                                    {item.image ? (
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            <Package size={20} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 text-sm sm:text-base">{item.name}</p>
                                                    <p className="text-sm text-gray-500">Qty: {item.qty} × ₹{item.price}</p>
                                                </div>
                                            </div>
                                            <p className="font-semibold text-gray-900">₹{item.price * item.qty}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Footer */}
                            <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/30">
                                <p className="text-sm text-gray-500">
                                    Payment: <span className="font-semibold text-gray-700">{order.paymentMethod}</span>
                                </p>
                                {/* Optional: Link to detailed order view if you create one */}
                                {/* <button className="text-orange-600 text-sm font-bold flex items-center gap-1 hover:underline">
                                    View Details <ChevronRight size={16} />
                                </button> */}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyOrders;