import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, Truck, ShieldCheck, Leaf, Smartphone, 
  Search, Star, Quote, ChevronDown, ChevronUp, RefreshCw, X, ArrowUp 
} from "lucide-react";
import productService from "../services/productService";
import ProductCard from "../components/ProductCard";
import { ProductCardSkeleton } from "../components/Skeleton";
import toast from "react-hot-toast";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]); 
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // --- 1. DATA FETCHING ---
  useEffect(() => {
    const fetchData = async (isBackground = false) => {
      try {
        if (isBackground) setIsRefreshing(true);

        const [productsData, categoriesData] = await Promise.all([
            productService.getProducts(),
            productService.getCategories()
        ]);

        const productsArray = Array.isArray(productsData) ? productsData : productsData.products || [];
        setProducts(productsArray);
        
        const categoryList = Array.isArray(categoriesData) 
            ? ["All", ...categoriesData.map(c => (typeof c === 'object' ? c.name : c))]
            : ["All"];
            
        setCategories(categoryList);

      } catch (error) {
        if (!isBackground) toast.error("Failed to load data");
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
        if (isBackground) setTimeout(() => setIsRefreshing(false), 1000);
      }
    };

    fetchData();
    const intervalId = setInterval(() => fetchData(true), 30000);
    
    // Scroll Listener
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);

    return () => {
        clearInterval(intervalId);
        window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // --- 2. HANDLERS ---
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 0 && activeTab !== "All") setActiveTab("All");
    if (query.length === 1) document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // --- 3. FILTERING LOGIC ---
  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (activeTab !== "All") {
      filtered = filtered.filter(product => {
        const prodCat = product.category 
            ? (typeof product.category === 'object' ? product.category.name : product.category) 
            : "";
        const normProdCat = String(prodCat).toLowerCase();
        const normTab = activeTab.toLowerCase();
        return normProdCat === normTab || product.name?.toLowerCase().includes(normTab);
      });
    }

    if (searchQuery.trim()) {
       const lowerQuery = searchQuery.toLowerCase();
       filtered = filtered.filter(product => 
         product.name?.toLowerCase().includes(lowerQuery) ||
         product.description?.toLowerCase().includes(lowerQuery)
       );
    }
    return filtered;
  }, [products, searchQuery, activeTab]);

  // --- ANIMATION VARIANTS ---
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      
      {/* ================= HERO SECTION ================= */}
      <section className="relative bg-gradient-to-br from-orange-600 via-orange-500 to-red-600 text-white overflow-hidden pb-32 pt-36">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <motion.div 
             animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} 
             transition={{ duration: 6, repeat: Infinity }}
             className="absolute top-20 left-[10%] text-6xl opacity-20"
           >🍔</motion.div>
           <motion.div 
             animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }} 
             transition={{ duration: 8, repeat: Infinity }}
             className="absolute bottom-40 right-[15%] text-6xl opacity-20"
           >🍕</motion.div>
           <div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-400 rounded-full blur-[120px] opacity-20"></div>
           <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-300 rounded-full blur-[100px] opacity-20"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 mb-8 shadow-xl"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-sm font-semibold text-orange-50 tracking-wide uppercase">#1 Food Delivery App</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight"
          >
            Taste the <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400">Authentic</span> <br/>
            Flavors of India
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl mb-12 text-orange-100 max-w-2xl font-medium"
          >
            Premium snacks, sweets, and meals prepared by expert chefs.
          </motion.p>

          {/* Search Bar */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.4 }}
             className="w-full max-w-xl relative group"
          >
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
            </div>
            <input
                type="text"
                placeholder="Search for 'Laddoo', 'Paneer'..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="block w-full pl-14 pr-14 py-5 rounded-full border-2 border-transparent bg-white text-gray-900 shadow-2xl focus:border-orange-300 focus:ring-4 focus:ring-orange-500/20 text-lg transition-all outline-none placeholder-gray-400 font-medium"
            />
            <div className="absolute inset-y-0 right-2 flex items-center">
                {searchQuery ? (
                    <button onClick={() => { setSearchQuery(""); setActiveTab("All"); }} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
                        <X size={20} />
                    </button>
                ) : (
                    <button className="bg-orange-600 hover:bg-orange-700 text-white rounded-full p-3 shadow-lg transition-transform transform hover:scale-105">
                        <ArrowRight size={24} />
                    </button>
                )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="relative z-20 -mt-20 mx-4 max-w-6xl md:mx-auto">
        <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          {[
            { icon: Leaf, title: "100% Organic", text: "Direct from local farmers", color: "text-green-600", bg: "bg-green-50" },
            { icon: Truck, title: "30 Min Delivery", text: "Free shipping > ₹500", color: "text-orange-600", bg: "bg-orange-50" },
            { icon: ShieldCheck, title: "Hygiene Rated", text: "FSSAI Certified Kitchens", color: "text-blue-600", bg: "bg-blue-50" }
          ].map((feature, i) => (
            <motion.div 
                key={i} 
                whileHover={{ y: -5 }}
                className="flex flex-col items-center text-center pt-8 md:pt-0 first:pt-0"
            >
               <div className={`w-16 h-16 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center mb-4 shadow-sm`}>
                 <feature.icon size={32} strokeWidth={2} />
               </div>
               <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
               <p className="text-sm text-gray-500 mt-2 font-medium">{feature.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= MENU SECTION ================= */}
      <section id="menu" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[800px]">
        
        {/* Header & Auto Refresh */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
          <div>
            <span className="text-orange-600 font-bold tracking-widest uppercase text-xs">Our Menu</span>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">
                  {searchQuery ? `Results for "${searchQuery}"` : "Explore Categories"}
              </h2>
              <AnimatePresence>
                {isRefreshing && (
                  <motion.div 
                    initial={{ opacity: 0, rotate: 0 }}
                    animate={{ opacity: 1, rotate: 180 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="mt-2 text-orange-500 bg-orange-50 p-2 rounded-full"
                  >
                    <RefreshCw size={18} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* --- STICKY CATEGORY NAV --- */}
        <div className="sticky top-20 z-30 bg-gray-50/95 backdrop-blur-md py-4 -mx-4 px-4 mb-8 border-b border-gray-200/50">
            <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar max-w-7xl mx-auto">
                {categories.map((cat) => (
                <button
                    key={cat}
                    onClick={() => { setActiveTab(cat); setSearchQuery(""); }}
                    className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap border-2 ${
                    activeTab === cat 
                        ? "bg-gray-900 text-white border-gray-900 shadow-lg scale-105" 
                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                >
                    {cat}
                </button>
                ))}
            </div>
        </div>

        {/* --- PRODUCTS GRID --- */}
        <div className="min-h-[400px]">
            <AnimatePresence mode='wait'>
                {loading && !isRefreshing ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <motion.div 
                        key={activeTab + searchQuery}
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
                    >
                        {filteredProducts.map((product) => (
                            <motion.div 
                                key={product._id} 
                                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }} 
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-20 text-center"
                    >
                        <div className="bg-orange-50 p-8 rounded-full mb-6 shadow-inner">
                            <Search className="h-16 w-16 text-orange-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No items found</h3>
                        <p className="text-gray-500 max-w-sm mb-8">
                            We couldn't find anything matching "{searchQuery}". Try a different category or search term.
                        </p>
                        <button 
                            onClick={() => { setSearchQuery(""); setActiveTab("All"); }}
                            className="bg-white border-2 border-gray-200 text-gray-900 px-8 py-3 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-all"
                        >
                            Reset Filters
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="bg-gradient-to-b from-orange-50 to-white py-24">
         <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
                <span className="text-orange-600 font-bold tracking-widest uppercase text-xs">Testimonials</span>
                <h2 className="text-4xl font-extrabold text-gray-900 mt-2">What Our Customers Say</h2>
                <div className="w-24 h-1.5 bg-orange-500 mx-auto mt-6 rounded-full opacity-80"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { name: "Rahul Sharma", role: "Food Blogger", text: "The most authentic taste I've found online. The delivery was super quick." },
                    { name: "Priya Patel", role: "Regular Customer", text: "I order snacks for my office every week. AmitFood never disappoints." },
                    { name: "Vikram Singh", role: "Chef", text: "Their organic range is genuinely high quality. Highly recommended!" }
                ].map((testimonial, i) => (
                    <motion.div 
                        whileHover={{ y: -10 }}
                        key={i} 
                        className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative group hover:shadow-xl transition-all duration-300"
                    >
                        <div className="absolute -top-4 right-8 bg-orange-500 text-white p-2 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                            <Quote size={20} fill="currentColor" />
                        </div>
                        <div className="flex text-yellow-400 mb-6">
                            {[...Array(5)].map((_, j) => <Star key={j} size={18} fill="currentColor" />)}
                        </div>
                        <p className="text-gray-600 mb-8 leading-relaxed italic text-lg">"{testimonial.text}"</p>
                        <div className="flex items-center gap-4 border-t border-gray-100 pt-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold text-xl shadow-inner">
                                {testimonial.name[0]}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-base">{testimonial.name}</h4>
                                <p className="text-xs text-orange-600 font-bold uppercase tracking-wide">{testimonial.role}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* ================= FAQ & APP DOWNLOAD ================= */}
      <section className="py-24 max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-start">
        <div>
            <span className="text-orange-600 font-bold tracking-widest uppercase text-xs">Support</span>
            <h2 className="text-3xl font-extrabold mb-8 mt-2">Frequently Asked Questions</h2>
            <div className="space-y-4">
                {[
                    { question: "Do you deliver to my location?", answer: "We currently deliver across the city limits. Check your pincode at checkout!" },
                    { question: "Are the ingredients fresh?", answer: "Yes! We source 100% organic ingredients directly from local farmers daily." },
                    { question: "What is the refund policy?", answer: "If you are not satisfied with the quality, we offer a no-questions-asked refund within 24 hours." },
                ].map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
                        <button 
                            onClick={() => setOpenFaq(openFaq === index ? null : index)}
                            className="w-full flex justify-between items-center p-5 text-left font-bold text-gray-800 hover:bg-gray-50 transition-colors"
                        >
                            {item.question}
                            {openFaq === index ? <ChevronUp size={20} className="text-orange-600" /> : <ChevronDown size={20} className="text-gray-400" />}
                        </button>
                        <AnimatePresence>
                            {openFaq === index && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }} 
                                    animate={{ height: "auto", opacity: 1 }} 
                                    exit={{ height: 0, opacity: 0 }} 
                                    className="overflow-hidden"
                                >
                                    <div className="p-5 pt-0 text-gray-600 leading-relaxed border-t border-gray-100">
                                        {item.answer}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </div>

        {/* Promo Card */}
        <div className="bg-gray-900 rounded-[2.5rem] p-10 md:p-14 text-white relative overflow-hidden text-center md:text-left shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600 rounded-full blur-[80px] -mr-20 -mt-20 opacity-40"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600 rounded-full blur-[80px] -ml-20 -mb-20 opacity-30"></div>
            
            <div className="relative z-10">
                <span className="bg-orange-500/20 text-orange-300 text-xs font-bold px-3 py-1 rounded-full border border-orange-500/30 mb-6 inline-block">LIMITED OFFER</span>
                <h2 className="text-4xl font-black mb-4 leading-tight">Get 20% Off <br/>Your First Order!</h2>
                <p className="text-gray-400 mb-8 text-lg">Use code <span className="text-white font-mono bg-white/10 px-2 py-1 rounded border border-white/20">AMITNEW</span> at checkout.</p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                    <button className="flex items-center justify-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors font-bold shadow-lg transform hover:-translate-y-1">
                        <Smartphone size={22} /> App Store
                    </button>
                    <button className="flex items-center justify-center gap-3 bg-transparent border-2 border-gray-700 text-white px-8 py-4 rounded-xl hover:bg-gray-800 hover:border-gray-600 transition-all font-bold">
                        Google Play
                    </button>
                </div>
            </div>
        </div>
      </section>

      {/* --- FLOATING BUTTONS --- */}
      
      {/* 1. WhatsApp Button (Bottom Left) */}
      <a
        href="https://wa.me/918789732094?text=Hello%20AmitFood%2C%20I%20would%20like%20to%20know%20more%20about%20your%20products."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 left-8 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-all hover:scale-110 z-50 flex items-center justify-center group border-4 border-white"
        title="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>

      {/* 2. Scroll to Top (Bottom Right) */}
      <AnimatePresence>
        {showScrollTop && (
            <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                onClick={scrollToTop}
                className="fixed bottom-8 right-8 bg-gray-900 text-white p-4 rounded-full shadow-2xl hover:bg-orange-600 transition-colors z-50 border-4 border-white"
            >
                <ArrowUp size={24} />
            </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Home;