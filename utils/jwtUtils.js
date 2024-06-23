const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = {
    // Generates a JWT token with the user's ID, expiring in 12 hour
    generateToken: (user, ttl = '12h') => jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: ttl }),

    // Verifies the JWT token
    verifyToken: (token) => jwt.verify(token, JWT_SECRET)
};
