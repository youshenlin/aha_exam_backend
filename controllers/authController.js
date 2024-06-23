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
            res.cookie('jwt', token, { httpOnly: true, secure: false });
            res.redirect('/profile');
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
            res.redirect('/profile');
        } catch (error) {
            res.status(401).send(error.message);
        }
    },

    // Registers a new user with email and password
    registerUser: async (req, res) => {
        try {
            const token = await authService.registerUser(req.body.email, req.body.password);
            // Sets a cookie with the JWT token, secure: true should be used in production
            res.cookie('jwt', token, { httpOnly: true, secure: false });
            res.redirect('/profile');
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    // Renders the user's profile page
    profile: (req, res) => {
        const user = req.user;
        res.send(`
            <h1>Profile</h1>
            <p>Name: ${user.displayName}</p>
            <p>Email: ${user.email}</p>
            <p>Login Type: ${user.type}</p>
            <p><img src="${user.photoUrl}" alt="User Photo" /></p>
            <a href="/logout">Logout</a>
        `);
    },

    // Logs out the user by clearing the JWT cookie
    logout: (req, res) => {
        res.clearCookie('jwt');
        res.redirect('/');
    }
};
