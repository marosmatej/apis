import React from 'react';
import { FiHeart, FiTrash } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAddBookmarkMutation, useDeleteBookmarkMutation, useFetchBookmarksQuery } from '../../redux/features/books/booksApi';
import { useAuth } from '../../context/AuthContext';

const BookCard = ({ book, context = 'recommendation', onRemove }) => {
  const { currentUser } = useAuth(); // Access logged-in user data
  const userId = currentUser?.id; // Retrieve user ID dynamically
  console.log('userid', currentUser);

  const [addBookmark] = useAddBookmarkMutation();
  const [deleteBookmark] = useDeleteBookmarkMutation(); // Hook to delete bookmarks
  const { data: bookmarks = [] } = useFetchBookmarksQuery(userId); // Pass dynamic userId

  const isBookmarked = bookmarks.some((b) => b.book_id === book.book_id);

  // Handle the bookmarking action (add or remove bookmark)
  const handleBookmarkAction = async () => {
    if (!userId) {
      alert('You must be logged in to perform this action.');
      return;
    }

    if (isBookmarked) {
      try {
        await deleteBookmark({ userId, bookId: book.book_id }).unwrap();
        alert('Book removed from bookmarks!');
        if (onRemove) {
          onRemove(book.book_id); // Trigger any additional remove action from parent
        }
      } catch (error) {
        console.error('Failed to remove bookmark:', error);
      }
    } else {
      try {
        await addBookmark({ userId, bookId: book.book_id }).unwrap();
        alert('Book added to bookmarks!');
      } catch (error) {
        console.error('Failed to add bookmark:', error);
      }
    }
  };

  const bookTitle = book?.title || 'Field is empty';
  const bookAuthors = book?.authors || 'Field is empty';
  const publicationYear = book?.original_publication_year || 'Field is empty';
  const averageRating =
    book?.average_rating !== null && book?.average_rating !== undefined
      ? book.average_rating.toFixed(2)
      : 'Field is empty';
  const imageUrl = book?.image_url || 'https://via.placeholder.com/150';

  return (
    <div className="rounded-lg transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:h-72 sm:justify-center gap-4">
        <div className="sm:h-72 sm:flex-shrink-0 border rounded-md">
          <Link to={`/books/${book.book_id}`}>
            <img
              src={imageUrl}
              alt={bookTitle}
              className="w-full bg-cover p-2 rounded-md cursor-pointer hover:scale-105 transition-all duration-200"
            />
          </Link>
        </div>
        <div>
          <Link to={`/books/${book.book_id}`}>
            <h3 className="text-xl font-semibold hover:text-blue-600 mb-3">
              {bookTitle}
            </h3>
          </Link>
          <p className="text-gray-600 mb-3">
            <strong>Author:</strong> {bookAuthors}
          </p>
          <p className="text-gray-600 mb-3">
            <strong>Publication Year:</strong> {publicationYear}
          </p>
          <p className="text-gray-600 mb-3">
            <strong>Average Rating:</strong> {averageRating}
          </p>
          <button
            onClick={handleBookmarkAction}
            className={`btn-primary px-6 space-x-1 flex items-center gap-1 ${
              isBookmarked ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isBookmarked ? <FiTrash /> : <FiHeart />}
            <span>{isBookmarked ? 'Remove from Bookmarks' : 'Add to Bookmarks'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
