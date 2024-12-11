const express = require('express');
const { authenticate } = require('../middlewares/auth');
const { getAllBooks, getBookById, searchBooks} = require('../controllers/bookController');
const router = express.Router();

router.get('/', authenticate, getAllBooks);
router.get('/search/:id', authenticate, getBookById);
router.get('/search/', authenticate, searchBooks)

module.exports = router;

