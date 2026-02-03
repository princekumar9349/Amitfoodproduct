import React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  if (!item) return null;

  return (
    <div className="flex items-center justify-between border-b pb-4">
      <div className="flex items-center gap-4">
        <img
          src={item?.image || "/fallback.jpg"}
          alt={item?.name || "Product"}
          className="w-20 h-20 object-cover rounded-lg bg-gray-100"
          onError={(e) => (e.target.src = "/fallback.jpg")}
        />

        <div>
          <h3 className="font-semibold text-gray-900">
            {item?.name || "Unnamed Product"}
          </h3>
          <p className="text-gray-500 text-sm">₹{item?.price || 0}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => updateQuantity(item._id, item.quantity - 1)}
          className="p-1 bg-gray-100 rounded-full"
          disabled={item.quantity <= 1}
        >
          <Minus size={16} />
        </button>

        <span className="font-medium">{item?.quantity || 1}</span>

        <button
          onClick={() => updateQuantity(item._id, item.quantity + 1)}
          className="p-1 bg-gray-100 rounded-full"
        >
          <Plus size={16} />
        </button>

        <button
          onClick={() => removeFromCart(item._id)}
          className="text-red-500 ml-2"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
