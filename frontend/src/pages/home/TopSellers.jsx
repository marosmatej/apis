import React, { useState, useEffect } from 'react';
import BookPageSlider from './BookPageSlider';
import { useFetchBookmarksQuery } from '../../redux/features/books/booksApi';
import { useAuth } from '../../context/AuthContext'; // Import the useAuth hook

const categories = ["Choose a genre", "Business", "Fiction", "Horror", "Adventure"];

const TopSellers = () => {
  const { currentUser } = useAuth(); // Access current user data from the context
  const [selectedCategory, setSelectedCategory] = useState("Choose a genre");
  const { data: books = [], isLoading, error } = useFetchBookmarksQuery(currentUser ? currentUser.id : null); // Use dynamic user ID

  const filteredBooks =
    selectedCategory === "Choose a genre"
      ? books
      : books.filter((book) => book.category?.toLowerCase() === selectedCategory.toLowerCase());

  useEffect(() => {
    if (!currentUser) {
      // Handle scenario when user is not logged in
      alert('Please log in to view bookmarks');
    }
  }, [currentUser]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data</div>;

  return (
    <div className="py-10">
      <h2 className="text-3xl font-semibold mb-6">Top Sellers</h2>
      <div className="mb-8 flex items-center">
        <select
          onChange={(e) => setSelectedCategory(e.target.value)}
          name="category"
          id="category"
          className="border bg-[#EAEAEA] border-gray-300 rounded-md px-4 py-2 focus:outline-none"
        >
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <BookPageSlider
        books={filteredBooks}
        breakpoints={{
          640: { slidesPerView: 1, spaceBetween: 20 },
          768: { slidesPerView: 2, spaceBetween: 40 },
          1024: { slidesPerView: 2, spaceBetween: 50 },
          1180: { slidesPerView: 3, spaceBetween: 50 },
        }}
      />
    </div>
  );
};

export default TopSellers;
