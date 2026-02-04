const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  getCategories, // 👈 Import this new function
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect, admin } = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

// Public Routes
router
  .route("/")
  .get(getProducts)
  .post(protect, admin, upload.single("image"), createProduct);

// ✅ NEW: Add this route BEFORE the /:id route
// If you put it after /:id, Express will think "categories" is an "id"
router.get("/categories", getCategories);

// ID based routes must be at the bottom
router
  .route("/:id")
  .get(getProductById)
  .put(protect, admin, upload.single("image"), updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;
