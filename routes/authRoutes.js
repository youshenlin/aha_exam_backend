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

// Route to display the user's profile, protected by JWT authentication
router.get('/profile', authenticateJWT, authController.profile);

// Route to handle user logout
router.get('/logout', authController.logout);

module.exports = router; // Export the router
