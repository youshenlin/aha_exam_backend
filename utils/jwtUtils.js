const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = {
    // Generates a JWT token with the user's ID, expiring in 1 hour
    generateToken: (user) => jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' }),

    // Verifies the JWT token
    verifyToken: (token) => jwt.verify(token, JWT_SECRET)
};
