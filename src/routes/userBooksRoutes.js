const express = require('express');
const { authenticate } = require('../middlewares/auth');
const { bookmarkBook, rateBook, getBookmarkedBooks } = require('../controllers/userBooksController');
const router = express.Router();


router.post('/:userId/bookmarks/:bookId', authenticate('user'), bookmarkBook);
router.post('/:userId/rate/:bookId', authenticate('user'), rateBook);
router.get('/:userId/bookmarks', authenticate('user'), getBookmarkedBooks);

module.exports = router;