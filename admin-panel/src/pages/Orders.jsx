import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { 
  Search, Printer, ChevronDown, ChevronUp, Package, 
  Calendar, CheckCircle, Truck, XCircle, Clock, 
  Download, Filter, RefreshCw, ChevronLeft, ChevronRight 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ITEMS_PER_PAGE = 10;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  
  // Filters & Pagination States
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateRange, setDateRange] = useState("All Time");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/orders");
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // --- ACTIONS ---
  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      toast.success(`Order updated to ${status}`);
      fetchOrders();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const exportToCSV = () => {
    const headers = ["Order ID", "Customer", "Date", "Total", "Status", "Payment"];
    const rows = filteredOrders.map(o => [
      o._id,
      o.userId?.name || "Guest",
      new Date(o.createdAt).toLocaleDateString(),
      o.totalAmount,
      o.orderStatus,
      o.paymentStatus
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "orders_export.csv");
    document.body.appendChild(link);
    link.click();
  };

  // --- FILTERING LOGIC ---
  const filterOrders = () => {
    let result = [...orders];

    // 1. Search
    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(o => 
        o._id.toLowerCase().includes(lowerSearch) ||
        (o.userId?.name || "").toLowerCase().includes(lowerSearch)
      );
    }

    // 2. Status Tabs
    if (statusFilter !== "All") {
      if (statusFilter === "Active") {
        result = result.filter(o => ["Pending", "Confirmed", "Packed", "Out for Delivery"].includes(o.orderStatus));
      } else if (statusFilter === "Completed") {
        result = result.filter(o => o.orderStatus === "Delivered");
      } else if (statusFilter === "Cancelled") {
        result = result.filter(o => o.orderStatus === "Cancelled");
      }
    }

    // 3. Date Range
    if (dateRange !== "All Time") {
      const now = new Date();
      const days = dateRange === "Today" ? 1 : dateRange === "Last 7 Days" ? 7 : 30;
      result = result.filter(o => {
        const orderDate = new Date(o.createdAt);
        const diffTime = Math.abs(now - orderDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= days;
      });
    }

    // Sort by Date Descending (Newest First)
    return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const filteredOrders = filterOrders();
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  // --- STYLING HELPERS ---
  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Cancelled": return "bg-red-100 text-red-700 border-red-200";
      case "Out for Delivery": return "bg-purple-100 text-purple-700 border-purple-200";
      case "Packed": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Confirmed": return "bg-indigo-100 text-indigo-700 border-indigo-200";
      default: return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* --- TOP HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Order Management</h1>
          <p className="text-gray-500 text-sm mt-1">
            Viewing <span className="font-bold text-gray-900">{filteredOrders.length}</span> orders
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchOrders}
            className="p-2.5 bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm"
            title="Refresh Data"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
          
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 shadow-sm transition-all"
          >
            <Download size={18} /> Export
          </button>
        </div>
      </div>

      {/* --- CONTROL BAR --- */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-4 justify-between items-center">
        
        {/* Status Tabs */}
        <div className="flex p-1 bg-gray-100/80 rounded-xl overflow-hidden w-full lg:w-auto">
          {["All", "Active", "Completed", "Cancelled"].map((tab) => (
            <button
              key={tab}
              onClick={() => { setStatusFilter(tab); setCurrentPage(1); }}
              className={`flex-1 lg:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                statusFilter === tab 
                  ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5" 
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          
          {/* Date Filter */}
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full sm:w-40 pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none cursor-pointer hover:bg-white transition-colors"
            >
              <option>All Time</option>
              <option>Today</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="min-w-full">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="6" className="p-8 text-center text-gray-400">Loading orders...</td></tr>
              ) : paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center flex flex-col items-center justify-center text-gray-400">
                    <Package size={48} className="mb-3 opacity-20" />
                    <p>No orders found matching your filters.</p>
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => (
                  <>
                    <tr 
                      key={order._id}
                      onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                      className={`hover:bg-blue-50/50 cursor-pointer transition-colors group ${expandedOrder === order._id ? 'bg-blue-50/30' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900">#{order._id.slice(-6).toUpperCase()}</span>
                          <span className="text-xs text-gray-500">{order.userId?.name || "Guest Customer"}</span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                        <span className="text-gray-400 text-xs block">{new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </td>

                      <td className="px-6 py-4">
                        <select
                          onClick={(e) => e.stopPropagation()}
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-full border appearance-none cursor-pointer outline-none transition-all ${getStatusColor(order.orderStatus)}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Packed">Packed</option>
                          <option value="Out for Delivery">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${order.paymentStatus === 'Paid' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                          <span className="text-sm font-medium text-gray-700">{order.paymentStatus || "Pending"}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <span className="font-mono font-bold text-gray-900">₹{order.totalAmount}</span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center gap-2">
                          <span className="text-gray-300 group-hover:text-blue-500 transition-colors">
                            {expandedOrder === order._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </span>
                        </div>
                      </td>
                    </tr>

                    {/* EXPANDED VIEW */}
                    <AnimatePresence>
                      {expandedOrder === order._id && (
                        <motion.tr 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-gray-50/50"
                        >
                          <td colSpan="6" className="px-6 py-6">
                            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                              
                              <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
                                <div>
                                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-1">Order Details</h4>
                                  <p className="text-xs text-gray-500">Full breakdown of items and costs</p>
                                </div>
                                <button className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                                  <Printer size={14} /> Print Invoice
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Items List */}
                                <div className="space-y-3">
                                  {order.products.map((p, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                      <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-white rounded border border-gray-200 overflow-hidden">
                                          <img 
                                            src={p.productId?.image || "/placeholder.png"} 
                                            className="w-full h-full object-cover"
                                            onError={(e) => e.target.src = "https://via.placeholder.com/40"}
                                          />
                                        </div>
                                        <div>
                                          <p className="text-sm font-bold text-gray-800">{p.productId?.name}</p>
                                          <p className="text-xs text-gray-500">Qty: {p.quantity}</p>
                                        </div>
                                      </div>
                                      <p className="text-sm font-bold text-gray-900">₹{(p.quantity * (p.productId?.price || 0)).toFixed(2)}</p>
                                    </div>
                                  ))}
                                </div>

                                {/* Summary */}
                                <div className="bg-gray-50 p-5 rounded-xl h-fit">
                                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                                    <span>Subtotal</span>
                                    <span>₹{order.totalAmount}</span>
                                  </div>
                                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                                    <span>Tax (5%)</span>
                                    <span>₹{(order.totalAmount * 0.05).toFixed(2)}</span>
                                  </div>
                                  <div className="border-t border-gray-200 my-3 pt-3 flex justify-between font-black text-lg text-gray-900">
                                    <span>Total</span>
                                    <span>₹{(order.totalAmount * 1.05).toFixed(0)}</span>
                                  </div>
                                </div>
                              </div>

                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* --- PAGINATION FOOTER --- */}
        {totalPages > 1 && (
          <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Page <span className="font-bold">{currentPage}</span> of {totalPages}
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;