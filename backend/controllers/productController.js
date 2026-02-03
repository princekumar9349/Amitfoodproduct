const Product = require("../models/Product");
const fs = require("fs");
const path = require("path");
const uploadToGCS = require("../utils/gcs");
// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload image" });
    }

    const image = await uploadToGCS(req.file);

    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      description: req.body.description,
      stock: req.body.stock,
      unit: req.body.unit,
      image,
    });

    await product.save();
    res.status(201).json(product);
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
        // Delete old image if exists
        if (product.image) {
          // Check if file exists before deleting
          const oldPath = path.resolve(product.image);
          if (fs.existsSync(oldPath)) {
            // Note: failing to delete local file (or GCS obj) shouldn't break update
            // For GCS, we should ideally delete from bucket, but fs.unlinkSync won't work for URL
          }
        }
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
    // Use findByIdAndDelete or findById then remove
    const product = await Product.findById(req.params.id);

    if (product) {
      if (product.image) {
        // GCS deletion logic would go here
      }
      await Product.deleteOne({ _id: req.params.id });
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };
