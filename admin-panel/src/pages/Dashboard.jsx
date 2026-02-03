import { useEffect, useState } from "react";
import api from "../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

const COLORS = ["#22c55e", "#ef4444", "#3b82f6", "#facc15"];

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [range, setRange] = useState(30);

  useEffect(() => {
    const fetchData = async () => {
      const ordersRes = await api.get("/orders");
      const productsRes = await api.get("/products");

      setOrders(ordersRes.data);
      setProducts(productsRes.data);
    };

    fetchData();
  }, []);

  // Filter by date range
  const now = new Date();
  const filteredOrders = orders.filter((o) => {
    const orderDate = new Date(o.createdAt);
    const diffDays = (now - orderDate) / (1000 * 60 * 60 * 24);
    return diffDays <= range;
  });

  const paidOrders = filteredOrders.filter(
    (o) => o.paymentStatus === "Paid" && o.orderStatus !== "Cancelled"
  );

  const revenue = paidOrders.reduce(
    (sum, o) => sum + o.totalAmount,
    0
  );

  // Daily Revenue
  const dailyMap = {};
  paidOrders.forEach((order) => {
    const day = new Date(order.createdAt).toLocaleDateString();
    if (!dailyMap[day]) dailyMap[day] = 0;
    dailyMap[day] += order.totalAmount;
  });

  const dailyData = Object.keys(dailyMap).map((day) => ({
    day,
    revenue: dailyMap[day],
  }));

  // Top Products
  const productSales = {};
  paidOrders.forEach((order) => {
    order.products.forEach((p) => {
      const name = p.productId?.name || "Unknown";
      if (!productSales[name]) productSales[name] = 0;
      productSales[name] += p.quantity;
    });
  });

  const topProducts = Object.keys(productSales)
    .map((name) => ({
      name,
      quantity: productSales[name],
    }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  // Low Stock
  const lowStock = products.filter((p) => p.stock <= 5);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">
        SaaS Analytics Dashboard
      </h2>

      {/* Date Filter */}
      <div className="mb-6">
        <select
          value={range}
          onChange={(e) => setRange(Number(e.target.value))}
          className="border p-2 rounded"
        >
          <option value={7}>Last 7 Days</option>
          <option value={30}>Last 30 Days</option>
          <option value={90}>Last 90 Days</option>
        </select>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card title="Revenue" value={`₹${revenue}`} />
        <Card title="Orders" value={filteredOrders.length} />
        <Card title="Paid Orders" value={paidOrders.length} />
        <Card title="Low Stock Items" value={lowStock.length} />
      </div>

      {/* Revenue Trend */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h3 className="font-semibold mb-4">Daily Revenue</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyData}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Products */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h3 className="font-semibold mb-4">Top Selling Products</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topProducts}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="quantity" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Low Stock Alert */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="font-semibold mb-4">Low Stock Alerts</h3>
        {lowStock.length === 0 ? (
          <p className="text-green-600">All inventory healthy</p>
        ) : (
          lowStock.map((item) => (
            <div
              key={item._id}
              className="text-red-600 font-semibold"
            >
              {item.name} — {item.stock} left
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const Card = ({ title, value }) => (
  <div className="bg-white p-6 rounded shadow border-l-4 border-blue-500">
    <h3 className="text-gray-500">{title}</h3>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </div>
);

export default Dashboard;
