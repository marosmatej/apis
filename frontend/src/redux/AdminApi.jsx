import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const AdminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://bookstorebackendapis.azurewebsites.net/api/admin/',
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem('authToken'); 
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    
    getUsers: builder.query({
      query: () => 'users',
    }),
    searchUser: builder.query({
      query: (query) => `searchUser?query=${query}`,
    }),
    updateUser: builder.mutation({
      query: (user) => ({
        url: 'updateUser',
        method: 'POST',
        body: user,
      }),
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `deleteUser/${id}`,
        method: 'DELETE',
      }),
    }),


    getBooks: builder.query({
      query: (page = 1) => `read?page=${page}`,
    }),
    deleteBook: builder.mutation({
      query: (id) => ({
        url: `delete/${id}`,
        method: 'DELETE',
      }),
    }),
    updateBook: builder.mutation({
      query: (book) => ({
        url: `update/${book.book_id}`,
        method: 'PUT',
        body: book, 
      }),
    }),

    createBook: builder.mutation({
        query: (book) => ({
        url: 'create',
        method: 'POST',
        body: book,
      }),
    }),
  }),
});


export const {
  useGetUsersQuery,
  useSearchUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetBooksQuery,
  useDeleteBookMutation,
  useUpdateBookMutation,
  useCreateBookMutation,
} = AdminApi;
