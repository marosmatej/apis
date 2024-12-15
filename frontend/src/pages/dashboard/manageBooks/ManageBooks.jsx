import React, { useState } from "react";
import { useGetBooksQuery, useDeleteBookMutation } from "../../../redux/AdminApi";
import EditBookModal from "./EditBookModal";

const BooksList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const { data, error, isLoading } = useGetBooksQuery(currentPage);
  const [deleteBook] = useDeleteBookMutation();

  React.useEffect(() => {
    if (data?.books) {
      setBooks((prevBooks) => [...prevBooks, ...data.books]);
    }
  }, [data]);

  const handleDelete = async (id) => {
    try {
      await deleteBook(id).unwrap();
      alert("Book deleted successfully!");
      setBooks((prevBooks) => prevBooks.filter((book) => book.book_id !== id));
    } catch (err) {
      alert("Failed to delete book.");
    }
  };

  const handleEdit = (book) => {
    setSelectedBook(book); // Open the modal with the selected book data
  };

  const handleSave = (updatedBook) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.book_id === updatedBook.book_id ? { ...book, ...updatedBook } : book
      )
    );
  };

  const loadMore = () => {
    if (data?.currentPage < data?.totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    } else {
      alert("No more books to load.");
    }
  };

  if (isLoading && currentPage === 1) return <p>Loading books...</p>;
  if (error) return <p>Error fetching books: {error.message}</p>;

  return (
    <div>
      <h1>Books List</h1>
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Title</th>
            <th>Authors</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.book_id}>
              <td>{book.book_id}</td>
              <td>
                <img
                  src={book.image_url}
                  alt={book.title}
                  style={{ width: "50px", height: "75px", objectFit: "cover" }}
                />
              </td>
              <td>{book.title}</td>
              <td>{book.authors}</td>
              <td>
                <button onClick={() => handleEdit(book)}>Edit</button>
                <button onClick={() => handleDelete(book.book_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data?.currentPage < data?.totalPages && (
        <button onClick={loadMore} style={{ marginTop: "10px" }}>
          Load More
        </button>
      )}
      {selectedBook && (
        <EditBookModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default BooksList;
