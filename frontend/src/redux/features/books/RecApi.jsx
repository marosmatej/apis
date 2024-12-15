import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import getModelUrl from '../../../utils/getModelUrl' 

// Define the base URL for the API
const baseUrl = getModelUrl();

export const reccomendationApi = createApi({
  reducerPath: 'recApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    // Endpoint to rate a book
    rateBook: builder.mutation({
      query: (body) => ({
        url: '/rate',
        method: 'POST',
        body,
      }),
    }),

    // Endpoint to get recommendations
    getRecommendations: builder.query({
      query: (userId) => `/recommend?user_id=${userId}`,
    }),

    // Endpoint to update user preferences
    updatePreferences: builder.mutation({
      query: (body) => ({
        url: '/preferences',
        method: 'POST',
        body,
      }),
    }),

    // Endpoint to get a bundle of recommended books
    getRecommendationBundle: builder.query({
      query: (userId) => `/recommend_bundle?user_id=${userId}`,
    }),
  }),
});

// Export hooks for using the endpoints
export const {
  useRateBookMutation,
  useGetRecommendationsQuery,
  useUpdatePreferencesMutation,
  useGetRecommendationBundleQuery,
} = reccomendationApi;

export default reccomendationApi;