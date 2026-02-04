const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const Order = require("../models/Order");

/* Razorpay Webhook */
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const signature = req.headers["x-razorpay-signature"];
      const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

      if (!webhookSecret) {
        console.error("❌ Webhook secret missing");
        return res.status(500).send("Server misconfigured");
      }

      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(req.body)
        .digest("hex");

      if (signature !== expectedSignature) {
        console.error("❌ Invalid signature");
        return res.status(400).json({ message: "Invalid signature" });
      }

      const event = JSON.parse(req.body.toString());

      console.log("📌 Webhook Event:", event.event);

      if (event.event === "payment.captured") {
        const payment = event.payload.payment.entity;

        console.log("📌 Razorpay Order ID:", payment.order_id);

        const order = await Order.findOne({
          razorpayOrderId: payment.order_id,
        });

        console.log("📌 Order found in DB:", order);

        if (!order) {
          console.log("❌ Order not found");
          return res.status(404).json({ message: "Order not found" });
        }

        // Prevent duplicate update
        if (order.paymentStatus === "Paid") {
          console.log("⚠️ Already marked Paid");
          return res.status(200).json({ message: "Already updated" });
        }

        order.paymentStatus = "Paid";
        order.orderStatus = "Confirmed";
        order.razorpayPaymentId = payment.id;

        await order.save();

        console.log("✅ Order updated:", order._id);
      }

      res.status(200).json({ received: true });
    } catch (error) {
      console.error("🔥 Webhook error:", error);
      res.status(500).send("Webhook processing failed");
    }
  }
);

module.exports = router;
