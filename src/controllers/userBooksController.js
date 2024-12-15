const UserBooks = require('../models/userBooks');
const Book = require('../models/bookModel');

const bookmarkBook = async (req, res) => {
    const { userId, bookId } = req.params;

    try {
        let record = await UserBooks.findOne({ where: { user_id: userId, book_id: bookId } });
        if (!record) {
            // Create a new record if it doesn't exist
            record = await UserBooks.create({ user_id: userId, book_id: bookId, is_bookmarked: true });
        } else {
            // Toggle bookmark status
            record.is_bookmarked = !record.is_bookmarked;
            await record.save();
        }

        res.json({ message: 'Bookmark status updated', is_bookmarked: record.is_bookmarked });
    } catch (error) {
        res.status(500).json({ error: 'Failed to bookmark the book' });
    }
};

const rateBook = async (req, res) => {
    const { userId, bookId } = req.params;
    const { rating } = req.body;

    if (![1, -1].includes(rating)) {
        return res.status(400).json({ error: 'Invalid rating value' });
    }

    try {
        let record = await UserBooks.findOne({ where: { user_id: userId, book_id: bookId } });
        if (!record) {
            // Create a new record if it doesn't exist
            record = await UserBooks.create({ user_id: userId, book_id: bookId, rating });
        } else {
            // Update the rating
            record.rating = rating;
            await record.save();
        }

        res.json({ message: 'Rating updated', rating: record.rating });
    } catch (error) {
        res.status(500).json({ error: 'Failed to rate the book' });
    }
};

const getBookmarkedBooks = async (req, res) => {
    const { userId } = req.params;

    try {
        const bookmarks = await UserBooks.findAll({
            where: { user_id: userId, is_bookmarked: true },
            include: [{ model: Book }]
        });
        console.log(bookmarks)
        res.json(bookmarks.map(b => b.Book)); // Return only book details
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve bookmarks', details: error });
    }
};

const deleteBookmark = async (req, res) => {
    const { userId, bookId } = req.params;

    try {
        // Find the bookmarked record for the user and the book
        const record = await UserBooks.findOne({
            where: { user_id: userId, book_id: bookId, is_bookmarked: true }
        });

        if (!record) {
            // If there's no record or the book isn't bookmarked, return an error message
            return res.status(404).json({ error: 'Bookmark not found or already removed' });
        }

        // Delete the record from the database
        await record.destroy();

        res.json({ message: 'Bookmark removed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove the bookmark', details: error });
    }
};



module.exports = { bookmarkBook, rateBook, getBookmarkedBooks, deleteBookmark }

