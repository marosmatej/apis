const express = require('express');
const { authenticate } = require('../middlewares/auth');
const { getAllBooks } = require('../controllers/bookController');
const router = express.Router();

router.get('/', authenticate, getAllBooks);

module.exports = router;

