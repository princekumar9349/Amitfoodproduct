import { Link, useNavigate, useLocation } from "react-router-dom";
import authService from "../services/authService";
import {
  FaHome,
  FaBoxOpen,
  FaPlus,
  FaClipboardList,
  FaSignOutAlt,
} from "react-icons/fa";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path ? "bg-gray-700" : "hover:bg-gray-700";
  };

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-blue-400">Amit Foods</h1>
        <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link
              to="/dashboard"
              className={`flex items-center p-3 rounded transition ${isActive("/dashboard")}`}
            >
              <FaHome className="mr-3" /> Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/products"
              className={`flex items-center p-3 rounded transition ${isActive("/products")}`}
            >
              <FaBoxOpen className="mr-3" /> Manage Products
            </Link>
          </li>
          <li>
            <Link
              to="/add-product"
              className={`flex items-center p-3 rounded transition ${isActive("/add-product")}`}
            >
              <FaPlus className="mr-3" /> Add Product
            </Link>
          </li>
          <li>
            <Link
              to="/orders"
              className={`flex items-center p-3 rounded transition ${isActive("/orders")}`}
            >
              <FaClipboardList className="mr-3" /> Orders
            </Link>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center w-full p-3 rounded bg-red-600 hover:bg-red-700 transition"
        >
          <FaSignOutAlt className="mr-3" /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
