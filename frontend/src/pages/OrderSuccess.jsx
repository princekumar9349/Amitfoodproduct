import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const OrderSuccess = () => {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
            <div className="bg-green-100 p-4 rounded-full mb-6">
                <CheckCircle size={64} className="text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
            <p className="text-gray-600 max-w-md mb-8">
                Thank you for your order. We have received it and will begin processing it shortly. You can track your order in your profile.
            </p>
            <div className="flex space-x-4">
                <Link
                    to="/my-orders"
                    className="bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-primary-hover shadow-lg transition-transform hover:scale-105"
                >
                    View My Orders
                </Link>
                <Link
                    to="/"
                    className="bg-white text-gray-700 font-bold py-3 px-8 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
};

export default OrderSuccess;
