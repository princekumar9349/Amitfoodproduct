const Order = require("../models/Order");

// ================================
// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
// ================================
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate({
        path: "products.productId",
        select: "name price image",
      })
      .populate({
        path: "userId",
        select: "name email",
      })
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Order Fetch Error:", error);
    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

// ================================
// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private/Customer
// ================================
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate("products.productId", "name price image")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("My Orders Fetch Error:", error);
    res.status(500).json({
      message: "Failed to fetch your orders",
      error: error.message,
    });
  }
};

// ================================
// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
// ================================
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  // Allowed statuses (must match Order model enum)
  const allowedStatuses = [
    "Pending",
    "Confirmed",
    "Packed",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
  ];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      message: "Invalid order status",
    });
  }

  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.orderStatus = status;

    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Update Order Status Error:", error);
    res.status(500).json({
      message: "Failed to update order status",
      error: error.message,
    });
  }
};

module.exports = {
  getOrders,
  getMyOrders,
  updateOrderStatus,
};
