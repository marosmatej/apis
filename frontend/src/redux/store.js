import { configureStore } from '@reduxjs/toolkit'
import booksApi from './features/books/booksApi'

import reccomendationApi from './features/books/RecApi'

import { AdminApi } from './AdminApi';

export const store = configureStore({
  reducer: {
    [booksApi.reducerPath]: booksApi.reducer,
    [reccomendationApi.reducerPath]: reccomendationApi.reducer,
    [AdminApi.reducerPath]: AdminApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(booksApi.middleware, AdminApi.middleware, reccomendationApi.middleware),
})
