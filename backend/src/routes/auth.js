// routes/auth.js
const express = require('express');
const router = express.Router();
const { login, getMe, changePassword, getLogs, logout } = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);
router.get('/logs', protect, adminOnly, getLogs);
router.post('/logout', protect, logout);

module.exports = router;
