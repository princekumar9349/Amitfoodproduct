const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay Order & DB Order
// @route   POST /api/payment/create-order
// @access  Private (User)
const createRazorpayOrder = async (req, res) => {
  console.log("Create Order Request Body:", JSON.stringify(req.body, null, 2));
  console.log("User:", req.user);

  const { amount, products, address } = req.body;

  const options = {
    amount: Math.round(amount * 100), // Amount in paise, ensure integer
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  try {
    console.log("Creating Razorpay order with options:", options);
    const razorpayOrder = await razorpay.orders.create(options);
    console.log("Razorpay Order Created:", razorpayOrder);

    if (!razorpayOrder) {
      console.error("Razorpay order creation failed: No response");
      return res
        .status(500)
        .json({ message: "Razorpay order creation failed" });
    }

    const order = new Order({
      userId: req.user._id, // From auth middleware
      products: products, // Assumes [{ productId, quantity }]
      totalAmount: amount,
      address: address,
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: "Pending",
      orderStatus: "Pending",
    });

    const createdOrder = await order.save();
    console.log("Order saved to DB:", createdOrder._id);

    res.json({
      ...razorpayOrder,
      orderId: createdOrder._id, // Send DB Order ID to frontend
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Payment Controller Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payment/verify
// @access  Private (User)
const verifyPayment = async (req, res) => {
  console.log("Verify Payment Request Body:", req.body);
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId,
  } = req.body;

  try {
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    console.log(
      "Generating signature with secret exists:",
      !!process.env.RAZORPAY_KEY_SECRET,
    );

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    console.log("Signatures:", {
      expected: expectedSignature,
      received: razorpay_signature,
    });

    if (expectedSignature === razorpay_signature) {
      console.log("Signature matched. Finding order:", orderId);

      // Update local order
      const order = await Order.findById(orderId);

      if (order) {
        console.log("Order found:", order._id);
        order.paymentStatus = "Paid";
        order.orderStatus = "Confirmed";
        order.razorpayOrderId = razorpay_order_id;
        order.razorpayPaymentId = razorpay_payment_id;
        order.razorpaySignature = razorpay_signature;
        await order.save();
        console.log("Order updated successfully");
        res.json({ message: "Payment verified successfully" });
      } else {
        console.error("Order not found in DB for ID:", orderId);
        res.status(404).json({ message: "Order not found" });
      }
    } else {
      console.error("Signature mismatch");
      res.status(400).json({ message: "Invalid signature" });
    }
  } catch (error) {
    console.error("Verify Payment Error:", error);
    res.status(500).json({ message: error.message, stack: error.stack });
  }
};

module.exports = { createRazorpayOrder, verifyPayment };
