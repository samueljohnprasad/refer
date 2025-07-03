import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '../constants/api';
import { JobSeekerPost } from '@/types/posts';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  endpoints: (builder) => ({
    getJobSeekerPosts: builder.query<{ posts: JobSeekerPost[] }, any>({
      query: (params) => ({
        url: '/job-seeker-posts',
        params,
      }),
    }),
    // Add more endpoints as needed
  }),
});

export const { useGetJobSeekerPostsQuery } = apiSlice; 