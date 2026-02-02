const express = require('express');
const router = express.Router();
const { createRazorpayOrder, verifyPayment } = require('../controllers/paymentController');
const { protect, customer } = require('../middleware/authMiddleware');

router.post('/create-order', protect, customer, createRazorpayOrder);
router.post('/verify', protect, customer, verifyPayment);

module.exports = router;
