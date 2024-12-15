import React from 'react';
import { useGetRecommendationsQuery } from '../../redux/features/books/RecApi';
import { useFetchAllBooksQuery } from '../../redux/features/books/booksApi';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import BookPageSlider from './BookPageSlider';

const Recommended = () => {
  const {
    data: recommendedData,
    error: recommendedError,
    isFetching: isFetchingRecommendations,
  } = useGetRecommendationsQuery(1); // Replace 1 with dynamic user ID if needed

  const {
    data: booksData,
    error: booksError,
    isFetching: isFetchingBooks,
  } = useFetchAllBooksQuery({ page: 1, limit: 100 });

  if (recommendedError || booksError) {
    return <div>Error loading data. Please try again later.</div>;
  }

  if (isFetchingRecommendations || isFetchingBooks) {
    return <div>Loading...</div>;
  }

  const recommendedBooks = recommendedData || [];
  const books = booksData?.books || [];

  return (
    <div className="py-16">
      <div className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">Personalized Recommendations</h2>
        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 40 },
            1024: { slidesPerView: 2, spaceBetween: 50 },
            1180: { slidesPerView: 3, spaceBetween: 50 },
          }}
        >
          {recommendedBooks.map((bookId) => (
            <SwiperSlide key={bookId}>
              <div className="p-4 border rounded-lg shadow">
                <p>Book ID: {bookId}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div>
        <h2 className="text-3xl font-semibold mb-6">Recommended for you</h2>
        <BookPageSlider
          books={books}
          breakpoints={{
            640: { slidesPerView: 1, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 40 },
            1024: { slidesPerView: 2, spaceBetween: 50 },
            1180: { slidesPerView: 3, spaceBetween: 50 },
          }}
        />
      </div>
    </div>
  );
};

export default Recommended;
