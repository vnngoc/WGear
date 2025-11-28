const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

// GET routes
router.get('/', productController.getAllProducts);
router.get('/related', productController.getRelatedProducts);
router.get('/:id', productController.getProductById);

// POST routes
router.post('/', productController.createProduct);

// PUT routes
router.put('/:id', productController.updateProduct);

// DELETE routes
router.delete('/:id', productController.deleteProduct);

module.exports = router;