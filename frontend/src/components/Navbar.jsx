import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X, User, LogOut, ChevronDown, Package, Home, UtensilsCrossed } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    setIsMenuOpen(false);
    navigate("/login");
  };

  const navLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "Menu", path: "/", icon: UtensilsCrossed },
    { name: "My Orders", path: "/my-orders", icon: Package },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
          isScrolled
            ? "bg-white/90 backdrop-blur-xl shadow-md py-3" // Scrolled State (White)
            : "bg-transparent py-6" // Top State (Transparent)
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            
            {/* --- 1. LOGO (COLOR FIX HERE) --- */}
            <Link to="/" className="flex items-center gap-3 group relative z-50">
              <div className="bg-gradient-to-br from-orange-600 to-red-600 text-white p-2.5 rounded-2xl shadow-lg shadow-orange-500/20 group-hover:rotate-12 transition-transform duration-300">
                <UtensilsCrossed size={24} strokeWidth={2.5} />
              </div>
              <span className={`text-2xl font-black tracking-tight transition-colors duration-300 ${
                  isScrolled ? "text-gray-900" : "text-white" // "Amit" becomes White on top
              }`}>
                Amit
                <span className={isScrolled ? "text-orange-600" : "text-orange-200"}> 
                  {/* "Food" becomes Light Orange/White on top so it doesn't blend */}
                  Food
                </span>
              </span>
            </Link>

            {/* --- 2. DESKTOP NAVIGATION (THE CAPSULE) --- */}
            <div className={`hidden md:flex items-center p-1.5 rounded-full shadow-inner transition-colors duration-300 ${
                isScrolled 
                ? "bg-orange-50/80 border border-orange-100" 
                : "bg-black/20 border border-white/10 backdrop-blur-md" // Darker semi-transparent capsule on hero
            }`}>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 z-10 ${
                    isActive(link.path)
                      ? isScrolled ? "text-orange-700" : "text-orange-900" // Active Text Color
                      : isScrolled ? "text-gray-500 hover:text-gray-900" : "text-orange-100 hover:text-white" // Inactive Text Color
                  }`}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-white rounded-full shadow-md -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* --- 3. RIGHT ACTIONS --- */}
            <div className="hidden md:flex items-center gap-5 relative z-50">
              
              {/* Cart Button */}
              <Link
                to="/cart"
                className={`relative p-3 border rounded-full transition-all group ${
                    isScrolled 
                    ? "bg-white border-gray-100 text-gray-600 hover:text-orange-600 hover:border-orange-200" 
                    : "bg-white/10 border-white/20 text-white hover:bg-white hover:text-orange-600" // White icon on hero
                }`}
              >
                <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              {/* Profile / Auth */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className={`flex items-center gap-3 pl-2 pr-4 py-1.5 border rounded-full hover:shadow-md transition-all group ${
                        isScrolled
                        ? "bg-white border-gray-100"
                        : "bg-white/10 border-white/20 backdrop-blur-md"
                    }`}
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-orange-100 to-orange-200 text-orange-700 rounded-full flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className={`text-sm font-bold max-w-[100px] truncate transition-colors ${
                        isScrolled ? "text-gray-700 group-hover:text-orange-700" : "text-white"
                    }`}>
                        {user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown size={14} className={`transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""} ${isScrolled ? "text-gray-400" : "text-white/80"}`} />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-4 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden p-2 origin-top-right"
                      >
                        <div className="px-4 py-3 bg-gray-50 rounded-xl mb-2 border border-gray-50">
                          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Signed in as</p>
                          <p className="text-sm font-bold text-gray-900 truncate">{user?.email}</p>
                        </div>
                        
                        <Link to="/my-orders" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-700 rounded-xl transition-colors">
                          <Package size={18} /> My Orders
                        </Link>
                        
                        <div className="h-px bg-gray-100 my-1 mx-2"></div>
                        
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                          <LogOut size={18} /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login" className={`font-bold text-sm px-4 transition-colors ${isScrolled ? "text-gray-600 hover:text-orange-600" : "text-white hover:text-orange-100"}`}>Log in</Link>
                  <Link to="/register" className="bg-white text-orange-600 px-6 py-2.5 rounded-full font-bold text-sm shadow-xl hover:bg-gray-100 transition-all transform hover:-translate-y-0.5 active:scale-95">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* --- MOBILE TOGGLE --- */}
            <div className="flex items-center gap-4 md:hidden relative z-50">
               <Link to="/cart" className={`relative ${isScrolled ? "text-gray-700" : "text-white"}`}>
                  <ShoppingCart size={24} />
                  {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border-2 border-white">
                          {cartCount}
                      </span>
                  )}
               </Link>
               <button onClick={() => setIsMenuOpen(true)} className={`p-2 rounded-full transition-colors ${isScrolled ? "bg-gray-100 text-gray-900" : "bg-white/20 text-white backdrop-blur-md"}`}>
                  <Menu size={24} />
               </button>
            </div>

          </div>
        </div>
      </nav>

      {/* --- MOBILE DRAWER (NO CHANGE HERE) --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl z-[70] md:hidden flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <span className="text-xl font-black text-gray-900">Menu</span>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-white border border-gray-200 rounded-full hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-lg font-bold transition-all ${
                        isActive(link.path) 
                        ? "bg-orange-50 text-orange-600 border border-orange-100 shadow-sm" 
                        : "text-gray-600 hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    <link.icon size={22} className={isActive(link.path) ? "fill-orange-600/20" : ""} />
                    {link.name}
                  </Link>
                ))}
              </div>
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                {isAuthenticated ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-gray-200 shadow-sm">
                       <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 text-orange-700 rounded-full flex items-center justify-center font-bold">
                          {user?.name?.charAt(0).toUpperCase()}
                       </div>
                       <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 truncate">{user?.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                       </div>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-3.5 rounded-2xl font-bold hover:bg-red-100 transition-colors"
                    >
                        <LogOut size={18} /> Logout
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="py-3.5 text-center rounded-2xl font-bold border border-gray-200 text-gray-700 bg-white hover:bg-gray-50">
                        Log in
                    </Link>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)} className="py-3.5 text-center rounded-2xl font-bold bg-gray-900 text-white shadow-lg hover:bg-gray-800">
                        Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;