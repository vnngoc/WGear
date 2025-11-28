const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Customer routes
router.post('/login', authController.login);
router.post('/check-user', authController.checkUser);
router.post('/register', authController.register);
router.post('/verify', authController.verify);

// Admin routes
router.post('/admin/login', authController.adminLogin);

module.exports = router;