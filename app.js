require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const { swaggerUi, swaggerDocument } = require('./swagger');

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Set up body parser to parse URL-encoded and JSON request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
    cors({
        origin: process.env.BASE_URL,
        credentials: true,
    })
);
// Set up cookie parser to parse cookies
app.use(cookieParser());

// Serve static files from the 'views' directory
app.use(express.static(path.join(__dirname, 'views')));

// Use the authentication routes
app.use('/api/', authRoutes);

app.use('/api/', dashboardRoutes);

// Serve the index.html file on the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

// Start the server on port process.env.PORT
app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
