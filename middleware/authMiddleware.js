const jwtUtils = require('../utils/jwtUtils');
const { aha_users: User } = require('../models');
module.exports = {
    // Middleware to authenticate the JWT token from cookies
    authenticateJWT: async (req, res, next) => {
        const token = req.cookies.jwt; // Retrieve the JWT token from cookies
        if (!token) {
            return res.status(401).send('Unauthorized'); // Send 401 if token is missing
        }

        try {
            const decoded = jwtUtils.verifyToken(token); // Verify the JWT token
            const user = await User.findByPk(decoded.id, {
                attributes: ['id', 'displayName', 'email', 'type', 'isVerified', 'createdAt', 'loginCount'],
            }); // Find the user by ID from the decoded token

            if (!user) {
                return res.status(401).send('Unauthorized'); // Send 401 if user not found
            }
            req.user = user; // Attach the full user information to the request object
            next(); // Proceed to the next middleware or route handler
        } catch (error) {
            console.error('Error verifying JWT token:', error);
            res.status(401).send('Unauthorized'); // Send 401 if token verification fails
        }
    },
};
