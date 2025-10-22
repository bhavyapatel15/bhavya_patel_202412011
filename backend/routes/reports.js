const express = require('express');
const router = express.Router();
const { sqlReport, mongoReport } = require('../controllers/reportController');
const { authMiddleware, requireRole } = require('../config/auth');
router.get('/sql', authMiddleware, requireRole('admin'), sqlReport);
router.get('/mongo', authMiddleware, requireRole('admin'), mongoReport);
module.exports = router;
