const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    user: { type: String, required: true }, // Keeping it simple (name) or use ObjectId if you have Users
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
}, { timestamps: true });

const productSchema = mongoose.Schema({
    // --- Basic Details ---
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    unit: { type: String, required: true }, // e.g., '1kg', '500ml', '1 packet'

    // --- NEW: Premium Details ---
    ingredients: [{ type: String }], // Array of strings e.g. ["Flour", "Sugar"]
    
    nutrition: {
        energy: { type: String, default: "0 kcal" },
        protein: { type: String, default: "0g" },
        carbs: { type: String, default: "0g" },
        fat: { type: String, default: "0g" },
        sugar: { type: String, default: "0g" }
    },

    // --- NEW: Trust & Info Signals ---
    shelfLife: { type: String, default: "Best before 6 months" },
    isOrganic: { type: Boolean, default: false },
    isVegetarian: { type: Boolean, default: true }, // Useful for food apps
    fssaiLicense: { type: String, default: "1001234567890" }, // Mock license default

    // --- NEW: Reviews ---
    reviews: [reviewSchema],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 }

}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);