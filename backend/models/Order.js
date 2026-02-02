const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    userId: { type: String, required: true }, // Keeping flexible for now as User model wasn't requested
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, default: 'Pending' },
    orderStatus: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Packed', 'Out for Delivery', 'Delivered'],
        default: 'Pending'
    },
    address: { type: String, required: true },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
