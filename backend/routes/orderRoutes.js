const express = require('express');
const router = express.Router();
const { getOrders, getMyOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, admin, customer } = require('../middleware/authMiddleware');

router.route('/').get(protect, admin, getOrders);
router.route('/myorders').get(protect, customer, getMyOrders);
router.route('/:id/status').put(protect, admin, updateOrderStatus);

module.exports = router;
