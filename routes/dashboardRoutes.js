const express = require('express');
const sessionController = require('../controllers/sessionController');
const { authenticateJWT } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/dashboard', authenticateJWT, sessionController.getUserDashboard);

module.exports = router;
