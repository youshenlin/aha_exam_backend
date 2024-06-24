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
    /**
Create a dashboard with a list of all users that have signed up to your app. For each user, show the following information:

1. Timestamp of user sign up.
2. Number of times logged in.
3. Timestamp of the last user session. For users with cookies, session and login may be different, since the user may not need to log in to start a new session.
     */
    getUserDashboard: async () => {
        function maskEmail(email) {
            const emailParts = email.split('@');
            if (emailParts.length !== 2) {
                throw new Error('Invalid email format');
            }

            const localPart = emailParts[0];
            const domainPart = emailParts[1];

            const maskString = (str) => {
                const maskLength = Math.ceil(str.length / 2);
                let maskedStr = str.split('');

                for (let i = 0; i < maskLength; i++) {
                    const randomIndex = Math.floor(Math.random() * str.length);
                    maskedStr[randomIndex] = '*';
                }

                return maskedStr.join('');
            };

            const maskedLocalPart = maskString(localPart);
            const domainParts = domainPart.split('.');
            const maskedDomainPart = domainParts.map(maskString).join('.');

            return maskedLocalPart + '@' + maskedDomainPart;
        }
        const users = await User.findAll({
            attributes: ['id', 'displayName', 'email', 'createdAt', 'loginCount'],
            include: [
                {
                    model: UserSession,
                    as: 'sessions',
                    attributes: ['createdAt'],
                    order: [['createdAt', 'DESC']],
                    limit: 1,
                },
            ],
        });
        return users.map((user) => {
            const lastSession =
                user.sessions.length > 0 ? dayjs(user.sessions[0].createdAt).format('YYYY-MM-DD HH:mm:ss') : null;

            return {
                displayName: user.displayName,
                email: maskEmail(user.email),
                signupTs: dayjs(user.createdAt).format('YYYY-MM-DD HH:mm:ss'),
                loginCount: user.loginCount,
                lastSession,
            };
        });
    },

    getUserStatistics: async () => {
        const totalUsers = await User.count();
        const today = dayjs().startOf('day').toDate();

        const activeSessionsToday = await UserSession.count({
            distinct: true,
            col: 'userId',
            where: {
                createdAt: {
                    [Op.gte]: today,
                },
            },
        });
        //Average number of active session users in the last 7 days rolling.
        const last7Days = dayjs().subtract(6, 'day').startOf('day').toDate();

        const sessionsLast7Days = await UserSession.count({
            distinct: true,
            col: 'userId',
            where: {
                createdAt: {
                    [Op.gte]: last7Days,
                },
            },
        });

        const averageActiveSessionsLast7Days = (sessionsLast7Days / 7).toFixed(2);

        return {
            totalUsers,
            activeSessionsToday,
            averageActiveSessionsLast7Days,
        };
    },

    getAllUsers: async () => {
        const users = await User.findAll({
            attributes: ['id', 'displayName', 'email', 'createdAt', 'loginCount'],
            include: [
                {
                    model: UserSession,
                    as: 'sessions',
                    attributes: ['createdAt'],
                    order: [['createdAt', 'DESC']],
                    limit: 1,
                },
            ],
        });
        return users.map((user) => {
            const lastSession = user.sessions.length > 0 ? user.sessions[0].createdAt : null;
            return {
                id: user.id,
                displayName: user.displayName,
                email: user.email,
                createdAt: user.createdAt,
                loginCount: user.loginCount,
                lastSession,
            };
        });
    },
};
