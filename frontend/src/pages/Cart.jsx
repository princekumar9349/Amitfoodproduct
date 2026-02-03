import React from "react";
import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-600">
          Your Cart is Empty
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid md:grid-cols-3 gap-10">
        
        {/* LEFT SIDE - ITEMS */}
        <div className="md:col-span-2 space-y-6">
          {cartItems.map((item) => (
            <CartItem key={item._id} item={item} />
          ))}

          <button
            onClick={clearCart}
            className="mt-4 bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition"
          >
            Clear Cart
          </button>
        </div>

        {/* RIGHT SIDE - SUMMARY */}
        <div className="bg-white shadow-lg rounded-xl p-6 h-fit">
          <h2 className="text-xl font-bold mb-6">Order Summary</h2>

          <div className="flex justify-between mb-3">
            <span>Subtotal</span>
            <span>₹{cartTotal}</span>
          </div>

          <div className="flex justify-between mb-3">
            <span>Shipping</span>
            <span className="text-green-600">Free</span>
          </div>

          <div className="border-t pt-4 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹{cartTotal}</span>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="mt-6 w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition font-semibold"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
