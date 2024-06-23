const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Define the User model with the sequelize ORM
const User = sequelize.define('aha_users', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true, // Automatically increment the ID for each new record
        primaryKey: true, // Set ID as the primary key
    },
    displayName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false, // Email cannot be null
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true, // Password can be null, only used for email/password login
    },
    googleId: {
        type: DataTypes.STRING,
        allowNull: true, // Google ID can be null, only used for Google login
        unique: true, // Google ID must be unique
    },
    photoUrl: {
        type: DataTypes.STRING,
        allowNull: true, // Photo URL can be null
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false, // Type cannot be null, used to differentiate login methods, e.g., 'google' or 'email'
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, // Set default value to current date and time
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, // Set default value to current date and time
    },
});

module.exports = User; // Export the User model
