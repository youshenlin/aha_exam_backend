const bcrypt = require('bcryptjs');

module.exports = {
    // Hashes a password with a salt rounds of 10
    hashPassword: async (password) => await bcrypt.hash(password, 10),

    // Compares a plain text password with a hashed password
    comparePassword: async (password, hashedPassword) => await bcrypt.compare(password, hashedPassword)
};
