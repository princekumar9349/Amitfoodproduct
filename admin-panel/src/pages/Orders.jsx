import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { Printer, Package, Search } from "lucide-react";
import getImageUrl from "../utils/imageHelper";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [search, setSearch] = useState("");

  const fetchOrders = async () => {
    try {
      console.log("Fetching orders...");
      const { data } = await api.get("/orders");
      console.log("Orders fetched:", data);
      // Handle different response structures if necessary
      const ordersList = Array.isArray(data) ? data : data.orders || [];
      setOrders(ordersList);
    } catch (error) {
      console.error("Error fetching orders:", error);
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Failed to load orders";
      toast.error(msg);
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
        return "bg-green-100 text-green-700 border-green-200";
      case "Cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      case "Confirmed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Packed":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Out for Delivery":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getPaymentColor = (payment) =>
    payment === "Paid"
      ? "bg-green-100 text-green-700 border-green-200"
      : "bg-orange-100 text-orange-700 border-orange-200";

  const toggleExpand = (id) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  const filteredOrders = orders.filter((order) =>
    order._id?.toLowerCase().includes(search.toLowerCase()),
  );

  const handlePrint = (order) => {
    const printWindow = window.open("", "_blank");
    const itemsHtml = order.products
      .map(
        (p) => `
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 10px;">${p.productId?.name || "Product"}</td>
          <td style="padding: 10px; text-align: center;">${p.quantity}</td>
          <td style="padding: 10px; text-align: right;">₹${p.productId?.price || 0}</td>
          <td style="padding: 10px; text-align: right;">₹${(p.quantity * (p.productId?.price || 0)).toFixed(2)}</td>
        </tr>
      `,
      )
      .join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice #${order._id.slice(-6).toUpperCase()}</title>
          <style>
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #333; }
            .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
            .logo { font-size: 24px; font-weight: bold; color: #ea580c; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #f9fafb; padding: 12px; text-align: left; font-size: 12px; text-transform: uppercase; color: #6b7280; }
            .total { margin-top: 20px; text-align: right; font-size: 18px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
                <div class="logo">Amit Food Products</div>
                <p>Order ID: <strong>#${order._id.slice(-6).toUpperCase()}</strong></p>
                <p>Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div style="text-align: right;">
                <p><strong>Customer:</strong> ${order.userId?.name || "Customer"}</p>
                <p>${order.status}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="total">
            Total Amount: ₹${order.totalAmount}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="p-6 bg-gray-50/50 min-h-screen max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            Orders
          </h2>
          <p className="text-gray-500 mt-1">
            Manage and track customer orders.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by Order ID..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 border-b border-gray-200">
              <tr>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500">
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <>
                    <tr
                      key={order._id}
                      onClick={() => toggleExpand(order._id)}
                      className="group hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="p-4 font-mono text-sm text-gray-600">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>

                      <td className="p-4 font-medium text-gray-900">
                        {order.userId?.name || "Guest Customer"}
                      </td>

                      <td className="p-4 text-gray-600">
                        <span className="inline-flex items-center gap-1.5 bg-gray-100 px-2.5 py-1 rounded-full text-xs font-medium">
                          <Package size={14} /> {order.products?.length || 0}{" "}
                          items
                        </span>
                      </td>

                      <td className="p-4 font-bold text-gray-900">
                        ₹{order.totalPrice || order.totalAmount || 0}
                      </td>

                      <td className="p-4">
                        <select
                          onClick={(e) => e.stopPropagation()}
                          value={order.orderStatus}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          className={`text-xs font-bold px-3 py-1.5 rounded-full border appearance-none cursor-pointer outline-none focus:ring-2 focus:ring-offset-1 ${getStatusColor(order.orderStatus)}`}
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

                      <td className="p-4">
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-md border ${getPaymentColor(order.paymentStatus)}`}
                        >
                          {order.paymentMethod || order.paymentStatus}
                        </span>
                      </td>

                      <td className="p-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePrint(order);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Print Invoice"
                        >
                          <Printer size={18} />
                        </button>
                      </td>
                    </tr>

                    {/* EXPANDED DETAILS */}
                    {expandedOrder === order._id && (
                      <tr className="bg-gray-50/50">
                        <td
                          colSpan="7"
                          className="p-0 border-b border-gray-100"
                        >
                          <div className="p-6 pl-12">
                            <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                              <Package size={16} className="text-orange-600" />{" "}
                              Order Items
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {order.products?.map((p, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-200 shadow-sm"
                                >
                                  <img
                                    src={getImageUrl(p.productId?.image)}
                                    onError={(e) =>
                                      (e.target.src =
                                        "https://placehold.co/100?text=No+Img")
                                    }
                                    className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                                    alt={p.productId?.name}
                                  />
                                  <div>
                                    <p className="font-bold text-gray-900">
                                      {p.productId?.name || "Unknown Product"}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      Qty:{" "}
                                      <span className="font-semibold text-gray-900">
                                        {p.quantity}
                                      </span>{" "}
                                      × ₹{p.productId?.price}
                                    </p>
                                  </div>
                                  <div className="ml-auto font-bold text-gray-900">
                                    ₹
                                    {(
                                      Number(p.quantity) *
                                      Number(p.productId?.price || 0)
                                    ).toFixed(2)}
                                  </div>
                                </div>
                              ))}
                            </div>
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
    </div>
  );
};

export default Orders;
