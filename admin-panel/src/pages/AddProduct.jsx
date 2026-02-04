import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { 
  Package, IndianRupee, Layers, FileText, 
  Image as ImageIcon, Upload, Loader2, CheckCircle, 
  Type, Scale, ArrowLeft
} from "lucide-react";

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    stock: "",
    unit: "",
  });
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (
      !formData.name ||
      !formData.price ||
      !formData.category ||
      !image ||
      !formData.stock ||
      !formData.unit
    ) {
      setLoading(false);
      return toast.error("Please fill all required fields");
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("description", formData.description);
    data.append("image", image);
    data.append("stock", formData.stock);
    data.append("unit", formData.unit);

    try {
      await api.post("/products", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Product successfully added to inventory!");
      navigate("/products");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add product");
    } finally {
        setLoading(false);
    }
  };

  return (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
    >
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8">
        <button 
            onClick={() => navigate(-1)} 
            className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors"
        >
            <ArrowLeft size={20} />
        </button>
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
            <p className="text-gray-500 mt-1">Create a new item in your inventory.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT COLUMN: DETAILS --- */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* General Info Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Package className="text-orange-500" size={20} /> General Information
                </h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Product Name</label>
                        <div className="relative">
                            <Type className="absolute left-3 top-3.5 text-gray-400" size={18} />
                            <input
                                type="text"
                                name="name"
                                onChange={handleChange}
                                placeholder="e.g. Organic Basmati Rice"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                            <div className="relative">
                                <Layers className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="category"
                                    onChange={handleChange}
                                    placeholder="e.g. Grains"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="description"
                                    onChange={handleChange}
                                    placeholder="Short description..."
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pricing & Stock Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <IndianRupee className="text-green-600" size={20} /> Pricing & Inventory
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Price (₹)</label>
                        <div className="relative">
                            <div className="absolute left-3 top-3.5 text-gray-500 font-bold">₹</div>
                            <input
                                type="number"
                                name="price"
                                onChange={handleChange}
                                placeholder="0.00"
                                className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Stock Quantity</label>
                        <div className="relative">
                            <Package className="absolute left-3 top-3.5 text-gray-400" size={18} />
                            <input
                                type="number"
                                name="stock"
                                onChange={handleChange}
                                placeholder="0"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Unit</label>
                        <div className="relative">
                            <Scale className="absolute left-3 top-3.5 text-gray-400" size={18} />
                            <input
                                type="text"
                                name="unit"
                                onChange={handleChange}
                                placeholder="e.g. kg, pc"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                                required
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- RIGHT COLUMN: IMAGE & ACTIONS --- */}
        <div className="space-y-6">
            
            {/* Image Upload Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <ImageIcon className="text-blue-500" size={20} /> Product Image
                </h3>

                <div className="relative group">
                    <div className={`border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center min-h-[250px] transition-all ${imagePreview ? 'border-orange-500 bg-orange-50' : 'border-gray-300 hover:border-orange-400 hover:bg-gray-50'}`}>
                        
                        {imagePreview ? (
                            <div className="relative w-full h-full">
                                <img 
                                    src={imagePreview} 
                                    alt="Preview" 
                                    className="w-full h-48 object-contain rounded-lg shadow-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => { setImage(null); setImagePreview(null); }}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition-colors"
                                >
                                    <ArrowLeft size={16} className="rotate-45" /> {/* Using rotate arrow as X */}
                                </button>
                                <p className="text-xs text-center text-green-600 font-bold mt-2 flex items-center justify-center gap-1">
                                    <CheckCircle size={12} /> Image Selected
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="bg-blue-50 p-4 rounded-full mb-3 group-hover:scale-110 transition-transform">
                                    <Upload className="text-blue-500" size={24} />
                                </div>
                                <p className="text-sm font-semibold text-gray-700">Click to upload image</p>
                                <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF</p>
                            </>
                        )}

                        <input
                            type="file"
                            onChange={handleImageChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept="image/*"
                            required={!image}
                        />
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gray-900 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-orange-600 hover:shadow-orange-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <Package size={20} />}
                    {loading ? 'Publishing...' : 'Publish Product'}
                </button>
                <p className="text-xs text-center text-gray-400 mt-4">
                    Double-check details before publishing.
                </p>
            </div>

        </div>

      </form>
    </motion.div>
  );
};

export default AddProduct;