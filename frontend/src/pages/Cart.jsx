import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, ArrowRight, Trash2, ShieldCheck, 
  CreditCard, Tag, ArrowLeft 
} from "lucide-react";
import toast from "react-hot-toast";

const Cart = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");

  const handleApplyPromo = () => {
    if (!promoCode.trim()) return;
    toast.error("Invalid Promo Code");
    setPromoCode("");
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  // --- EMPTY STATE ---
  if (!cartItems || cartItems.length === 0) {
    return (
      // Added pt-28 to clear the fixed navbar
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 pt-28 pb-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-full shadow-lg mb-6"
        >
          <ShoppingBag size={64} className="text-orange-200" />
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          Looks like you haven't added anything to your cart yet. 
          Go ahead and explore our delicious menu!
        </p>
        <Link 
          to="/" 
          className="bg-orange-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-orange-700 hover:shadow-orange-500/30 transition-all flex items-center gap-2 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    // UPDATED: Changed py-12 to pt-28 pb-12 to push content down
    <div className="bg-gray-50 min-h-screen pt-28 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingBag className="text-orange-600" size={32} />
          <h1 className="text-3xl font-extrabold text-gray-900">Shopping Cart</h1>
          <span className="bg-orange-100 text-orange-800 text-sm font-bold px-3 py-1 rounded-full">
            {cartItems.reduce((acc, item) => acc + item.quantity, 0)} Items
          </span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* --- LEFT SIDE: CART ITEMS --- */}
          <div className="lg:col-span-2">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-100 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-center">Total</div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-gray-100 p-4 md:p-0">
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div 
                      key={item._id} 
                      variants={itemVariants}
                      layout
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <CartItem item={item} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Cart Actions */}
              <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                <Link to="/" className="text-orange-600 font-semibold hover:text-orange-700 flex items-center gap-2">
                   <ArrowLeft size={18} /> Continue Shopping
                </Link>
                <button
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-700 font-medium flex items-center gap-2 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
                >
                  <Trash2 size={18} /> Clear Cart
                </button>
              </div>
            </motion.div>
          </div>

          {/* --- RIGHT SIDE: SUMMARY --- */}
          <div className="lg:col-span-1">
            {/* Added top offset to sticky element so it doesn't hit the navbar */}
            <div className="sticky top-28 space-y-6">
              
              {/* Order Summary Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900">₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping Estimate</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax Estimate (5%)</span>
                    <span className="font-medium text-gray-900">₹{(cartTotal * 0.05).toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t border-dashed border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between items-end">
                    <span className="text-lg font-bold text-gray-900">Order Total</span>
                    <span className="text-2xl font-extrabold text-orange-600">
                      ₹{(cartTotal * 1.05).toFixed(0)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 text-right">Includes all taxes</p>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:bg-gray-800 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group"
                >
                  Proceed to Checkout
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                   <ShieldCheck size={14} />
                   Secure Checkout powered by Razorpay
                </div>
              </motion.div>

              {/* Promo Code Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                 <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Tag size={16} className="text-orange-500" /> Apply Promo Code
                 </h3>
                 <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Enter code" 
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    />
                    <button 
                      onClick={handleApplyPromo}
                      className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Apply
                    </button>
                 </div>
              </div>

              {/* Payment Methods */}
              <div className="flex justify-center gap-4 grayscale opacity-60">
                  <div className="h-8 w-12 bg-white border rounded flex items-center justify-center shadow-sm">
                    <CreditCard size={20} />
                  </div>
                  <div className="h-8 w-12 bg-white border rounded flex items-center justify-center shadow-sm font-bold text-[10px]">UPI</div>
                  <div className="h-8 w-12 bg-white border rounded flex items-center justify-center shadow-sm font-bold text-[10px]">VISA</div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;