const sessionService = require('../services/sessionService');

module.exports = {
    getUserDashboard: async (req, res) => {
        try {
            const userDashboard = await sessionService.getUserDashboard(req.user.id);
            await sessionService.recordSession(req.user.id, 'session');
            res.json(userDashboard);
        } catch (error) {
            res.status(error.statusCode || 500).send(error.message);
        }
    },

    getUserStatistics: async (req, res) => {
        try {
            const statistics = await sessionService.getUserStatistics();
            res.json(statistics);
        } catch (error) {
            res.status(error.statusCode || 500).send(error.message);
        }
    },
};
