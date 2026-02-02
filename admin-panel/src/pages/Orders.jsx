import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders");
      setOrders(data);
    } catch (error) {
      toast.error("Failed to load orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      toast.success(`Order marked as ${status}`);
      fetchOrders();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Orders</h2>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Address
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Items
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Total
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {order._id.substring(0, 8)}...
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {order.userId}{" "}
                  {/* Since User model isn't populated properly in backend yet, just ID or fix backend later */}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {order.address}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {order.products.map((p, i) => (
                    <div key={i}>
                      {p.productId?.name} x {p.quantity}
                    </div>
                  ))}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  ₹{order.totalAmount}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <select
                    value={order.orderStatus}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className={`p-2 rounded border font-semibold 
                                            ${
                                              order.orderStatus === "Delivered"
                                                ? "text-green-600 bg-green-100"
                                                : order.orderStatus ===
                                                    "Cancelled"
                                                  ? "text-red-600 bg-red-100"
                                                  : "text-yellow-600 bg-yellow-100"
                                            }`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Packed">Packed</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
