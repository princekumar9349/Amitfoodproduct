import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { 
  Search, Filter, ChevronLeft, ChevronRight, 
  Edit3, Trash2, Plus, Package, AlertCircle, X, Save, Upload, ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ITEMS_PER_PAGE = 7; // Increased slightly for better view

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]); 
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sort, setSort] = useState("none");
  const [page, setPage] = useState(1);

  // Edit State
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // --- SMART DATA FETCHING ---
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get("/products");
      console.log("Product Data:", response.data); // Debugging

      let data = [];
      // Handle various backend response structures automatically
      if (Array.isArray(response.data)) {
        data = response.data;
      } else if (response.data && Array.isArray(response.data.products)) {
        data = response.data.products;
      } else if (response.data && Array.isArray(response.data.data)) {
        data = response.data.data;
      }

      setProducts(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/categories");
      const list = Array.isArray(data) ? data.map(c => typeof c === 'object' ? c.name : c) : [];
      setCategories(["All", ...list]);
    } catch {
      // Silent fail - fallback to "All"
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // --- FILTERING ---
  let filtered = [...products];

  if (search) {
    filtered = filtered.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  }
  if (categoryFilter !== "All") {
    filtered = filtered.filter((p) => p.category === categoryFilter);
  }
  if (sort === "low") filtered.sort((a, b) => a.price - b.price);
  if (sort === "high") filtered.sort((a, b) => b.price - a.price);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // --- HANDLERS ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
      toast.success("Product deleted");
    } catch {
      toast.error("Could not delete product");
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setImagePreview(product.image); // Set initial preview to existing image
    setImageFile(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(editingProduct).forEach(key => {
        if (key !== 'image' && key !== '_id' && key !== '__v') {
            formData.append(key, editingProduct[key]);
        }
      });
      if (imageFile) formData.append("image", imageFile);

      const { data } = await api.put(`/products/${editingProduct._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setProducts(products.map((p) => (p._id === editingProduct._id ? data : p)));
      setEditingProduct(null);
      toast.success("Product updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // --- RENDER ---
  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center flex-col gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        <p className="text-gray-500 font-medium">Loading inventory...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
          <p className="text-gray-500 text-sm mt-1">Manage {products.length} products</p>
        </div>
        <button 
            onClick={() => window.location.href='/add-product'} // Or use useNavigate
            className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg hover:bg-orange-600 transition-all hover:-translate-y-0.5"
        >
            <Plus size={20} /> Add Product
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Filter className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <select
              className="w-full pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl appearance-none cursor-pointer hover:bg-gray-50 focus:outline-none"
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            >
              {categories.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
            </select>
          </div>

          <select
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 focus:outline-none"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="none">Sort By</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Stock Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length > 0 ? (
                paginated.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.unit}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      ₹{product.price}
                    </td>
                    <td className="px-6 py-4">
                      {product.stock <= 5 ? (
                        <div className="flex items-center gap-1.5 text-red-600 bg-red-50 px-3 py-1 rounded-full w-fit">
                          <AlertCircle size={14} />
                          <span className="text-xs font-bold">Low ({product.stock})</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-3 py-1 rounded-full w-fit">
                          <Package size={14} />
                          <span className="text-xs font-bold">{product.stock} in stock</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEditClick(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit3 size={18} />
                        </button>
                        <button onClick={() => handleDelete(product._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                    No products found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between bg-gray-50/30">
            <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- EDIT MODAL --- */}
      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setEditingProduct(null)}
            />
            <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="text-lg font-bold text-gray-900">Edit Product</h3>
                <button onClick={() => setEditingProduct(null)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Image Upload */}
                <div className="space-y-4">
                    <div className="aspect-square rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden group">
                        {imagePreview ? (
                            <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                        ) : (
                            <div className="text-center text-gray-400">
                                <ImageIcon size={48} className="mx-auto mb-2 opacity-50" />
                                <span className="text-sm">No Image</span>
                            </div>
                        )}
                        <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white font-medium gap-2">
                            <Upload size={20} /> Change Image
                            <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                        </label>
                    </div>
                </div>

                {/* Right: Form Fields */}
                <form id="edit-form" onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Product Name</label>
                        <input className="w-full p-2 border-b border-gray-200 focus:border-orange-500 outline-none font-medium bg-transparent transition-colors" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} required />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Price (₹)</label>
                            <input type="number" className="w-full p-2 border-b border-gray-200 focus:border-orange-500 outline-none font-medium bg-transparent" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: e.target.value})} required />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Stock</label>
                            <input type="number" className="w-full p-2 border-b border-gray-200 focus:border-orange-500 outline-none font-medium bg-transparent" value={editingProduct.stock} onChange={e => setEditingProduct({...editingProduct, stock: e.target.value})} required />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                        <select className="w-full p-2 border-b border-gray-200 focus:border-orange-500 outline-none font-medium bg-transparent" value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}>
                            {categories.filter(c => c !== "All").map((c, i) => <option key={i} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                        <textarea rows="3" className="w-full p-2 border-b border-gray-200 focus:border-orange-500 outline-none text-sm bg-transparent resize-none" value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} />
                    </div>
                </form>
              </div>

              <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
                <button onClick={() => setEditingProduct(null)} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
                <button type="submit" form="edit-form" className="px-6 py-2 bg-orange-600 text-white font-bold rounded-lg shadow-md hover:bg-orange-700 flex items-center gap-2 transition-transform hover:-translate-y-0.5">
                    <Save size={18} /> Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageProducts;