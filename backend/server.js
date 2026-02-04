const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const crypto = require("crypto");
const connectDB = require("./config/db");
const Order = require("./models/Order");

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
    "http://localhost:3000",
  ],
  credentials: true,
};

app.use(cors(corsOptions));

/* =========================
   🔥 RAZORPAY WEBHOOK
   MUST be BEFORE express.json()
========================= */
app.post(
  "/api/payment/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const signature = req.headers["x-razorpay-signature"];
      const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

      if (!webhookSecret) {
        console.error("❌ Webhook secret missing");
        return res.status(500).send("Server misconfigured");
      }

      // 🔐 Verify Signature
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(req.body)
        .digest("hex");

      if (signature !== expectedSignature) {
        console.error("❌ Invalid webhook signature");
        return res.status(400).json({ message: "Invalid signature" });
      }

      const event = JSON.parse(req.body.toString());

      console.log("📩 Webhook Event:", event.event);

      // ✅ Handle All Payment Success Events
      if (
        event.event === "payment.captured" ||
        event.event === "payment.authorized"
      ) {
        const payment = event.payload.payment.entity;

        console.log("🔎 Payment ID:", payment.id);
        console.log("🔎 Razorpay Order ID:", payment.order_id);

        const order = await Order.findOne({
          razorpayOrderId: payment.order_id,
        });

        if (!order) {
          console.error("❌ Order not found in DB");
          return res.status(404).json({ message: "Order not found" });
        }

        // 🛑 Prevent Double Update
        if (order.paymentStatus === "Paid") {
          console.log("⚠️ Order already marked as Paid");
          return res.status(200).json({ message: "Already updated" });
        }

        // ✅ Update Order
        order.paymentStatus = "Paid";
        order.orderStatus = "Confirmed";
        order.razorpayPaymentId = payment.id;

        await order.save();

        console.log("✅ Order updated successfully:", order._id);
      }

      res.status(200).json({ received: true });
    } catch (error) {
      console.error("🔥 Webhook error:", error);
      res.status(500).send("Webhook processing failed");
    }
  },
);

/* =========================
   JSON PARSER (AFTER webhook)
========================= */

app.use(express.json());

/* =========================
   ROUTES
========================= */

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));
app.use("/api/payment", require("./routes/razorpayWebhook"));

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
