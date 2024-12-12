const express = require('express');
const { createBook, updateBook, deleteBook } = require('../controllers/adminBookController');
const { getAllBooks } = require('../controllers/bookController');
const { getUsers, deleteUser, updateRole, searchUsers } =  require('../controllers/adminUserControllers');
const { authenticate } = require('../middlewares/auth');
const router = express.Router();

router.post('/create', authenticate('admin'), createBook );
router.put('/update/:id', authenticate('admin'), updateBook);
router.delete('/delete/:id', authenticate('admin'), deleteBook);
router.get('/read', getAllBooks);

router.get('/users', authenticate('admin'), getUsers);
router.get('/searchUser', authenticate('admin'), searchUsers);
router.put('/updateUser/:id', authenticate('admin'), updateRole);
router.delete('/deleteUser/:id', authenticate('admin'), deleteUser);

module.exports = router;