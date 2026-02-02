const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay Order & DB Order
// @route   POST /api/payment/create-order
// @access  Private (User)
const createRazorpayOrder = async (req, res) => {
    const { amount, products, address } = req.body;

    const options = {
        amount: amount * 100, // Amount in paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
    };

    try {
        const razorpayOrder = await razorpay.orders.create(options);

        if (!razorpayOrder) {
            return res.status(500).json({ message: 'Razorpay order creation failed' });
        }

        const order = new Order({
            userId: req.user._id, // From auth middleware
            products: products, // Assumes [{ productId, quantity }]
            totalAmount: amount,
            address: address,
            razorpayOrderId: razorpayOrder.id,
            paymentStatus: 'Pending',
            orderStatus: 'Pending'
        });

        const createdOrder = await order.save();

        res.json({
            ...razorpayOrder,
            orderId: createdOrder._id // Send DB Order ID to frontend
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payment/verify
// @access  Private (User)
const verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    if (expectedSignature === razorpay_signature) {
        try {
            // Update local order
            const order = await Order.findById(orderId);
            if (order) {
                order.paymentStatus = 'Paid';
                order.orderStatus = 'Confirmed';
                order.razorpayOrderId = razorpay_order_id;
                order.razorpayPaymentId = razorpay_payment_id;
                order.razorpaySignature = razorpay_signature;
                await order.save();
                res.json({ message: 'Payment verified successfully' });
            } else {
                res.status(404).json({ message: 'Order not found' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(400).json({ message: 'Invalid signature' });
    }
};

module.exports = { createRazorpayOrder, verifyPayment };
