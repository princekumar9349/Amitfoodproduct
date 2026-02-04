import { Link, useNavigate, useLocation } from "react-router-dom";
import authService from "../services/authService";
import {
  FaHome,
  FaBoxOpen,
  FaPlus,
  FaClipboardList,
  FaSignOutAlt,
  FaUtensils // Added for the logo icon
} from "react-icons/fa";

const Sidebar = () => {
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
    <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col shadow-2xl z-20">
      
      {/* --- LOGO SECTION --- */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-orange-500 to-red-600 p-2.5 rounded-xl shadow-lg shadow-orange-500/20 text-white">
                <FaUtensils size={18} />
            </div>
            <div>
                <h1 className="text-xl font-extrabold tracking-tight text-white leading-none">
                    Amit<span className="text-orange-500">Food</span>
                </h1>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Admin Panel</p>
            </div>
        </div>
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="flex-1 py-6 px-3">
        <p className="px-3 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Main Menu</p>
        <ul className="space-y-1">
          <li>
            <Link
              to="/dashboard"
              className={`flex items-center p-3 rounded-lg font-medium transition-all ${isActive("/dashboard")}`}
            >
              <FaHome className="mr-3 text-lg" /> Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/products"
              className={`flex items-center p-3 rounded-lg font-medium transition-all ${isActive("/products")}`}
            >
              <FaBoxOpen className="mr-3 text-lg" /> Manage Products
            </Link>
          </li>
          <li>
            <Link
              to="/add-product"
              className={`flex items-center p-3 rounded-lg font-medium transition-all ${isActive("/add-product")}`}
            >
              <FaPlus className="mr-3 text-lg" /> Add Product
            </Link>
          </li>
          <li>
            <Link
              to="/orders"
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
          <FaSignOutAlt className="mr-3 group-hover:rotate-180 transition-transform duration-300" /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;