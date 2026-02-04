const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

/* =========================
   CORS CONFIG
========================= */
const corsOptions = {
  origin: [
    "https://admin.amitfoodproduct.in",
    "https://amitfoodproduct.in",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:3000",
  ],
  credentials: true,
};

app.use(cors(corsOptions));

/* =========================
   🔥 RAZORPAY WEBHOOK
   MUST be BEFORE express.json()
========================= */
app.use(
  "/api/payment/webhook",
  express.raw({ type: "application/json" }),
  require("./routes/razorpayWebhook"),
);

/* =========================
   JSON PARSER (AFTER webhook)
========================= */
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

/* =========================
   ROUTES
========================= */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));

/* =========================
   STATIC FILES
========================= */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* =========================
   ROOT ROUTE
========================= */
app.get("/", (req, res) => {
  res.send("API is running...");
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
