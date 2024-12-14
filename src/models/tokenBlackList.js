const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

const TokenBlacklist = sequelize.define('TokenBlacklist', {
    token: {
        type: DataTypes.STRING, // Use TEXT to store the token as it's large
        allowNull: false,
    },
    expiry: {
        type: DataTypes.DATE,
        allowNull: false, // Token expiration is required
    },
}, {
    timestamps: false, // No createdAt or updatedAt needed for this table
    tableName: 'TokenBlacklist', 
});

module.exports = TokenBlacklist;