const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* =======================================================
   CREATE RAZORPAY ORDER
======================================================= */

const createRazorpayOrder = async (req, res) => {
  console.log("Create Order Request Body:", req.body);
  console.log("User:", req.user);

  const { totalPrice, orderItems, shippingAddress } = req.body;

  /* ---------- VALIDATION ---------- */

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: "No order items" });
  }

  if (!totalPrice || isNaN(totalPrice)) {
    return res.status(400).json({ message: "Invalid total amount" });
  }

  try {
    /* ---------- RAZORPAY ORDER ---------- */

    const options = {
      amount: Math.round(Number(totalPrice) * 100), // ₹ to paise (ONLY ONCE)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    console.log("Creating Razorpay order with:", options);

    const razorpayOrder = await razorpay.orders.create(options);

    if (!razorpayOrder) {
      return res.status(500).json({
        message: "Failed to create Razorpay order",
      });
    }

    /* ---------- SAVE ORDER IN DB ---------- */

    const order = new Order({
      userId: req.user._id,
      products: orderItems.map((item) => ({
        productId: item.product,
        quantity: item.qty,
      })),
      totalAmount: totalPrice,
      address: shippingAddress,
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: "Pending",
      orderStatus: "Pending",
    });

    const createdOrder = await order.save();

    console.log("Order saved:", createdOrder._id);

    /* ---------- RESPONSE TO FRONTEND ---------- */

    res.json({
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      orderId: createdOrder._id,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({
      message: error.message || "Payment creation failed",
    });
  }
};

/* =======================================================
   VERIFY PAYMENT
======================================================= */

const verifyPayment = async (req, res) => {
  console.log("Verify Payment Body:", req.body);

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId,
  } = req.body;

  try {
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.paymentStatus = "Paid";
    order.orderStatus = "Confirmed";
    order.razorpayOrderId = razorpay_order_id;
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;

    await order.save();

    res.json({ message: "Payment verified successfully" });
  } catch (error) {
    console.error("Verify Error:", error);
    res.status(500).json({
      message: error.message || "Verification failed",
    });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyPayment,
};
