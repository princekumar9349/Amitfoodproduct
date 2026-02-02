import React from 'react';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';

const Cart = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
                <ShoppingBag size={64} className="text-gray-300 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
                <p className="text-gray-500 mb-8 text-center max-w-sm">
                    Looks like you haven't added anything to your cart yet. Go ahead and explore our menu!
                </p>
                <Link
                    to="/"
                    className="bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-primary-hover transition-colors shadow-md"
                >
                    Browse Menu
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

            <div className="lg:grid lg:grid-cols-12 lg:gap-12">
                {/* Cart Items List */}
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 space-y-4">
                            {cartItems.map((item) => (
                                <CartItem key={item._id} item={item} />
                            ))}
                        </div>
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between">
                            <button onClick={clearCart} className="text-red-500 text-sm font-medium hover:underline">
                                Clear Cart
                            </button>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-4 mt-8 lg:mt-0">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sticky top-24">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

                        <div className="space-y-3 text-sm text-gray-600 mb-6">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>₹{cartTotal}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span className="text-green-600 font-medium">Free</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Taxes</span>
                                <span>₹0.00</span>
                            </div>
                            <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-lg">
                                <span>Total</span>
                                <span className="text-primary">₹{cartTotal}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/checkout')}
                            className="w-full bg-primary text-white font-bold py-3 px-4 rounded-xl hover:bg-primary-hover shadow-lg transition-all flex items-center justify-center gap-2 group"
                        >
                            Proceed to Checkout
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Checkout Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg md:hidden z-40">
                <div className="flex justify-between items-center max-w-7xl mx-auto">
                    <div>
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="text-xl font-bold text-primary">₹{cartTotal}</p>
                    </div>
                    <button
                        onClick={() => navigate('/checkout')}
                        className="bg-primary text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-primary-hover transition-colors"
                    >
                        Checkout
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Cart;
