import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import BookCard from '../books/BookCard';

const BookPageSlider = ({ books, breakpoints }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [bookChunks, setBookChunks] = useState([]);
  const booksPerPage = 10; // Number of books per page

  useEffect(() => {
    // Divide books into chunks for each page
    const chunks = [];
    for (let i = 0; i < books.length; i += booksPerPage) {
      chunks.push(books.slice(i, i + booksPerPage));
    }
    setBookChunks(chunks);
  }, [books]);

  const loadMore = () => {
    if (currentPage < bookChunks.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div>
      {/* Render all visible pages */}
      {bookChunks.slice(0, currentPage).map((chunk, index) => (
        <div key={index} className="mb-10">
          <Swiper
            slidesPerView={1}
            spaceBetween={30}
            navigation={true}
            pagination={{ clickable: true }}
            breakpoints={breakpoints}
            modules={[Pagination, Navigation]}
            className="mySwiper"
          >
            {chunk.map((book) => (
              <SwiperSlide key={book.book_id}>
                <BookCard book={book} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ))}
      {/* Load More Button */}
      {currentPage < bookChunks.length && (
        <button
          onClick={loadMore}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Load More
        </button>
      )}
      {currentPage >= bookChunks.length && (
        <p className="mt-6 text-gray-500">No more books to load.</p>
      )}
    </div>
  );
};

export default BookPageSlider;
