import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders");
      setOrders(data);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      toast.success(`Order updated to ${status}`);
      fetchOrders();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-600";
      case "Cancelled":
        return "bg-red-100 text-red-600";
      case "Confirmed":
      case "Packed":
      case "Out for Delivery":
        return "bg-blue-100 text-blue-600";
      default:
        return "bg-yellow-100 text-yellow-600";
    }
  };

  const getPaymentColor = (payment) => {
    return payment === "Paid"
      ? "bg-green-100 text-green-600"
      : "bg-red-100 text-red-600";
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Orders</h2>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="table-head">Order ID</th>
              <th className="table-head">Customer</th>
              <th className="table-head">Address</th>
              <th className="table-head">Items</th>
              <th className="table-head">Total</th>
              <th className="table-head">Status</th>
              <th className="table-head">Payment</th>
            </tr>
            <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold uppercase">
              Invoice
            </th>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No Orders Available
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id}>
                  <td className="table-cell">
                    {order._id?.substring(0, 8)}...
                  </td>

                  <td className="table-cell">
                    {order.userId?.name || order.userId || "Unknown"}
                  </td>

                  <td className="table-cell">
                    {order.address ? (
                      <div className="space-y-1 text-sm">
                        <div>{order.address.street}</div>
                        <div>
                          {order.address.city}, {order.address.state}
                        </div>
                        <div>
                          {order.address.zip}, {order.address.country}
                        </div>
                      </div>
                    ) : (
                      "N/A"
                    )}
                  </td>

                  <td className="table-cell">
                    {order.products?.length > 0
                      ? order.products.map((p, i) => (
                          <div key={i}>
                            {p.productId?.name || "Product"} x {p.quantity}
                          </div>
                        ))
                      : "No Items"}
                  </td>

                  <td className="table-cell font-semibold">
                    ₹{order.totalAmount}
                  </td>

                  {/* STATUS */}
                  <td className="table-cell">
                    <select
                      value={order.orderStatus}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className={`p-2 rounded border font-semibold ${getStatusColor(
                        order.orderStatus,
                      )}`}
                    >
                      <td className="px-5 py-5 border-b text-sm">
                        <button
                          onClick={() => handlePrint(order)}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Print
                        </button>
                      </td>

                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Packed">Packed</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>

                  {/* PAYMENT */}
                  <td className="table-cell">
                    <span
                      className={`px-3 py-1 rounded font-semibold ${getPaymentColor(
                        order.paymentStatus,
                      )}`}
                    >
                      {order.paymentStatus || "Pending"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
const handlePrint = (order) => {
  const printWindow = window.open("", "_blank");

  const itemsHtml = order.products
    .map(
      (p) => `
        <tr>
          <td>${p.productId?.name}</td>
          <td>${p.quantity}</td>
          <td>₹${p.productId?.price}</td>
          <td>₹${p.quantity * p.productId?.price}</td>
        </tr>
      `,
    )
    .join("");

  printWindow.document.write(`
    <html>
      <head>
        <title>Invoice</title>
        <style>
          body { font-family: Arial; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f4f4f4; }
        </style>
      </head>
      <body>
        <h2>Amit Food Store</h2>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
        <p><strong>Customer:</strong> ${order.userId?.name || "Customer"}</p>

        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <h3>Total Amount: ₹${order.totalAmount}</h3>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.print();
};

export default Orders;
