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

// Temporary placeholder components to avoid build errors until implemented
const DashboardPlaceholder = () => <div className="p-4">Dashboard (Todo)</div>;
const ManageProductsPlaceholder = () => (
  <div className="p-4">Manage Products (Todo)</div>
);
const OrdersPlaceholder = () => <div className="p-4">Orders (Todo)</div>;

// Layout for protected routes (Sidebar + Content)
const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
};

function App() {
  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

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
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
