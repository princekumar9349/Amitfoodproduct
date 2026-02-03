const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

const corsOptions = {
  origin: [
    "https://admin.amitfoodproduct.in",
    "https://amitfoodproduct.in",
    "http://localhost:5173",
    "http://localhost:3000",
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));

// Static folder for uploads
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Root Route
app.get("/", (req, res) => {
  res.send("API is running...");
  // Server restarted via file touch (retry)
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${PORT}`);
});
