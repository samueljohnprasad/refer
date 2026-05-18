// features/journey/journeyApi.ts
// RTK Query API for all Journey Map server calls.
// getCourseTree and getCourseProgress use Edge Functions (single round trip each).
// getEnrolledCourseIds uses Supabase JS client directly (simple SELECT, no Edge Function needed).
// Mutations use Edge Functions via callEdgeFunction.

import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

import { supabase } from "@/src/network/auth/supabase";

import type {
  GetCourseTreeResponse,
  GetCourseProgressResponse,
  StartCourseResponse,
  CompleteNodeArgs,
  CompleteNodeResponse,
} from "@/src/types/journeyV5";
import { callEdgeFunction, EDGE_FUNCTION_URLS } from "@/src/lib/supabase/edgeFunctions";

export const journeyApi = createApi({
  reducerPath: "journeyApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["CourseTree", "CourseProgress", "EnrolledCourses"],

  endpoints: (builder) => ({
    // ── READ: enrolled course ids ───────────────────────────────────────────
    /**
     * Returns the list of courseIds the user is enrolled in.
     * Uses Supabase direct query — no Edge Function needed for a simple SELECT.
     */
    getEnrolledCourseIds: builder.query<string[], void>({
      providesTags: ["EnrolledCourses"],
      queryFn: async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
          .from("user_course_progress")
          .select("course_id")
          .order("started_at", { ascending: true });

        if (error)
          return { error: { status: "CUSTOM_ERROR", error: error.message } };

        const ids = (data ?? []).map(
          (row: { course_id: string }) => row.course_id,
        );
        return { data: ids };
      },
    }),

    // ── READ: course tree (cached aggressively) ─────────────────────────────
    /**
     * Fetches the full content tree for a course: course + sections + units + nodes.
     * Long-lived cache — only invalidated on content republish.
     */
    getCourseTree: builder.query<GetCourseTreeResponse, string>({
      providesTags: (_, __, courseId) => [{ type: "CourseTree", id: courseId }],
      queryFn: async (courseId) => {
        try {
          const data = await callEdgeFunction<
            { courseId: string },
            GetCourseTreeResponse
          >(EDGE_FUNCTION_URLS.getCourseTree, { courseId });
          return { data };
        } catch (error) {
          return { error: { status: "CUSTOM_ERROR", error: String(error) } };
        }
      },
    }),

    // ── READ: course progress (short cache, invalidated after mutations) ────
    /**
     * Fetches user course progress + node progress map for a course.
     * Invalidated by startCourse.
     */
    getCourseProgress: builder.query<GetCourseProgressResponse, string>({
      providesTags: (_, __, courseId) => [
        { type: "CourseProgress", id: courseId },
      ],
      queryFn: async (courseId) => {
        try {
          const data = await callEdgeFunction<
            { courseId: string },
            GetCourseProgressResponse
          >(EDGE_FUNCTION_URLS.getCourseProgress, { courseId });
          return { data };
        } catch (error) {
          return { error: { status: "CUSTOM_ERROR", error: String(error) } };
        }
      },
    }),

    // ── MUTATION: start course (auto-enroll) ────────────────────────────────
    /**
     * Creates user_course_progress + unlocks the first node.
     * Idempotent — safe to call even if already started.
     */
    startCourse: builder.mutation<StartCourseResponse, string>({
      invalidatesTags: (_, __, courseId) => [
        { type: "CourseProgress", id: courseId },
      ],
      queryFn: async (courseId) => {
        try {
          const data = await callEdgeFunction<
            { courseId: string },
            StartCourseResponse
          >(EDGE_FUNCTION_URLS.startCourse, { courseId });
          return { data };
        } catch (error) {
          return { error: { status: "CUSTOM_ERROR", error: String(error) } };
        }
      },
    }),

    // ── MUTATION: complete node (mark done + unlock next) ───────────────────
    /**
     * Marks a node as completed and unlocks the next node in sequence.
     * Invalidates CourseProgress — triggers a refetch to reflect new statuses.
     */
    completeNode: builder.mutation<CompleteNodeResponse, CompleteNodeArgs>({
      invalidatesTags: (_, __, { courseId }) => [
        { type: "CourseProgress", id: courseId },
      ],
      queryFn: async ({ nodeId, courseId }) => {
        try {
          const data = await callEdgeFunction<
            CompleteNodeArgs,
            CompleteNodeResponse
          >(EDGE_FUNCTION_URLS.completeNode, { nodeId, courseId });
          return { data };
        } catch (error) {
          return { error: { status: "CUSTOM_ERROR", error: String(error) } };
        }
      },
    }),
  }),
});

export const {
  useGetEnrolledCourseIdsQuery,
  useGetCourseTreeQuery,
  useGetCourseProgressQuery,
  useStartCourseMutation,
  useCompleteNodeMutation,
} = journeyApi;
