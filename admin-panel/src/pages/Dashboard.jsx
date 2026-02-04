import { useEffect, useState } from "react";
import api from "../services/api";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, CartesianGrid, AreaChart, Area
} from "recharts";
import { 
  TrendingUp, ShoppingCart, Users, Package, 
  Calendar, ArrowUpRight, AlertCircle 
} from "lucide-react";

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

  // --- DATA PROCESSING ---
  const now = new Date();
  const filteredOrders = orders.filter((o) => {
    const orderDate = new Date(o.createdAt);
    const diffDays = (now - orderDate) / (1000 * 60 * 60 * 24);
    return diffDays <= range;
  });

  const paidOrders = filteredOrders.filter(
    (o) => o.paymentStatus === "Paid" && o.orderStatus !== "Cancelled"
  );

  const revenue = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  // Daily Revenue Logic
  const dailyMap = {};
  paidOrders.forEach((order) => {
    const day = new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    if (!dailyMap[day]) dailyMap[day] = 0;
    dailyMap[day] += order.totalAmount;
  });
  const dailyData = Object.keys(dailyMap).map((day) => ({ day, revenue: dailyMap[day] }));

  // Top Products Logic
  const productSales = {};
  paidOrders.forEach((order) => {
    order.products.forEach((p) => {
      const name = p.productId?.name || "Unknown";
      if (!productSales[name]) productSales[name] = 0;
      productSales[name] += p.quantity;
    });
  });
  const topProducts = Object.keys(productSales)
    .map((name) => ({ name, quantity: productSales[name] }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  const lowStock = products.filter((p) => p.stock <= 5);

  return (
    <div className="space-y-8">
      
      {/* HEADER & FILTER */}
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

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
            title="Total Revenue" 
            value={`₹${revenue.toLocaleString()}`} 
            icon={<TrendingUp size={24} />} 
            color="bg-green-500" 
            trend="+12% from last month"
        />
        <StatCard 
            title="Total Orders" 
            value={filteredOrders.length} 
            icon={<ShoppingCart size={24} />} 
            color="bg-blue-500" 
            trend="+5 new today"
        />
        <StatCard 
            title="Successful Orders" 
            value={paidOrders.length} 
            icon={<Users size={24} />} 
            color="bg-purple-500" 
            trend="85% conversion rate"
        />
        <StatCard 
            title="Low Stock Items" 
            value={lowStock.length} 
            icon={<AlertCircle size={24} />} 
            color="bg-red-500" 
            trend="Action needed"
            isAlert
        />
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* REVENUE CHART */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Revenue Overview</h3>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dailyData}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* TOP PRODUCTS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Top Selling Items</h3>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topProducts} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={100} tick={{fill: '#4b5563', fontSize: 12, fontWeight: 500}} axisLine={false} tickLine={false} />
                        <Tooltip cursor={{fill: '#f3f4f6'}} />
                        <Bar dataKey="quantity" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      {/* RECENT ORDERS / LOW STOCK */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Low Stock List */}
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Inventory Alerts</h3>
                <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-bold">{lowStock.length} Issues</span>
            </div>
            
            {lowStock.length === 0 ? (
                <div className="text-center py-10 text-gray-400">All stock levels are healthy!</div>
            ) : (
                <div className="space-y-3">
                    {lowStock.slice(0, 5).map(item => (
                        <div key={item._id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center text-xl shadow-sm">
                                    📦
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800 text-sm">{item.name}</p>
                                    <p className="text-xs text-red-600 font-medium">Critical Stock</p>
                                </div>
                            </div>
                            <span className="text-red-700 font-bold text-lg">{item.stock}</span>
                        </div>
                    ))}
                </div>
            )}
         </div>

         {/* Recent Activity Mockup */}
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
            <div className="space-y-4">
                {orders.slice(0, 4).map((order) => (
                    <div key={order._id} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${order.orderStatus === 'Delivered' ? 'bg-green-500' : 'bg-blue-500'}`}>
                                {order.userId?.name?.[0] || 'U'}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-800">New Order from {order.userId?.name || 'Customer'}</p>
                                <p className="text-xs text-gray-500">₹{order.totalAmount} • {order.products.length} Items</p>
                            </div>
                        </div>
                        <span className="text-xs font-semibold bg-gray-100 px-2 py-1 rounded">
                            {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                    </div>
                ))}
            </div>
         </div>
      </div>

    </div>
  );
};

// Helper Component for Metric Cards
const StatCard = ({ title, value, icon, color, trend, isAlert }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-gray-500 text-sm font-medium">{title}</p>
                <h4 className={`text-2xl font-black mt-1 ${isAlert ? 'text-red-600' : 'text-gray-900'}`}>{value}</h4>
            </div>
            <div className={`${color} p-3 rounded-xl text-white shadow-lg shadow-${color}/30`}>
                {icon}
            </div>
        </div>
        <div className="flex items-center gap-1 text-xs font-semibold text-gray-400">
            {!isAlert && <ArrowUpRight size={14} className="text-green-500" />}
            <span className={isAlert ? 'text-red-500' : 'text-green-500'}>{trend}</span>
        </div>
    </div>
);

export default Dashboard;