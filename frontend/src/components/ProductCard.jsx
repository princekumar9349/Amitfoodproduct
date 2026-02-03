import React from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  // ✅ GCS Image URL (direct usage)
  console.log("Product Data:", product);
  const imageSrc = product?.image || "/fallback.jpg";
  console.log("Image Source:", imageSrc);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden group border border-gray-100"
    >
      <Link
        to={`/product/${product._id}`}
        className="block relative overflow-hidden"
      >
        <div className="h-48 w-full bg-gray-100 flex items-center justify-center">
          <img
            src={imageSrc}
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = "/fallback.jpg";
            }}
          />
        </div>
      </Link>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/product/${product._id}`}>
            <h3 className="font-bold text-lg text-gray-800 hover:text-primary truncate transition-colors">
              {product.name}
            </h3>
          </Link>
          <span className="font-bold text-lg text-primary">
            ₹{product.price}
          </span>
        </div>

        <p className="text-gray-500 text-sm line-clamp-2 mb-4">
          {product.description}
        </p>

        <button
          onClick={(e) => {
            e.preventDefault();
            addToCart(product);
          }}
          className="w-full bg-orange-100 text-primary font-semibold py-2 px-4 rounded-lg hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <ShoppingCart size={18} />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
