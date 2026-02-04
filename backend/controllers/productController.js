const Product = require("../models/Product");
const uploadToGCS = require("../utils/gcs");

// @desc    Get all products with Search, Filter, Pagination & Sort
// @route   GET /api/products?keyword=abc&category=Snacks&page=1&sort=price-asc
// @access  Public
const getProducts = async (req, res) => {
  try {
    // 1. Build Query for Search (Name or Description)
    const keyword = req.query.keyword
      ? {
          $or: [
            { name: { $regex: req.query.keyword, $options: "i" } },
            { description: { $regex: req.query.keyword, $options: "i" } },
          ],
        }
      : {};

    // 2. Build Filter (Category & Price)
    const filter = { ...keyword };
    
    if (req.query.category && req.query.category !== "All") {
      filter.category = req.query.category;
    }

    // Price Filter (e.g. ?minPrice=100&maxPrice=500)
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }

    // 3. Sorting
    let sort = { createdAt: -1 }; // Default: Newest first
    if (req.query.sort) {
      if (req.query.sort === "price-asc") sort = { price: 1 };
      else if (req.query.sort === "price-desc") sort = { price: -1 };
      else if (req.query.sort === "oldest") sort = { createdAt: 1 };
    }

    // 4. Pagination
    const pageSize = Number(req.query.limit) || 12;
    const page = Number(req.query.page) || 1;

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sort)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    // Return enhanced response object
    res.json({ 
        products, 
        page, 
        pages: Math.ceil(count / pageSize),
        total: count 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    // Check if error is due to invalid ObjectId format
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: "Product not found" });
    }
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get unique categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const { name, price, category, description, stock, unit } = req.body;

    // Basic Validation
    if (!name || !price || !category) {
        return res.status(400).json({ message: "Please fill in all required fields" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image" });
    }

    const image = await uploadToGCS(req.file);

    const product = new Product({
      name,
      price,
      category,
      description,
      stock,
      unit,
      image,
      // user: req.user._id // Good practice to track who created it
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  const { name, price, category, description, stock, unit } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.category = category || product.category;
      product.description = description || product.description;
      product.stock = stock || product.stock;
      product.unit = unit || product.unit;

      if (req.file) {
        // Optional: Logic to delete old image from cloud storage could go here
        product.image = await uploadToGCS(req.file);
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      // Optional: Logic to delete image from cloud storage
      await Product.deleteOne({ _id: req.params.id });
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
    getProducts, 
    getProductById, // ✅ Added
    getCategories, 
    createProduct, 
    updateProduct, 
    deleteProduct 
};