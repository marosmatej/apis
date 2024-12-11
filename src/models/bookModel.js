const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

const Book = sequelize.define('Book', {
    book_id: { type: DataTypes.INTEGER, primaryKey: true },
    goodreads_book_id: { type: DataTypes.INTEGER },
    best_book_id: { type: DataTypes.INTEGER },
    work_id: { type: DataTypes.INTEGER },
    books_count: { type: DataTypes.INTEGER },
    isbn: { type: DataTypes.STRING(20) },
    isbn13: { type: DataTypes.BIGINT },
    authors: { type: DataTypes.STRING },
    original_publication_year: { type: DataTypes.INTEGER },
    original_title: { type: DataTypes.STRING },
    title: { type: DataTypes.STRING },
    language_code: { type: DataTypes.STRING(10) },
    average_rating: { type: DataTypes.FLOAT },
    ratings_count: { type: DataTypes.INTEGER },
    work_ratings_count: { type: DataTypes.INTEGER },
    work_text_reviews_count: { type: DataTypes.INTEGER },
    ratings_1: { type: DataTypes.INTEGER },
    ratings_2: { type: DataTypes.INTEGER },
    ratings_3: { type: DataTypes.INTEGER },
    ratings_4: { type: DataTypes.INTEGER },
    ratings_5: { type: DataTypes.INTEGER },
    image_url: { type: DataTypes.TEXT },
}, {
    timestamps: false, // No createdAt or updatedAt fields
    tableName: 'Books', 
});

module.exports = Book;