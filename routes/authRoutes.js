const express = require('express');
const router = express.Router();
const { signup, login, verifyOTP } = require('../controllers/authController');

// Signup Route
router.post('/signup', signup);
// Verify OTP and Complete Signup
router.post('/verify-otp', verifyOTP);

// Login Route
router.post('/login', login);

module.exports = router;
