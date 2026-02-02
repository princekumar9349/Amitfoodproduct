const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    unit: { type: String, required: true } // e.g., '1kg', '500ml', '1 packet'
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
