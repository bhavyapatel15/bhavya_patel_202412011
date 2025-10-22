const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads/')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

const ctrl = require('../controllers/productController');
const { authMiddleware, requireRole } = require('../config/auth');

router.get('/', ctrl.listProducts);
router.get('/categories', ctrl.getCategories);
router.post('/', authMiddleware, requireRole('admin'), upload.single('image'), ctrl.createProduct);
router.put('/:id', authMiddleware, requireRole('admin'), upload.single('image'), ctrl.updateProduct);

router.delete('/:id', authMiddleware, requireRole('admin'), ctrl.deleteProduct);

module.exports = router;
