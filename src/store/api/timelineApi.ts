import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { supabase } from '../../network/auth/supabase';

// Defines the expected response shape from our edge function
export interface TimelineEntry {
  date: string;
  aiInsight: any | null;
}

export const timelineApi = createApi({
  reducerPath: 'timelineApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Timeline'],
  endpoints: (builder) => ({
    
    // 1. Fetch Paginated Timeline Data
    getDailyTimeline: builder.query<{ data: TimelineEntry[] }, { page: number; pageSize: number }>({
      queryFn: async ({ page, pageSize }) => {
        try {
          const res = await supabase.functions.invoke(`get-timeline-daily?page=${page}&pageSize=${pageSize}`, {
            method: 'GET'
          });
          if (res.error) throw res.error;
          return { data: res.data };
        } catch (error: any) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        }
      },
      providesTags: (result) => 
        result 
          ? [
              ...result.data.map(({ date }) => ({ type: 'Timeline' as const, id: `daily-${date}` })),
              { type: 'Timeline', id: 'DAILY-LIST' },
            ]
          : [{ type: 'Timeline', id: 'DAILY-LIST' }],
    }),

    generateDailyInsight: builder.mutation<{ data: any }, { date: string }>({
      queryFn: async ({ date }) => {
        try {
          const { data, error } = await supabase.functions.invoke('generate-daily-ai', {
            body: { date }
          });
          if (error) throw error;
          return { data };
        } catch (error: any) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        }
      },
      invalidatesTags: (result, error, { date }) => [{ type: 'Timeline', id: `daily-${date}` }],
    }),

    getWeeklyTimeline: builder.query<{ data: TimelineEntry[] }, { page: number; pageSize: number }>({
      queryFn: async ({ page, pageSize }) => {
        try {
          const res = await supabase.functions.invoke(`get-timeline-weekly?page=${page}&pageSize=${pageSize}`, {
            method: 'GET'
          });
          if (res.error) throw res.error;
          return { data: res.data };
        } catch (error: any) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        }
      },
      providesTags: (result) => 
        result 
          ? [
              ...result.data.map(({ date }) => ({ type: 'Timeline' as const, id: `weekly-${date}` })),
              { type: 'Timeline', id: 'WEEKLY-LIST' },
            ]
          : [{ type: 'Timeline', id: 'WEEKLY-LIST' }],
    }),

    generateWeeklyInsight: builder.mutation<{ data: any }, { date: string }>({
      queryFn: async ({ date }) => {
        try {
          const { data, error } = await supabase.functions.invoke('generate-weekly-ai', {
            body: { date }
          });
          if (error) throw error;
          return { data };
        } catch (error: any) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        }
      },
      invalidatesTags: (result, error, { date }) => [{ type: 'Timeline', id: `weekly-${date}` }],
    }),

    getMonthlyTimeline: builder.query<{ data: TimelineEntry[] }, { page: number; pageSize: number }>({
      queryFn: async ({ page, pageSize }) => {
        try {
          const res = await supabase.functions.invoke(`get-timeline-monthly?page=${page}&pageSize=${pageSize}`, {
            method: 'GET'
          });
          if (res.error) throw res.error;
          return { data: res.data };
        } catch (error: any) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        }
      },
      providesTags: (result) => 
        result 
          ? [
              ...result.data.map(({ date }) => ({ type: 'Timeline' as const, id: `monthly-${date}` })),
              { type: 'Timeline', id: 'MONTHLY-LIST' },
            ]
          : [{ type: 'Timeline', id: 'MONTHLY-LIST' }],
    }),

    generateMonthlyInsight: builder.mutation<{ data: any }, { date: string }>({
      queryFn: async ({ date }) => {
        try {
          const { data, error } = await supabase.functions.invoke('generate-monthly-ai', {
            body: { date }
          });
          if (error) throw error;
          return { data };
        } catch (error: any) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        }
      },
      invalidatesTags: (result, error, { date }) => [{ type: 'Timeline', id: `monthly-${date}` }],
    }),

  }),
});

export const { 
  useGetDailyTimelineQuery, 
  useGenerateDailyInsightMutation,
  useGetWeeklyTimelineQuery,
  useGenerateWeeklyInsightMutation,
  useGetMonthlyTimelineQuery,
  useGenerateMonthlyInsightMutation
} = timelineApi;
