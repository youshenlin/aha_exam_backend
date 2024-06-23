const sessionService = require('../services/sessionService');

module.exports = {
    getUserDashboard: async (req, res) => {
        try {
            const statistics = await sessionService.getUserStatistics();
            const users = await sessionService.getAllUsers();
            await sessionService.recordSession(req.user.id, 'session')
            res.json({ user: req.user, statistics, users });
        } catch (error) {
            res.status(error.statusCode || 500).send(error.message);
        }
    }
};
