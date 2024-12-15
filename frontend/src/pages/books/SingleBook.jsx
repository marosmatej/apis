import React, { useState } from 'react';
import { FiHeart } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { useFetchBookByIdQuery, useAddBookmarkMutation, useRateBookMutation } from '../../redux/features/books/booksApi';

const SingleBook = () => {
    const { id } = useParams();
    const { data: book, isLoading, isError } = useFetchBookByIdQuery(id);
    const [addBookmark, { isLoading: isBookmarking }] = useAddBookmarkMutation();
    const [rateBook] = useRateBookMutation();

    const [rating, setRating] = useState(0);
    const [isRating, setIsRating] = useState(false);

    const handleAddToBookmarks = async () => {
        try {
            const userId = 7; // Replace with dynamic user ID if available
            await addBookmark({ userId, bookId: id }).unwrap();
            alert('Book added to bookmarks!');
        } catch (error) {
            console.error('Failed to add bookmark:', error);
        }
    };

    const handleRateBook = async () => {
        if (!rating) {
            alert('Please select a rating before submitting.');
            return;
        }

        try {
            setIsRating(true);
            const userId = 11; // Replace with dynamic user ID if available

            await rateBook({ userId, bookId: id, rating }).unwrap();
            alert(`Book rated ${rating} stars!`);
        } catch (error) {
            console.error('Failed to rate book:', error);
        } finally {
            setIsRating(false);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error happened while loading book info</div>;

    // Fallback values for null fields
    const title = book.title || "Field is empty";
    const authors = book.authors || "Field is empty";
    const publicationYear = book.original_publication_year || "Field is empty";
    const description = book.description || "No description available";
    const imageUrl = book.image_url || "https://via.placeholder.com/150";
    const averageRating = book.average_rating !== null && book.average_rating !== null
        ? book.average_rating.toFixed(2)
        : "Field is empty";

    return (
        <div className="max-w-lg shadow-md p-5">
            <h1 className="text-2xl font-bold mb-6">{title}</h1>

            <div>
                <div>
                    <img
                        src={imageUrl}
                        alt={title}
                        className="mb-8"
                    />
                </div>

                <div className="mb-5">
                    <p className="text-gray-700 mb-2"><strong>Author:</strong> {authors}</p>
                    <p className="text-gray-700 mb-4">
                        <strong>Published:</strong> {publicationYear}
                    </p>
                    <p className="text-gray-700">
                        <strong>Description:</strong> {description}
                    </p>
                    <p className="text-gray-700">
                        <strong>Average Rating:</strong> {averageRating}
                    </p>
                </div>

                <button
                    onClick={handleAddToBookmarks}
                    disabled={isBookmarking}
                    className="btn-primary px-6 space-x-1 flex items-center gap-1 mb-4"
                >
                    <FiHeart />
                    <span>{isBookmarking ? 'Adding...' : 'Add to Bookmarks'}</span>
                </button>

                {/* Rating Section */}
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Rate this book:</label>
                    <select
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="shadow border rounded w-full py-2 px-3 mb-4 focus:outline-none focus:shadow-outline"
                    >
                        <option value={0}>Select Rating</option>
                        <option value={1}>1 Star</option>
                        <option value={2}>2 Stars</option>
                        <option value={3}>3 Stars</option>
                        <option value={4}>4 Stars</option>
                        <option value={5}>5 Stars</option>
                    </select>
                    <button
                        onClick={handleRateBook}
                        disabled={isRating}
                        className="btn-primary px-6"
                    >
                        {isRating ? 'Submitting...' : 'Submit Rating'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SingleBook;
