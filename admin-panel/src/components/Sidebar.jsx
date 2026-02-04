import { Link, useNavigate, useLocation } from "react-router-dom";
import authService from "../services/authService";
import {
  FaHome,
  FaBoxOpen,
  FaPlus,
  FaClipboardList,
  FaSignOutAlt,
  FaUtensils, // Added for the logo icon
} from "react-icons/fa";

import { FaTimes } from "react-icons/fa"; // Add FaTimes for close button

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path
      ? "bg-gray-800 text-orange-500 border-r-4 border-orange-500"
      : "text-gray-400 hover:bg-gray-800 hover:text-white transition-all";
  };

  return (
    <>
      <div
        className={`
        fixed inset-y-0 left-0 z-20 w-64 bg-gray-900 text-white shadow-2xl transform transition-transform duration-300 ease-in-out
        md:translate-x-0 md:static md:block
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* --- LOGO SECTION --- */}
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-orange-500 to-red-600 p-2.5 rounded-xl shadow-lg shadow-orange-500/20 text-white">
              <FaUtensils size={18} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-white leading-none">
                Amit<span className="text-orange-500">Food</span>
              </h1>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                Admin Panel
              </p>
            </div>
          </div>
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="md:hidden text-gray-400 hover:text-white p-1"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* --- NAVIGATION --- */}
        <nav className="flex-1 py-6 px-3">
          <p className="px-3 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Main Menu
          </p>
          <ul className="space-y-1">
            <li>
              <Link
                to="/dashboard"
                onClick={() => window.innerWidth < 768 && onClose()}
                className={`flex items-center p-3 rounded-lg font-medium transition-all ${isActive("/dashboard")}`}
              >
                <FaHome className="mr-3 text-lg" /> Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                onClick={() => window.innerWidth < 768 && onClose()}
                className={`flex items-center p-3 rounded-lg font-medium transition-all ${isActive("/products")}`}
              >
                <FaBoxOpen className="mr-3 text-lg" /> Manage Products
              </Link>
            </li>
            <li>
              <Link
                to="/add-product"
                onClick={() => window.innerWidth < 768 && onClose()}
                className={`flex items-center p-3 rounded-lg font-medium transition-all ${isActive("/add-product")}`}
              >
                <FaPlus className="mr-3 text-lg" /> Add Product
              </Link>
            </li>
            <li>
              <Link
                to="/orders"
                onClick={() => window.innerWidth < 768 && onClose()}
                className={`flex items-center p-3 rounded-lg font-medium transition-all ${isActive("/orders")}`}
              >
                <FaClipboardList className="mr-3 text-lg" /> Orders
              </Link>
            </li>
          </ul>
        </nav>

        {/* --- LOGOUT --- */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-3 rounded-lg bg-gray-800 text-red-400 hover:bg-red-600 hover:text-white transition-all duration-300 font-bold group"
          >
            <FaSignOutAlt className="mr-3 group-hover:rotate-180 transition-transform duration-300" />{" "}
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
