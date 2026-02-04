import React from "react";
import { Minus, Plus, Trash2, Package } from "lucide-react";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  if (!item) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 bg-white hover:bg-gray-50 transition-colors group">
      
      {/* --- COL 1: PRODUCT INFO (Span 6) --- */}
      <div className="col-span-12 md:col-span-6 flex items-center gap-4">
        {/* Image */}
        <div className="w-20 h-20 flex-shrink-0 rounded-xl border border-gray-100 bg-gray-50 overflow-hidden">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => (e.target.style.display = "none")} // Hide broken images
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
                <Package size={24} />
            </div>
          )}
        </div>

        {/* Text Details */}
        <div>
          <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">
            {item.name}
          </h3>
          <p className="text-sm text-gray-500">
            {item.category || "General"} 
            {item.unit && <span className="mx-1">• {item.unit}</span>}
          </p>
          {/* Mobile Only Price */}
          <p className="text-orange-600 font-bold mt-1 md:hidden">
            ₹{item.price}
          </p>
        </div>
      </div>

      {/* --- COL 2: PRICE (Span 2) - Desktop Only --- */}
      <div className="hidden md:block md:col-span-2 text-center text-gray-600 font-medium">
        ₹{item.price}
      </div>

      {/* --- COL 3: QUANTITY (Span 2) --- */}
      <div className="col-span-12 md:col-span-2 flex justify-start md:justify-center">
        <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
          <button
            onClick={() => updateQuantity(item._id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-gray-600"
          >
            <Minus size={14} />
          </button>

          <span className="w-10 text-center font-bold text-sm text-gray-900">
            {item.quantity}
          </span>

          <button
            onClick={() => updateQuantity(item._id, item.quantity + 1)}
            // Optional: Add stock check here if `item.stock` exists
            // disabled={item.stock && item.quantity >= item.stock}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors text-gray-600"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* --- COL 4: TOTAL & ACTION (Span 2) --- */}
      <div className="col-span-12 md:col-span-2 flex items-center justify-between md:justify-center gap-6">
        {/* Total Price */}
        <span className="text-lg font-bold text-gray-900">
          ₹{(item.price * item.quantity).toFixed(0)}
        </span>

        {/* Delete Button */}
        <button
          onClick={() => removeFromCart(item._id)}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
          title="Remove Item"
        >
          <Trash2 size={18} />
        </button>
      </div>

    </div>
  );
};

export default CartItem;