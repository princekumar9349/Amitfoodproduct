import { useEffect, useState } from "react";
import api from "../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  ShoppingCart,
  Users,
  Calendar,
  ArrowUpRight,
  AlertCircle,
} from "lucide-react";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [range, setRange] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersRes = await api.get("/orders");
        const productsRes = await api.get("/products?limit=1000");

        const normalizedOrders = Array.isArray(ordersRes.data)
          ? ordersRes.data
          : Array.isArray(ordersRes.data?.orders)
            ? ordersRes.data.orders
            : [];

        const normalizedProducts = Array.isArray(productsRes.data)
          ? productsRes.data
          : Array.isArray(productsRes.data?.products)
            ? productsRes.data.products
            : [];

        setOrders(normalizedOrders);
        setProducts(normalizedProducts);
      } catch (error) {
        console.error("Dashboard fetch failed:", error);
        setOrders([]);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const now = new Date();

  const filteredOrders = Array.isArray(orders)
    ? orders.filter((o) => {
        if (!o?.createdAt) return false;
        const orderDate = new Date(o.createdAt);
        const diffDays = (now - orderDate) / (1000 * 60 * 60 * 24);
        return diffDays <= range;
      })
    : [];

  const paidOrders = filteredOrders.filter(
    (o) => o?.paymentStatus === "Paid" && o?.orderStatus !== "Cancelled",
  );

  const revenue = paidOrders.reduce((sum, o) => sum + (o?.totalAmount || 0), 0);

  const dailyMap = {};
  paidOrders.forEach((order) => {
    const day = new Date(order.createdAt).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
    if (!dailyMap[day]) dailyMap[day] = 0;
    dailyMap[day] += order.totalAmount || 0;
  });

  const dailyData = Object.keys(dailyMap).map((day) => ({
    day,
    revenue: dailyMap[day],
  }));

  const productSales = {};
  paidOrders.forEach((order) => {
    (order.products || []).forEach((p) => {
      const name = p.productId?.name || "Unknown";
      if (!productSales[name]) productSales[name] = 0;
      productSales[name] += p.quantity || 0;
    });
  });

  const topProducts = Object.keys(productSales)
    .map((name) => ({ name, quantity: productSales[name] }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  const lowStock = Array.isArray(products)
    ? products.filter((p) => p?.stock <= 5)
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Overview of your store's performance.</p>
        </div>

        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200">
          <Calendar size={18} className="text-gray-500" />
          <select
            value={range}
            onChange={(e) => setRange(Number(e.target.value))}
            className="bg-transparent text-sm font-semibold text-gray-700 outline-none cursor-pointer"
          >
            <option value={7}>Last 7 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 3 Months</option>
          </select>
        </div>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`₹${revenue.toLocaleString()}`}
          icon={<TrendingUp size={24} />}
          color="bg-green-500"
        />
        <StatCard
          title="Total Orders"
          value={filteredOrders.length}
          icon={<ShoppingCart size={24} />}
          color="bg-blue-500"
        />
        <StatCard
          title="Successful Orders"
          value={paidOrders.length}
          icon={<Users size={24} />}
          color="bg-purple-500"
        />
        <StatCard
          title="Low Stock Items"
          value={lowStock.length}
          icon={<AlertCircle size={24} />}
          color="bg-red-500"
          isAlert
        />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border">
          <h3 className="text-lg font-bold mb-6">Revenue Overview</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h3 className="text-lg font-bold mb-6">Top Selling Items</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Bar dataKey="quantity" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* LOW STOCK ALERTS */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-50 text-red-600 rounded-lg">
            <AlertCircle size={20} />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Low Stock Alerts</h3>
        </div>

        {lowStock.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-sm text-gray-500 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Product</th>
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold text-right">Stock</th>
                  <th className="pb-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {lowStock.map((product) => (
                  <tr
                    key={product._id}
                    className="group hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden border border-gray-200">
                          {product.image ? (
                            <img
                              src={
                                product.image.startsWith("data:") ||
                                product.image.startsWith("http")
                                  ? product.image
                                  : `${api.defaults.baseURL.replace("/api", "")}${
                                      product.image.startsWith("/") ? "" : "/"
                                    }${product.image}`
                              }
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "https://placehold.co/100?text=No+Image";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <ShoppingCart size={16} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 line-clamp-1">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Unit: {product.unit}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-gray-600 font-medium">
                      {product.category}
                    </td>
                    <td className="py-4 text-right">
                      <span className="font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm">
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <span className="text-xs font-bold text-red-500 uppercase tracking-wide">
                        Restock Now
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-500 font-medium">
              No low stock items. Good job! 🎉
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, isAlert }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border flex justify-between items-center">
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <h4 className={`text-2xl font-bold ${isAlert ? "text-red-600" : ""}`}>
        {value}
      </h4>
    </div>
    <div className={`${color} p-3 rounded-xl text-white`}>{icon}</div>
  </div>
);

export default Dashboard;
