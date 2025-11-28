const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

router.post('/', orderController.createOrder);
router.get('/name/:name', orderController.getOrdersByName);
router.get('/admin', orderController.getAllOrders);
router.put('/:id', orderController.cancelOrder);
router.put('/confirm/:id', orderController.confirmOrder);

module.exports = router;