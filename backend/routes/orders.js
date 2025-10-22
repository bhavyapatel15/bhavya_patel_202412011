const express = require('express');
const router = express.Router();
const { checkout } = require('../controllers/orderController');
const { authMiddleware } = require('../config/auth');
router.post('/checkout', authMiddleware, checkout);
module.exports = router;
