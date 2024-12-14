const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

const TokenBlacklist = sequelize.define('TokenBlacklist', {
    token: {
        type: DataTypes.STRING, 
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