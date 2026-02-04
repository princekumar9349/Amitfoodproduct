const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const connectDB = require("./config/db");

dotenv.config();

const debugProduct = async () => {
  try {
    await connectDB();

    // Find "mix veg" (case insensitive)
    const products = await Product.find({
      name: { $regex: "mix", $options: "i" },
    });

    console.log("Found Products:", products.length);
    products.forEach((p) => {
      console.log("--------------------------------------------------");
      console.log(`Name: ${p.name}`);
      console.log(`ID: ${p._id}`);
      console.log(`Image (Raw): '${p.image}'`);
      console.log(`Image Type: ${typeof p.image}`);
      console.log(`Image Length: ${p.image ? p.image.length : 0}`);
      if (p.image && p.image.startsWith("data:")) {
        console.log("Is Base64: YES");
      } else {
        console.log("Is Base64: NO");
      }
      console.log("--------------------------------------------------");
    });

    process.exit();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

debugProduct();
