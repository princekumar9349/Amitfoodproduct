import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import orderService from "../services/orderService";
import paymentService from "../services/paymentService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "India", // Default
  });

  const handleInputChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Processing order...");

    try {
      // 1. Create Order on Backend
      const orderData = {
        products: cartItems.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
        })),
        amount: cartTotal,
        address: address,
      };

      const {
        id: razorpayOrderId,
        amount,
        key,
        orderId: dbOrderId,
      } = await orderService.createOrder(orderData);

      // 2. Load Razorpay
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        toast.error("Failed to load payment gateway", { id: toastId });
        setLoading(false);
        return;
      }

      // 3. Open Razorpay
      const options = {
        key: key,
        amount: amount,
        currency: "INR",
        name: "Amit Food Product",
        description: "Delicious Food Order",
        order_id: razorpayOrderId, // Backend Order ID
        handler: async function (response) {
          try {
            // 4. Verify Payment
            await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: dbOrderId, // Pass Order ID for DB update
            });

            // 5. Success
            clearCart();
            toast.success("Order Placed Successfully!", { id: toastId });
            navigate("/order-success");
          } catch (error) {
            toast.error("Payment Verification Failed", { id: toastId });
            console.error(error);
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone, // If available
        },
        theme: {
          color: "#ea580c",
        },
        modal: {
          ondismiss: function () {
            toast.error("Payment Cancelled", { id: toastId });
            setLoading(false);
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong", {
        id: toastId,
      });
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-xl font-bold mb-6 text-gray-800">
          Shipping Address
        </h2>
        <form onSubmit={handleCheckout} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Street Address
            </label>
            <input
              type="text"
              name="street"
              required
              value={address.street}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                name="city"
                required
                value={address.city}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                type="text"
                name="state"
                required
                value={address.state}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                ZIP Code
              </label>
              <input
                type="text"
                name="zip"
                required
                value={address.zip}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                name="country"
                disabled
                value={address.country}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500"
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-medium text-gray-900">
                Total Amount
              </span>
              <span className="text-2xl font-bold text-primary">
                ₹{cartTotal}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-bold py-3 px-4 rounded-xl hover:bg-primary-hover shadow-lg transition-all disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Place Order & Pay"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
