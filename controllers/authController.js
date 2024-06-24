const authService = require('../services/authService');

module.exports = {
    // Initiates Google login by redirecting to the Google authorization URL
    googleLogin: (req, res) => {
        const authorizeUrl = authService.googleLogin();
        res.redirect(authorizeUrl);
    },

    // Handles the callback from Google after authorization
    googleCallback: async (req, res) => {
        try {
            const token = await authService.googleCallback(req.query.code);
            // Sets a cookie with the JWT token, secure: true should be used in production
            res.cookie('jwt', token, {
                httpOnly: true,
                secure: false,
            });
            res.send('Google login successful');
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    // Handles login via email and password
    emailLogin: async (req, res) => {
        try {
            const token = await authService.emailLogin(req.body.email, req.body.password);
            // Sets a cookie with the JWT token, secure: true should be used in production
            res.cookie('jwt', token, { httpOnly: true, secure: false });
            res.send('Login successful');
        } catch (error) {
            res.status(401).send(error.message);
        }
    },

    // Registers a new user with email and password
    registerUser: async (req, res) => {
        try {
            const token = await authService.registerUser(req.body.email, req.body.password, req.body.confirmPassword);
            // Sets a cookie with the JWT token, secure: true should be used in production
            res.cookie('jwt', token, { httpOnly: true, secure: false });
            res.send('User has been created successfully');
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    getProfile: async (req, res) => {
        try {
            const user = req.user;
            const userData = await authService.getProfile(user);
            res.json(userData);
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    // Logs out the user by clearing the JWT cookie
    logout: (req, res) => {
        res.clearCookie('jwt');
        res.redirect('/');
    },
    resetPassword: async (req, res) => {
        try {
            const userId = req.user.id;
            const { oldPassword, newPassword, confirmNewPassword } = req.body;
            await authService.resetPassword(userId, oldPassword, newPassword, confirmNewPassword);
            res.send('Password has been reset successfully');
        } catch (error) {
            res.status(error.statusCode || 500).send(error.message);
        }
    },
    verifyEmail: async (req, res) => {
        try {
            await authService.verifyEmail(req.query.token);
            res.send('Email has been verified successfully');
        } catch (error) {
            res.status(error.statusCode || 500).send(error.message);
        }
    },
    resendVerificationEmail: async (req, res) => {
        try {
            const userId = req.user.id;
            await authService.resendVerificationEmail(userId);
            res.send('Verification email has been resent successfully');
        } catch (error) {
            res.status(error.statusCode || 500).send(error.message);
        }
    },

    changeDisplayName: async (req, res) => {
        try {
            const userId = req.user.id;
            const { displayName } = req.body;
            await authService.changeDisplayName(userId, displayName);
            res.send('Display name has been changed successfully');
        } catch (error) {
            res.status(error.statusCode || 500).send(error.message);
        }
    },
};
