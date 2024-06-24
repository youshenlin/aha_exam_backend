const express = require('express');
const authController = require('../controllers/authController');
const { authenticateJWT } = require('../middleware/authMiddleware');
const router = express.Router();

// Route to initiate Google login
router.get('/auth/google', authController.googleLogin);

// Route to handle the Google callback after authentication
router.get('/auth/google/callback', authController.googleCallback);

// Route to handle login via email and password
router.post('/auth/login', authController.emailLogin);

// Route to handle user registration
router.post('/auth/register', authController.registerUser);

router.get('/user/profile', authenticateJWT, authController.getProfile);

// Route to handle user logout
router.get('/logout', authController.logout);

// Route to handle password reset
router.post('/auth/reset-password', authenticateJWT, authController.resetPassword);

router.get('/auth/verify-email', authController.verifyEmail);

router.post('/auth/resend-verification-email', authenticateJWT, authController.resendVerificationEmail); // 添加这一行

router.post('/auth/changeDisplayName', authenticateJWT, authController.changeDisplayName);

module.exports = router; // Export the router
