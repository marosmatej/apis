const express = require('express');
const { authenticate } = require('../middlewares/auth');
const { bookmarkBook, rateBook, getBookmarkedBooks, deleteBookmark } = require('../controllers/userBooksController');
const router = express.Router();


router.post('/:userId/bookmarks/:bookId', authenticate('user'), bookmarkBook);
router.post('/:userId/rate/:bookId', authenticate('user'), rateBook);
router.get('/:userId/bookmarks', authenticate('user'), getBookmarkedBooks);
router.delete('/:userId/bookmarks/:bookId/delete', authenticate('user'), deleteBookmark);

module.exports = router;