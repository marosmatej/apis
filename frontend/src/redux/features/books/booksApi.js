import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import getBaseUrl from '../../../utils/baseURL';

const baseQuery = fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api`,
    credentials: 'include',
    prepareHeaders: (Headers) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            Headers.set('Authorization', `Bearer ${token}`);
        }
        return Headers;
    }
});

const booksApi = createApi({
    reducerPath: 'booksApi',
    baseQuery,
    tagTypes: ['Bookmarks'],
    endpoints: (builder) => ({

        fetchBookmarks: builder.query({
            query: (userId) => `/users/${userId}/bookmarks`,
            providesTags: ["Bookmarks"],
        }),

        fetchBookById: builder.query({
            query: (bookId) => `/books/search/${bookId}`,
            providesTags: (result, error, bookId) => [{ type: 'BookDetails', id: bookId }],
        }),

        addBookmark: builder.mutation({
            query: ({ userId, bookId }) => ({
                url: `/users/${userId}/bookmarks/${bookId}`,
                method: 'POST',
            }),
            invalidatesTags: ['Bookmarks'], // Invalidate bookmarks cache to refresh the list after adding
        }),

        // Add deleteBookmark mutation
        deleteBookmark: builder.mutation({
            query: ({ userId, bookId }) => ({
                url: `/users/${userId}/bookmarks/${bookId}/delete`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Bookmarks'], // Invalidate bookmarks cache to refresh the list after removing
        }),

        rateBook: builder.mutation({
            query: ({ userId, bookId, rating }) => ({
                url: `/users/${userId}/rate/${bookId}`,
                method: 'POST',
                body: { rating },
            }),
            invalidatesTags: (result, error, { bookId }) => [{ type: 'BookDetails', id: bookId }],
        }),

        searchBooks: builder.query({
            query: (query) => `/books/search?query=${query}`,
            providesTags: ['SearchResults'],
        }),

        fetchAllBooks: builder.query({
            query: ({ page = 1, limit = 20 } = {}) => `/books/?page=${page}&limit=${limit}`,
            providesTags: ['AllBooks'],
        }),

    }),
});

export const {
    useFetchBookmarksQuery,
    useFetchBookByIdQuery,
    useAddBookmarkMutation,
    useDeleteBookmarkMutation, // Export the deleteBookmark hook
    useRateBookMutation,
    useSearchBooksQuery,
    useFetchAllBooksQuery,
} = booksApi;

export default booksApi;
