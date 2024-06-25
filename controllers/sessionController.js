const sessionService = require('../services/sessionService');

module.exports = {
    // Retrieves the user's dashboard data and records the session
    getUserDashboard: async (req, res) => {
        try {
            const userDashboard = await sessionService.getUserDashboard(req.user.id);
            // Records the session for the user
            await sessionService.recordSession(req.user.id, 'session');
            res.json(userDashboard);
        } catch (error) {
            res.status(error.statusCode || 500).send(error.message);
        }
    },

    // Retrieves overall user statistics
    getUserStatistics: async (req, res) => {
        try {
            const statistics = await sessionService.getUserStatistics();
            res.json(statistics);
        } catch (error) {
            res.status(error.statusCode || 500).send(error.message);
        }
    },
};
