const { aha_users: User, user_sessions: UserSession } = require('../models');
const { Op } = require('sequelize');
const dayjs = require('dayjs');

module.exports = {
    recordSession: async (userId, sessionType) => {
        await UserSession.create({
            userId,
            sessionType,
        });
    },

    getUserStatistics: async () => {
        const totalUsers = await User.count();
        const today = dayjs().startOf('day').toDate();

        const activeSessionsToday = await UserSession.count({
            where: {
                createdAt: {
                    [Op.gte]: today
                }
            }
        });

        const last7Days = dayjs().subtract(6, 'day').startOf('day').toDate();

        const sessionsLast7Days = await UserSession.count({
            where: {
                createdAt: {
                    [Op.gte]: last7Days
                }
            }
        });

        const averageActiveSessionsLast7Days = (sessionsLast7Days / 7).toFixed(2);

        return {
            totalUsers,
            activeSessionsToday,
            averageActiveSessionsLast7Days
        };
    },

    getAllUsers: async () => {
        const users = await User.findAll({
            attributes: ['id', 'displayName', 'email', 'createdAt', 'loginCount'],
            include: [{
                model: UserSession,
                as: 'sessions',
                attributes: ['createdAt'],
                order: [['createdAt', 'DESC']],
                limit: 1
            }]
        });
        return users.map(user => {
            const lastSession = user.sessions.length > 0 ? user.sessions[0].createdAt : null;
            return {
                id: user.id,
                displayName: user.displayName,
                email: user.email,
                createdAt: user.createdAt,
                loginCount: user.loginCount,
                lastSession
            };
        });
    }
};
