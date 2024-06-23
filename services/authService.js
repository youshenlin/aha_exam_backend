const oAuth2Client = require('../config/passport');
const User = require('../models/userModel');
const jwtUtils = require('../utils/jwtUtils');
const bcryptUtils = require('../utils/bcryptUtils');

module.exports = {
    // Generates the Google OAuth login URL
    googleLogin: () => {
        return oAuth2Client.generateAuthUrl({
            access_type: 'offline', // Requests offline access
            scope: ['profile', 'email'] // Requests access to the user's profile and email
        });
    },

    // Handles the Google callback after authentication
    googleCallback: async (code) => {
        const { tokens } = await oAuth2Client.getToken(code); // Exchange code for tokens
        oAuth2Client.setCredentials(tokens); // Set the credentials for the OAuth2 client

        const ticket = await oAuth2Client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.CLIENT_ID
        });
        const payload = ticket.getPayload(); // Get user information from the ID token

        let user = await User.findOne({ where: { googleId: payload.sub } }); // Find user by Google ID
        if (!user) {
            // Create a new user if not found
            user = await User.create({
                googleId: payload.sub,
                displayName: payload.name,
                email: payload.email,
                photoUrl: payload.picture,
                type: 'google'
            });
        }

        return jwtUtils.generateToken(user); // Generate and return JWT token
    },

    // Handles login via email and password
    emailLogin: async (email, password) => {
        const user = await User.findOne({ where: { email } }); // Find user by email

        // Check if the user exists and the password is correct
        if (user && await bcryptUtils.comparePassword(password, user.password)) {
            return jwtUtils.generateToken(user); // Generate and return JWT token
        } else {
            throw new Error('Invalid email or password'); // Throw an error if authentication fails
        }
    },

    // Registers a new user with email and password
    registerUser: async (email, password) => {
        const hashedPassword = await bcryptUtils.hashPassword(password); // Hash the password
        const user = await User.create({
            email,
            password: hashedPassword,
            type: 'email'
        });
        return jwtUtils.generateToken(user); // Generate and return JWT token
    },

    // Retrieves the profile of the authenticated user
    getProfile: async (token) => {
        const decoded = jwtUtils.verifyToken(token); // Verify the JWT token
        const user = await User.findByPk(decoded.id); // Find the user by ID from the decoded token
        if (user) {
            return user; // Return the user information if found
        } else {
            throw new Error('Unauthorized'); // Throw an error if the user is not found
        }
    }
};
