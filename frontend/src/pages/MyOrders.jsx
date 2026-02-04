import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import orderService from "../services/orderService";
import {
  Package,
  Calendar,
  Clock,
  ShoppingBag,
  AlertCircle,
  CheckCircle2,
  Truck,
} from "lucide-react";
import toast from "react-hot-toast";
import Skeleton from "../components/Skeleton";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getMyOrders();

        const sorted = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );

        setOrders(sorted);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "Confirmed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Out for Delivery":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      case "Packed":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    if (status === "Delivered") return <CheckCircle2 size={14} />;
    if (status === "Out for Delivery") return <Truck size={14} />;
    if (status === "Cancelled") return <AlertCircle size={14} />;
    if (status === "Packed") return <Package size={14} />;
    if (status === "Pending") return <Clock size={14} />;
    return <Clock size={14} />;
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 pt-28">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 pt-20">
        <div className="bg-white p-8 rounded-full shadow-lg mb-6">
          <Package size={64} className="text-orange-200" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
        <p className="text-gray-500 mb-8 text-center">
          Looks like you haven't placed any orders yet.
        </p>
        <Link
          to="/"
          className="bg-orange-600 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-700 transition-colors shadow-lg"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingBag className="text-orange-600" size={32} />
          <h1 className="text-3xl font-extrabold text-gray-900">My Orders</h1>
          <span className="bg-gray-200 text-gray-600 text-sm font-bold px-3 py-1 rounded-full">
            {orders.length}
          </span>
        </div>

        <div className="space-y-6">
          {orders.map((order, index) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${getStatusStyle(order.orderStatus)}`}
                  >
                    {getStatusIcon(order.orderStatus)}
                    {order.orderStatus}
                  </span>
                  <p className="text-xl font-extrabold text-gray-900 mt-2">
                    ₹{order.totalAmount}
                  </p>
                </div>
              </div>

              {/* Products */}
              <div className="p-6 space-y-4">
                {order.products?.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900">
                        {item.productId?.name || "Product"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity} × ₹{item.productId?.price}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      ₹
                      {(item.quantity * (item.productId?.price || 0)).toFixed(
                        2,
                      )}
                    </p>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 text-sm text-gray-600">
                Payment Status:{" "}
                <span className="font-semibold text-gray-900">
                  {order.paymentStatus}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
