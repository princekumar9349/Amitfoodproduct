import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { FaTrash, FaEdit } from "react-icons/fa";

const ITEMS_PER_PAGE = 5;

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sort, setSort] = useState("none");
  const [page, setPage] = useState(1);

  const [editingProduct, setEditingProduct] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/products");
      setProducts(data);
    } catch {
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ---------------- FILTER ---------------- */
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

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
      toast.success("Deleted successfully");
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();

      formData.append("name", editingProduct.name);
      formData.append("price", editingProduct.price);
      formData.append("stock", editingProduct.stock);
      formData.append("unit", editingProduct.unit);
      formData.append("category", editingProduct.category);
      formData.append("description", editingProduct.description);

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
    <div>
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Manage Products</h2>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search product..."
          className="border p-2 rounded shadow-sm focus:ring-2 focus:ring-blue-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded shadow-sm"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        <select
          className="border p-2 rounded shadow-sm"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="none">Sort by</option>
          <option value="low">Price Low → High</option>
          <option value="high">Price High → Low</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 uppercase text-gray-600 text-xs">
            <tr>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((product) => (
              <tr key={product._id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-14 h-14 object-cover rounded"
                  />
                </td>

                <td className="p-3 font-semibold">{product.name}</td>
                <td className="p-3">{product.category}</td>

                <td className="p-3 font-semibold text-blue-600">
                  ₹{product.price}
                </td>

                <td className="p-3">
                  {product.stock <= 5 ? (
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-semibold">
                      Low Stock ({product.stock})
                    </span>
                  ) : (
                    product.stock
                  )}
                </td>

                <td className="p-3 flex gap-4">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="text-blue-600 hover:scale-110 transition"
                  >
                    <FaEdit />
                  </button>

                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-red-600 hover:scale-110 transition"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-2 mt-6">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${
              page === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* EDIT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">Edit Product</h3>

            <input
              className="border p-2 w-full mb-3 rounded"
              placeholder="Name"
              value={editingProduct.name}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  name: e.target.value,
                })
              }
            />

            <input
              type="number"
              className="border p-2 w-full mb-3 rounded"
              placeholder="Price"
              value={editingProduct.price}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  price: e.target.value,
                })
              }
            />

            <input
              type="number"
              className="border p-2 w-full mb-3 rounded"
              placeholder="Stock"
              value={editingProduct.stock}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  stock: e.target.value,
                })
              }
            />

            <input
              className="border p-2 w-full mb-3 rounded"
              placeholder="Unit (e.g. 1kg)"
              value={editingProduct.unit}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  unit: e.target.value,
                })
              }
            />

            <input
              className="border p-2 w-full mb-3 rounded"
              placeholder="Category"
              value={editingProduct.category}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  category: e.target.value,
                })
              }
            />

            <textarea
              className="border p-2 w-full mb-3 rounded"
              placeholder="Description"
              value={editingProduct.description}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  description: e.target.value,
                })
              }
            />

            <input
              type="file"
              className="mb-4"
              onChange={(e) => setImageFile(e.target.files[0])}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
