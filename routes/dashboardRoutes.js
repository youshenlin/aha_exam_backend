const express = require('express');
const sessionController = require('../controllers/sessionController');
const { authenticateJWT } = require('../middleware/authMiddleware');
const router = express.Router();

// Route to get the user's dashboard, requires authentication
router.get('/dashboard', authenticateJWT, sessionController.getUserDashboard);

// Route to get overall user statistics, requires authentication
router.get('/statistics', authenticateJWT, sessionController.getUserStatistics);

module.exports = router; // Export the router
