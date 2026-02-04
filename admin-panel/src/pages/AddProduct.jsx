import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; // Ensure this path is correct
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  Package,
  IndianRupee,
  Layers,
  FileText,
  Image as ImageIcon,
  Upload,
  Loader2,
  X,
  Type,
  Scale,
  ArrowLeft,
  Save,
} from "lucide-react";

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

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

    // Strict Validation
    if (!formData.name?.trim()) {
      setLoading(false);
      return toast.error("Product name is required");
    }
    if (
      !formData.price ||
      isNaN(formData.price) ||
      Number(formData.price) <= 0
    ) {
      setLoading(false);
      return toast.error("Please enter a valid price");
    }
    if (!formData.category?.trim()) {
      setLoading(false);
      return toast.error("Category is required");
    }
    if (
      !formData.stock ||
      isNaN(formData.stock) ||
      Number(formData.stock) < 0
    ) {
      setLoading(false);
      return toast.error("Please enter a valid stock quantity");
    }
    if (!formData.unit?.trim()) {
      setLoading(false);
      return toast.error("Unit type (e.g., kg, pc) is required");
    }
    if (!image) {
      setLoading(false);
      return toast.error("Product image is required");
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    data.append("image", image);

    try {
      const response = await api.post("/products", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Product added:", response.data);
      toast.success("Product successfully added!");
      navigate("/products");
    } catch (error) {
      console.error("Add Product Error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to add product. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-all shadow-sm hover:shadow-md"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                Add New Product
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Fill in the details to create a new inventory item.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* --- LEFT COLUMN: INPUTS (8 Columns) --- */}
          <div className="lg:col-span-8 space-y-6">
            {/* General Info Section */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-gray-100 border border-gray-100">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Package size={20} />
                </div>
                <h3 className="text-lg font-bold text-gray-800">
                  Product Details
                </h3>
              </div>

              <div className="space-y-6">
                <InputField
                  label="Product Name"
                  name="name"
                  icon={Type}
                  placeholder="e.g. Organic Basmati Rice"
                  value={formData.name}
                  onChange={handleChange}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Category"
                    name="category"
                    icon={Layers}
                    placeholder="e.g. Grains"
                    value={formData.category}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Unit Type"
                    name="unit"
                    icon={Scale}
                    placeholder="e.g. kg, pc, box"
                    value={formData.unit}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <div className="relative">
                    <FileText
                      className="absolute left-4 top-3.5 text-gray-400"
                      size={18}
                    />
                    <textarea
                      name="description"
                      rows="4"
                      onChange={handleChange}
                      placeholder="Describe the product features, benefits, and specifications..."
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-gray-100 border border-gray-100">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                  <IndianRupee size={20} />
                </div>
                <h3 className="text-lg font-bold text-gray-800">
                  Pricing & Inventory
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Base Price (₹)"
                  name="price"
                  type="number"
                  icon={IndianRupee}
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleChange}
                />
                <InputField
                  label="Stock Quantity"
                  name="stock"
                  type="number"
                  icon={Package}
                  placeholder="0"
                  value={formData.stock}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: MEDIA & ACTIONS (4 Columns) --- */}
          <div className="lg:col-span-4 space-y-6">
            {/* Image Upload */}
            <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-100 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Product Image
              </h3>

              <div
                className={`relative border-2 border-dashed rounded-2xl p-4 transition-all duration-300 ${
                  imagePreview
                    ? "border-blue-500 bg-blue-50/10"
                    : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                }`}
              >
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  accept="image/*"
                  disabled={!!imagePreview}
                />

                {imagePreview ? (
                  <div className="relative z-10">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-xl shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded-full text-red-500 hover:bg-red-50 hover:text-red-600 transition-all shadow-md z-30"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="bg-blue-50 p-4 rounded-full mb-3 text-blue-500">
                      <ImageIcon size={28} />
                    </div>
                    <p className="font-medium text-gray-900">Click to upload</p>
                    <p className="text-xs text-gray-400 mt-1">
                      SVG, PNG, JPG or GIF (max 5MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Publish Action */}
            <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600 font-medium">Status</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-bold uppercase tracking-wider">
                  Draft
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-gray-900/10 hover:shadow-gray-900/20 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Save
                    size={20}
                    className="group-hover:scale-110 transition-transform"
                  />
                )}
                {loading ? "Publishing..." : "Publish Product"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

// Reusable Helper Component for cleaner code
const InputField = ({ label, icon: Icon, type = "text", ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <div className="relative group">
      <Icon
        className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors"
        size={18}
      />
      <input
        type={type}
        {...props}
        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-medium text-gray-800 placeholder:text-gray-400"
      />
    </div>
  </div>
);

export default AddProduct;
