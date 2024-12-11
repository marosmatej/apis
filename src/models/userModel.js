const { DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Auto-increment for primary key
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true, // Optional: Ensure username is unique
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: false,
    }
  }, {
    tableName: 'Users',
    timestamps: false, // Automatically handles createdAt and updatedAt columns
  });

module.exports = User;