const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// 1. Register or resend OTP
router.post('/register', authController.register);

// 2. Login (send OTP)
router.post('/login', authController.login);

// 3. Verify OTP (Registration & Login)
router.post('/verify-otp', authController.verifyOtp);

// 4. Auto-login using rememberToken
router.get('/auto-login', authController.autoLogin);

// 5. Logout
router.post('/logout', authController.logout);

module.exports = router;
