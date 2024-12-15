import React from "react";
import { useParams } from "react-router-dom";
import { useSearchBooksQuery } from "../../redux/features/books/booksApi";
import BookCard from "../books/BookCard";

const SearchResults = () => {
  const { query } = useParams(); // Use useParams to retrieve the dynamic segment
  const { data: books = [], isLoading, isError } = useSearchBooksQuery(query);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching search results.</div>;

  return (
    <div className="py-8">
      <h1 className="text-2xl font-semibold mb-4">Search Results for "{query}"</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.length > 0 ? (
          books.map((book) => <BookCard key={book.book_id} book={book} />)
        ) : (
          <div>No books found for "{query}".</div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
