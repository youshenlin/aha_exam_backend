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

// Route to retrieve the user's profile, requires authentication
router.get('/user/profile', authenticateJWT, authController.getProfile);

// Route to handle user logout
router.get('/logout', authController.logout);

// Route to handle password reset, requires authentication
router.post('/auth/reset-password', authenticateJWT, authController.resetPassword);

// Route to verify the user's email using a token
router.get('/auth/verify-email', authController.verifyEmail);

// Route to resend the verification email, requires authentication
router.post('/auth/resend-verification-email', authenticateJWT, authController.resendVerificationEmail);

// Route to change the user's display name, requires authentication
router.post('/auth/changeDisplayName', authenticateJWT, authController.changeDisplayName);

module.exports = router; // Export the router
