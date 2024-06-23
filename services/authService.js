const oAuth2Client = require('../config/passport');
const User = require('../models/userModel');
const jwtUtils = require('../utils/jwtUtils');
const bcryptUtils = require('../utils/bcryptUtils');
const { ValidationError, AuthenticationError } = require('../utils/errors');

/**
 * Validates the password based on predefined criteria.
 * @param {string} password - The password to be validated.
 * @returns {Array} - An array of error messages, empty if valid.
 */
const validatePassword = (password) => {
    const errors = [];
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lower character');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one upper character');
    }
    if (!/\d/.test(password)) {
        errors.push('Password must contain at least one digit character');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Password must contain at least one special character');
    }
    if (password.length < 8) {
        errors.push('Password must contain at least 8 characters');
    }
    return errors;
};

/**
 * Validates the email format using a regular expression.
 * @param {string} email - The email to be validated.
 * @returns {boolean} - True if the email format is valid, false otherwise.
 */
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Normalizes the email by removing any text after a '+' character in the local part.
 * @param {string} email - The email to be normalized.
 * @returns {string} - The normalized email.
 */
const normalizeEmail = (email) => {
    const [localPart, domainPart] = email.split('@');
    const normalizedLocalPart = localPart.split('+')[0].replace(/\./g, '');
    return `${normalizedLocalPart}@${domainPart}`;
};

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
        const normalizedEmail = normalizeEmail(email);
        const user = await User.findOne({ where: { normalizedEmail } });

        if (!user) {
            throw new AuthenticationError('Invalid email or password');
        }

        if (!await bcryptUtils.comparePassword(password, user.password)) {
            throw new AuthenticationError('Invalid email or password');
        }
        return jwtUtils.generateToken(user);
    },

    // Registers a new user with email and password
    registerUser: async (email, password, confirmPassword) => {
        if (password !== confirmPassword) {
            throw new ValidationError('Passwords do not match');
        }

        const passwordErrors = validatePassword(password);
        if (passwordErrors.length > 0) {
            throw new ValidationError(passwordErrors.join(', '));
        }

        if (!validateEmail(email)) {
            throw new ValidationError('Invalid email format');
        }
        const normalizedEmail = normalizeEmail(email);
        const hashedPassword = await bcryptUtils.hashPassword(password); // Hash the password

        const user = await User.create({
            email: normalizedEmail,
            password: hashedPassword,
            type: 'email'
        });
        return jwtUtils.generateToken(user); // Generate and return JWT token
    },

    // Retrieves the profile of the authenticated user
    getProfile: async (token) => {
        const decoded = jwtUtils.verifyToken(token); // Verify the JWT token
        const user = await User.findByPk(decoded.id); // Find the user by ID from the decoded token
        if (!user) {
            throw new AuthenticationError('Unauthorized');
        }
        return user;
    }
};
