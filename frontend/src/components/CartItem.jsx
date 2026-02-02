import React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex items-center py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors p-2 rounded-lg">
      <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
        {item.image ? (
          <img
            src={
              item.image.startsWith("http")
                ? item.image
                : `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/${item.image.replace(/\\/g, "/")}`
            }
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            No Img
          </div>
        )}
      </div>

      <div className="ml-4 flex-1">
        <h3 className="text-sm font-semibold text-gray-800">{item.name}</h3>
        <p className="text-sm text-gray-500">₹{item.price}</p>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => updateQuantity(item._id, item.quantity - 1)}
          className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 focus:outline-none"
          disabled={item.quantity <= 1}
        >
          <Minus size={16} />
        </button>
        <span className="text-sm font-medium w-6 text-center">
          {item.quantity}
        </span>
        <button
          onClick={() => updateQuantity(item._id, item.quantity + 1)}
          className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 focus:outline-none"
        >
          <Plus size={16} />
        </button>
      </div>

      <button
        onClick={() => removeFromCart(item._id)}
        className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors focus:outline-none"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default CartItem;
