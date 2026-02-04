import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Home, ShoppingBag } from 'lucide-react';

const OrderSuccess = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pt-20">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center">
                
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                    <CheckCircle size={48} className="text-green-600" />
                </motion.div>

                <motion.h1 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl font-extrabold text-gray-900 mb-2"
                >
                    Order Placed!
                </motion.h1>
                
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-500 mb-8"
                >
                    Thank you for your purchase. Your delicious food is being prepared and will be with you shortly.
                </motion.p>

                <div className="space-y-3">
                    <Link 
                        to="/" 
                        className="block w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                    >
                        <Home size={18} /> Return Home
                    </Link>
                    {/* Optional: Add Link to 'My Orders' if you have that page */}
                    {/* <Link 
                        to="/profile" 
                        className="block w-full bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        View Order Details
                    </Link> */}
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;