import React, { useEffect, useState } from "react";
import orderService from "../services/orderService";
import toast from "react-hot-toast";
import Skeleton from "../components/Skeleton";
import { Package } from "lucide-react";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getMyOrders();
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">My Orders</h1>
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full mb-4 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <Package size={64} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            You haven't placed any orders yet.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-b border-gray-100">
                <div>
                  <p className="text-sm text-gray-500">
                    Order ID:
                    <span className="font-mono text-gray-700 ml-2">
                      {order._id}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  {/* Order Status */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase
                      ${
                        order.orderStatus === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.orderStatus === "Cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                  >
                    {order.orderStatus || "Processing"}
                  </span>

                  {/* Payment Status */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase
                      ${
                        order.paymentStatus === "Success" ||
                        order.paymentStatus === "Paid"
                          ? "bg-green-100 text-green-700"
                          : order.paymentStatus === "Failed"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                  >
                    {order.paymentStatus || "Pending"}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="p-6">
                {(order.products || []).map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-gray-800 font-medium">
                        {item.productId?.name || "Unknown Item"}
                      </span>
                      <span className="text-gray-400 text-sm">
                        x{item.quantity}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Total */}
                <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
                  <p className="text-lg font-bold text-gray-900">
                    Total:
                    <span className="text-primary ml-2">
                      ₹{order.totalAmount}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
