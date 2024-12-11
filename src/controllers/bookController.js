const Book = require('../models/bookModel')

const getAllBooks = async (req, res) => {
    try {
        const { page=1, limit = 20 } = req.query;
        const offset = ( page-1)*limit;

        const books = await Book.findAndCountAll({
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['average_rating', 'DESC']],
        });

        res.json({
            totalBooks: books.count,
            totalPages: Math.ceil(books.count/limit),
            currentPage: parseInt(page),
            books: books.rows,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch books', details: error.message})
    }
}

// Get a book by ID
const getBookById = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findByPk(id);

        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        res.json(book);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch book', details: error.message });
    }
};

// Search books by title or author
const searchBooks = async (req, res) => {
    try {
        const { query } = req.query; // Example: /search?query=Harry
        if (!query) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        const books = await Book.findAll({
            where: {
                [Op.or]: [
                    { title: { [Op.like]: `%${query}%` } },
                    { authors: { [Op.like]: `%${query}%` } },
                ],
            },
        });

        res.json(books);
    } catch (error) {
        res.status(500).json({ error: 'Failed to search books', details: error.message });
    }
};

module.exports = { getAllBooks, getBookById, searchBooks };