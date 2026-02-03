import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [search, setSearch] = useState("");

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders");
      setOrders(data);
    } catch {
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
    } catch {
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

  const getPaymentColor = (payment) =>
    payment === "Paid"
      ? "bg-green-100 text-green-600"
      : "bg-red-100 text-red-600";

  const getProgressWidth = (status) => {
    switch (status) {
      case "Pending":
        return "20%";
      case "Confirmed":
        return "40%";
      case "Packed":
        return "60%";
      case "Out for Delivery":
        return "80%";
      case "Delivered":
        return "100%";
      default:
        return "10%";
    }
  };

  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.totalAmount,
    0,
  );

  const paidRevenue = orders
    .filter((o) => o.paymentStatus === "Paid")
    .reduce((sum, order) => sum + order.totalAmount, 0);

  const filteredOrders = orders.filter((order) =>
    order._id.toLowerCase().includes(search.toLowerCase()),
  );

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
            th, td { border: 1px solid #ddd; padding: 8px; }
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

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Orders Dashboard
      </h2>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search by Order ID..."
        className="border p-2 rounded mb-6 w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h4 className="text-gray-500 text-sm">Total Orders</h4>
          <p className="text-2xl font-bold">{orders.length}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h4 className="text-gray-500 text-sm">Total Revenue</h4>
          <p className="text-2xl font-bold">₹{totalRevenue}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h4 className="text-gray-500 text-sm">Paid Revenue</h4>
          <p className="text-2xl font-bold text-green-600">₹{paidRevenue}</p>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100 text-left text-xs font-semibold uppercase">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Items</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Invoice</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6">
                  No Orders Found
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <>
                  <tr
                    key={order._id}
                    onClick={() =>
                      setExpandedOrder(
                        expandedOrder === order._id ? null : order._id,
                      )
                    }
                    className="border-b hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="p-3">{order._id.substring(0, 8)}...</td>

                    <td className="p-3">{order.userId?.name || "Customer"}</td>

                    <td className="p-3">{order.products.length} item(s)</td>

                    <td className="p-3 font-semibold">₹{order.totalAmount}</td>

                    <td className="p-3">
                      <select
                        value={order.orderStatus}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className={`p-2 rounded border font-semibold ${getStatusColor(
                          order.orderStatus,
                        )}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Packed">Packed</option>
                        <option value="Out for Delivery">
                          Out for Delivery
                        </option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded font-semibold ${getPaymentColor(
                          order.paymentStatus,
                        )}`}
                      >
                        {order.paymentStatus || "Pending"}
                      </span>
                    </td>

                    <td className="p-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrint(order);
                        }}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Print
                      </button>
                    </td>
                  </tr>

                  {/* EXPANDED SECTION */}
                  {expandedOrder === order._id && (
                    <tr>
                      <td colSpan="7" className="bg-gray-50 p-5">
                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="max-w-md bg-gray-200 rounded h-2">

                            <div
                              className="bg-green-500 h-2 rounded"
                              style={{
                                width: getProgressWidth(order.orderStatus),
                              }}
                            />
                          </div>
                          <p className="text-sm mt-2 font-medium">
                            Status: {order.orderStatus}
                          </p>
                        </div>

                        {/* Product Breakdown */}
                        <div className="space-y-4">
                          {order.products.map((p, i) => (
                            <div
                              key={i}
                              className="flex justify-between items-center border-b pb-2"
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={p.productId?.image || "/fallback.jpg"}
                                  onError={(e) => {
                                    e.target.src = "/fallback.jpg";
                                  }}
                                  className="w-14 h-14 object-cover rounded border"
                                  alt="product"
                                />

                                <div>
                                  <div className="font-medium">
                                    {p.productId?.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    ₹{p.productId?.price}
                                  </div>
                                </div>
                              </div>

                              <div>Qty: {p.quantity}</div>

                              <div className="font-semibold">
                                ₹
                                {(
                                  Number(p.quantity) *
                                  Number(p.productId?.price || 0)
                                ).toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
