// associations.js
const UserBooks = require('./userBooks');
const Book = require('./bookModel');
const User = require('./userModel');

// Define associations here after models are fully loaded
User.hasMany(UserBooks, { foreignKey: 'user_id' });
Book.hasMany(UserBooks, { foreignKey: 'book_id' });
UserBooks.belongsTo(User, { foreignKey: 'user_id' });
UserBooks.belongsTo(Book, { foreignKey: 'book_id' });