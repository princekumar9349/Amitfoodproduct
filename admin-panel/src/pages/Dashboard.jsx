import { useEffect, useState } from "react";
import api from "../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch products count
        const productsRes = await api.get("/products");
        // Fetch orders
        const ordersRes = await api.get("/orders");

        const products = productsRes.data;
        const orders = ordersRes.data;

        const revenue = orders.reduce(
          (acc, order) => acc + (order.totalAmount || 0),
          0,
        );

        setStats({
          products: products.length,
          orders: orders.length,
          revenue: revenue,
        });
      } catch (error) {
        console.error("Error fetching stats", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 className="text-gray-500 text-lg">Total Products</h3>
          <p className="text-4xl font-bold text-gray-800 mt-2">
            {stats.products}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 className="text-gray-500 text-lg">Total Orders</h3>
          <p className="text-4xl font-bold text-gray-800 mt-2">
            {stats.orders}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <h3 className="text-gray-500 text-lg">Total Revenue</h3>
          <p className="text-4xl font-bold text-gray-800 mt-2">
            ₹{stats.revenue.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
