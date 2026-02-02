import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

const AddProduct = () => {
  const navigate = useNavigate();
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
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.name ||
      !formData.price ||
      !formData.category ||
      !image ||
      !formData.stock ||
      !formData.unit
    ) {
      return toast.error("Please fill all fields");
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
      toast.success("Product Added Successfully");
      navigate("/products");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add product");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Product</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div>
          <label className="block text-gray-700 font-bold mb-2">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">
            Price (₹)
          </label>
          <input
            type="number"
            name="price"
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">Category</label>
          <input
            type="text"
            name="category"
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="e.g., Vegetables, Spices"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">
            Stock (Quantity)
          </label>
          <input
            type="number"
            name="stock"
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">Unit</label>
          <input
            type="text"
            name="unit"
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="e.g., 1kg, 500g, 1 pkt"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">Image</label>
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full p-2 border rounded"
            accept="image/*"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-gray-700 font-bold mb-2">
            Description
          </label>
          <textarea
            name="description"
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="4"
            required
          ></textarea>
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 transition"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
