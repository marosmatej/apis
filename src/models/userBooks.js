const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

const UserBooks = sequelize.define('UserBooks', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true // Sequelize handles this for SQL Server
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    book_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    is_bookmarked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    rating: {
        type: DataTypes.INTEGER,
        defaultValue: 0 // -1 for dislike, 1 for like, 0 for neutral
    }
}, {
    tableName: 'UserBooks',
    timestamps: false
});

module.exports=UserBooks;
