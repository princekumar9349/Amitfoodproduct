import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  CreditCard,
  Banknote,
  Truck,
  ChevronRight,
  ShieldCheck,
  Loader2,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import orderService from "../services/orderService";

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth(); // Assuming auth context provides user info
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Card"); // 'Card', 'UPI', 'COD'

  const [formData, setFormData] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "India",
    phone: "",
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/");
      toast.error("Your cart is empty");
    }
  }, [cartItems, navigate]);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Calculate Finals
  const tax = cartTotal * 0.05;
  const shipping = 0; // Free shipping logic
  const finalTotal = cartTotal + tax + shipping;

  // Handle Submit
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        orderItems: cartItems.map((item) => ({
          name: item.name,
          qty: item.quantity,
          image: item.image,
          price: item.price,
          product: item._id,
        })),
        shippingAddress: formData,
        paymentMethod,
        itemsPrice: cartTotal,
        taxPrice: tax,
        shippingPrice: shipping,
        totalPrice: finalTotal,
      };

      // 1️⃣ Create Razorpay Order (Backend Call)
      const response = await orderService.createOrder(orderData);

      console.log("Razorpay Order Response:", response);

      if (!response || !response.id || !response.key) {
        throw new Error("Invalid payment initialization response");
      }

      if (!window.Razorpay) {
        toast.error("Payment gateway failed to load");
        return;
      }

      // 2️⃣ Razorpay Configuration
      const options = {
        key: response.key,
        amount: response.amount,
        currency: response.currency,
        name: "Amit Food Products",
        description: "Order Payment",
        order_id: response.id,

        handler: async function (paymentResponse) {
          try {
            await orderService.verifyPayment({
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
              orderId: response.orderId,
            });

            clearCart();
            toast.success("Payment Successful!");
            navigate("/order-success");
          } catch (verifyError) {
            console.error("Verification Failed:", verifyError);
            toast.error("Payment verification failed");
          }
        },

        modal: {
          ondismiss: function () {
            toast.error("Payment cancelled by user");
          },
        },

        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: formData.phone,
        },

        theme: {
          color: "#f97316",
        },
      };

      // 3️⃣ Open Razorpay
      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        console.error("Payment Failed:", response.error);
        toast.error("Payment failed");
      });

      rzp.open();
    } catch (error) {
      console.error("Checkout Error:", error);
      toast.error(
        error.response?.data?.message || error.message || "Payment failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Secure Checkout
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
            <span>Cart</span>
            <ChevronRight size={14} />
            <span className="text-orange-600 font-medium">Checkout</span>
            <ChevronRight size={14} />
            <span>Payment</span>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-start">
          {/* --- LEFT COLUMN: FORMS --- */}
          <div className="lg:col-span-8 space-y-8">
            {/* 1. Shipping Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                  <MapPin size={24} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Shipping Details
                </h2>
              </div>

              <form
                id="checkout-form"
                onSubmit={handlePlaceOrder}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    placeholder="123 Foodie Lane, Apt 4B"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    placeholder="Mumbai"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    required
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    placeholder="400001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    disabled
                    value={formData.country}
                    className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed"
                  />
                </div>
              </form>
            </motion.div>

            {/* 2. Payment Method */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-green-100 p-2 rounded-lg text-green-600">
                  <CreditCard size={24} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Payment Method
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: "Card", icon: CreditCard, label: "Credit/Debit Card" },
                  { id: "UPI", icon: ShieldCheck, label: "UPI / Netbanking" },
                  { id: "COD", icon: Banknote, label: "Cash on Delivery" },
                ].map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === method.id
                        ? "border-orange-500 bg-orange-50 text-orange-700"
                        : "border-gray-100 hover:border-orange-200 text-gray-600"
                    }`}
                  >
                    <method.icon size={28} className="mb-2" />
                    <span className="font-semibold text-sm">
                      {method.label}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* --- RIGHT COLUMN: SUMMARY --- */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-28"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Order Summary
              </h3>

              {/* Mini Cart List */}
              <div className="max-h-64 overflow-y-auto space-y-4 mb-6 pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex gap-3">
                    <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-bold text-gray-900">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 pt-4 border-t border-gray-100 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (5%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-lg font-extrabold text-gray-900 pt-3 border-t border-gray-100">
                  <span>Total</span>
                  <span>₹{finalTotal.toFixed(0)}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                form="checkout-form" // Connects to the form ID above
                disabled={loading}
                className="w-full mt-6 bg-gray-900 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:bg-orange-600 hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Confirm Order"
                )}
              </button>

              <p className="text-xs text-gray-400 text-center mt-4 flex items-center justify-center gap-1">
                <ShieldCheck size={12} /> 100% Secure Transaction
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
