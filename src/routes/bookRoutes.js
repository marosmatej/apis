const express = require('express');
const { authenticate } = require('../middlewares/auth');
const { getAllBooks, getBookById, searchBooks} = require('../controllers/bookController');
const router = express.Router();

router.get('/', authenticate('user'), getAllBooks);
router.get('/search/:id', authenticate('user'), getBookById);
router.get('/search/', authenticate('user'), searchBooks)

module.exports = router;

