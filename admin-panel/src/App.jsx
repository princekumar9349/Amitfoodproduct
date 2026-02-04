import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddProduct from "./pages/AddProduct";
import ManageProducts from "./pages/ManageProducts";
import Orders from "./pages/Orders";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";

import { useState } from "react";
import { FaBars } from "react-icons/fa";

// Layout for protected routes
const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="text-gray-600 hover:text-gray-900 p-1"
            >
              <FaBars size={24} />
            </button>
            <div className="text-lg font-bold text-gray-900">
              AmitFood{" "}
              <span className="text-xs font-normal text-gray-500">Admin</span>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-8 flex-1 overflow-x-hidden">{children}</div>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/dashboard"
              element={
                <Layout>
                  <Dashboard />
                </Layout>
              }
            />
            <Route
              path="/add-product"
              element={
                <Layout>
                  <AddProduct />
                </Layout>
              }
            />
            <Route
              path="/products"
              element={
                <Layout>
                  <ManageProducts />
                </Layout>
              }
            />
            <Route
              path="/orders"
              element={
                <Layout>
                  <Orders />
                </Layout>
              }
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
