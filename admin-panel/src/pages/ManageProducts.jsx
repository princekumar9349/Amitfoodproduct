import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import getImageUrl from "../utils/imageHelper";
import {
  Search,
  Filter,
  SlidersHorizontal,
  Trash2,
  Edit2,
  X,
  Save,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  Package,
} from "lucide-react";

const ITEMS_PER_PAGE = 7; // Increased slightly for better screen fit

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sort, setSort] = useState("none");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [editingProduct, setEditingProduct] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const fetchProducts = async () => {
    try {
      // Fetching with high limit to support existing client-side filtering/pagination logic
      const { data } = await api.get("/products?limit=1000");
      // Handle both array (legacy) and object (paginated) responses
      const productList = Array.isArray(data) ? data : data.products || [];
      setProducts(productList);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ---------------- FILTER LOGIC ---------------- */
  let filtered = [...products];

  if (search) {
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()),
    );
  }

  if (categoryFilter !== "All") {
    filtered = filtered.filter((p) => p.category === categoryFilter);
  }

  if (sort === "low") filtered.sort((a, b) => a.price - b.price);
  if (sort === "high") filtered.sort((a, b) => b.price - a.price);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  /* ---------------- HANDLERS ---------------- */
  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this product?",
      )
    )
      return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
      toast.success("Product deleted successfully");
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setPreviewUrl(product.image); // Set initial preview to existing image
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      Object.keys(editingProduct).forEach((key) => {
        if (key !== "_id" && key !== "__v")
          formData.append(key, editingProduct[key]);
      });

      if (imageFile) formData.append("image", imageFile);

      const { data } = await api.put(
        `/products/${editingProduct._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      setProducts(
        products.map((p) => (p._id === editingProduct._id ? data : p)),
      );
      setEditingProduct(null);
      setImageFile(null);
      toast.success("Product updated successfully");
    } catch {
      toast.error("Update failed");
    }
  };

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  return (
    <div className="p-6 bg-gray-50/50 min-h-screen max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            Inventory
          </h2>
          <p className="text-gray-500 mt-1">
            Manage your product catalog, prices, and stock.
          </p>
        </div>
        <div className="text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
          Total Products:{" "}
          <span className="text-gray-900 font-bold ml-1">
            {products.length}
          </span>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {/* Category Filter */}
          <div className="relative min-w-[140px]">
            <Filter
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={16}
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:border-blue-500 outline-none appearance-none cursor-pointer hover:bg-gray-50 transition-colors"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Filter */}
          <div className="relative min-w-[160px]">
            <SlidersHorizontal
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={16}
            />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:border-blue-500 outline-none appearance-none cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <option value="none">Default Sort</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 border-b border-gray-200">
              <tr>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Stock Status
                </th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    Loading inventory...
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                paginated.map((product) => (
                  <tr
                    key={product._id}
                    className="group hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg border border-gray-200 bg-white p-1 shrink-0">
                          <img
                            src={getImageUrl(product.image)}
                            alt={product.name}
                            className="h-full w-full object-cover rounded-md"
                            onError={(e) =>
                              (e.target.src =
                                "https://placehold.co/100?text=No+Img")
                            }
                          />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-xs text-gray-400 truncate max-w-[200px]">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        {product.category}
                      </span>
                    </td>

                    <td className="p-4 font-semibold text-gray-900">
                      ₹{product.price}{" "}
                      <span className="text-gray-400 text-xs font-normal">
                        / {product.unit}
                      </span>
                    </td>

                    <td className="p-4">
                      {product.stock <= 5 ? (
                        <div className="flex items-center gap-2 text-red-600 bg-red-50 w-fit px-3 py-1 rounded-full border border-red-100">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                          <span className="text-xs font-bold">
                            Low: {product.stock}
                          </span>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-600 font-medium flex items-center gap-2">
                          <Package size={16} className="text-gray-400" />
                          {product.stock} in stock
                        </div>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditClick(product)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
          <span className="text-xs text-gray-500">
            Page {page} of {totalPages || 1}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">
                  Edit Product
                </h3>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column: Image */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Product Image
                  </label>
                  <div className="relative group cursor-pointer border-2 border-dashed border-gray-300 rounded-xl overflow-hidden h-64 hover:border-blue-500 hover:bg-blue-50/10 transition-all">
                    <img
                      src={
                        previewUrl
                          ? typeof previewUrl === "string" &&
                            previewUrl.startsWith("blob:")
                            ? previewUrl
                            : getImageUrl(previewUrl)
                          : "https://placehold.co/300?text=Upload+Image"
                      }
                      alt="Preview"
                      className="w-full h-full object-contain p-2"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity text-white">
                      <ImageIcon size={32} className="mb-2" />
                      <span className="text-sm font-medium">Change Image</span>
                    </div>
                    <input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                  </div>
                </div>

                {/* Right Column: Details */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">
                      Name
                    </label>
                    <input
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                      value={editingProduct.name}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">
                        Price (₹)
                      </label>
                      <input
                        type="number"
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 outline-none"
                        value={editingProduct.price}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            price: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">
                        Stock
                      </label>
                      <input
                        type="number"
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 outline-none"
                        value={editingProduct.stock}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            stock: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">
                        Category
                      </label>
                      <input
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 outline-none"
                        value={editingProduct.category}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            category: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">
                        Unit
                      </label>
                      <input
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 outline-none"
                        value={editingProduct.unit}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            unit: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">
                      Description
                    </label>
                    <textarea
                      rows="3"
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 outline-none resize-none"
                      value={editingProduct.description}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                <button
                  onClick={() => setEditingProduct(null)}
                  className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-5 py-2.5 rounded-lg bg-gray-900 text-white font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
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
