// domains/journey/data/journeyApi.ts
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
  EnrolledCourseListItem,
  CourseCatalogListItem,
  CourseStatus,
} from "@/src/types/journeyV5";
import type {
  StartV1LearningSessionArgs,
  V1LearningSessionResult,
} from "@/src/types/journeyLearning";
import { V1NodeSessionKindEnum } from "@/src/types/journeyLearning";
import { callEdgeFunction, EDGE_FUNCTION_URLS } from "@/src/lib/supabase/edgeFunctions";
import { resolveCourseExerciseCategory } from "@/src/domains/journey/learning/courseExerciseCategoryResolver";
import { saveMockNodeLearningEvidence } from "@/src/domains/journey/learning/mockLearningEvidenceStore";
import { isCourseExerciseCategory } from "@/src/types/courseExercises";

import catalogData from "@/src/data/mock/course-catalog.json";
import { sleepResetFlatData } from "@/src/data/mock/sleep-reset-flat";
import { getMockCatalogCourses } from "./courseCatalogMock";

// Toggle this to use the mock JSON data instead of the backend
const USE_MOCK = true;
const mockSleepResetData = sleepResetFlatData;

export const journeyApi = createApi({
  reducerPath: "journeyApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: [
    "CourseTree",
    "CourseProgress",
    "EnrolledCourses",
    "NodeExercises",
  ],

  endpoints: (builder) => ({
    // ── READ: enrolled course ids ───────────────────────────────────────────
    /**
     * Returns the list of courseIds the user is enrolled in.
     * Uses Supabase direct query — no Edge Function needed for a simple SELECT.
     */
    getEnrolledCourseIds: builder.query<string[], void>({
      providesTags: ["EnrolledCourses"],
      queryFn: async () => {
        if (USE_MOCK) {
          return { data: ["sleep-reset"] };
        }

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

    /**
     * Returns enrolled courses with the metadata needed by the journeys header.
     * Uses direct Supabase queries to keep the payload small and avoid loading
     * every course tree up front.
     */
    getEnrolledCourses: builder.query<EnrolledCourseListItem[], void>({
      providesTags: ["EnrolledCourses"],
      queryFn: async () => {
        if (USE_MOCK) {
          return {
            data: catalogData.filter((c) => c.id === "sleep-reset").map((c) => ({
              ...c,
              iconUrl: c.icon_url,
              colorHex: c.color_hex,
              orderIndex: c.order_index,
              status: "in_progress",
              startedAt: new Date().toISOString(),
            })) as EnrolledCourseListItem[],
          };
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: progressRows, error: progressError } = await (supabase as any)
          .from("user_course_progress")
          .select("course_id, started_at, status")
          .order("started_at", { ascending: true });

        if (progressError) {
          return {
            error: { status: "CUSTOM_ERROR", error: progressError.message },
          };
        }

        const enrollmentRows = ((progressRows ?? []) as Array<{
          course_id: string;
          started_at: string | null;
          status: CourseStatus;
        }>).filter((row) => Boolean(row.course_id));

        const courseIds = enrollmentRows.map((row) => row.course_id);
        if (courseIds.length === 0) {
          return { data: [] };
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: courseRows, error: courseError } = await (supabase as any)
          .from("courses")
          .select("id, title, description, icon_url, color_hex, order_index")
          .in("id", courseIds);

        if (courseError) {
          return {
            error: { status: "CUSTOM_ERROR", error: courseError.message },
          };
        }

        const courseById = new Map(
          ((courseRows ?? []) as Array<{
            id: string;
            title: string;
            description: string;
            icon_url: string | null;
            color_hex: string;
            order_index: number;
          }>).map((course) => [course.id, course]),
        );

        const enrolledCourses = enrollmentRows
          .map((row): EnrolledCourseListItem | null => {
            const course = courseById.get(row.course_id);
            if (!course) {
              return null;
            }

            return {
              id: course.id,
              title: course.title,
              description: course.description,
              iconUrl: course.icon_url,
              colorHex: course.color_hex,
              orderIndex: course.order_index,
              status: row.status,
              startedAt: row.started_at,
            };
          })
          .filter(
            (course): course is EnrolledCourseListItem => course !== null,
          );

        return { data: enrolledCourses };
      },
    }),

    /**
     * Returns every published course for the add-course catalog.
     * Uses a direct Supabase query because only course metadata is needed up
     * front; the full journey tree is not part of the catalog response.
     */
    getCourseCatalog: builder.query<CourseCatalogListItem[], void>({
      queryFn: async () => {
        if (USE_MOCK) {
          return {
            data: getMockCatalogCourses(),
          };
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
          .from("courses")
          .select("id, title, description, icon_url, color_hex, order_index")
          .eq("is_published", true)
          .order("order_index", { ascending: true });

        if (error) {
          return { error: { status: "CUSTOM_ERROR", error: error.message } };
        }

        const courses = ((data ?? []) as Array<{
          id: string;
          title: string;
          description: string;
          icon_url: string | null;
          color_hex: string;
          order_index: number;
        }>).map((course) => ({
          id: course.id,
          title: course.title,
          description: course.description,
          iconUrl: course.icon_url,
          colorHex: course.color_hex,
          orderIndex: course.order_index,
          metadata: null,
        }));

        return { data: courses };
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
        if (USE_MOCK) {
          return { data: mockSleepResetData };
        }
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
        if (USE_MOCK) {
          return {
            data: {
              courseProgress: {
                userId: "mock",
                courseId,
                status: "in_progress",
                startedAt: new Date().toISOString(),
                completedAt: null,
              },
              nodeProgressMap: {},
            },
          };
        }
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

    // ── READ: node learning session ─────────────────────────────────────────
    /** Mock-only exercise session boundary. */
    startLearningSession: builder.query<
      V1LearningSessionResult,
      StartV1LearningSessionArgs
    >({
      providesTags: (_, __, { nodeId }) => [{ type: "NodeExercises", id: nodeId }],
      queryFn: async ({ nodeId }) => {
        const nodeExercises = mockSleepResetData.exercises.filter(
          (exercise) => exercise.nodeId === nodeId,
        );

        if (nodeExercises.length === 0) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: `No exercises found for node ${nodeId}.`,
            },
          };
        }

        const exerciseIds = nodeExercises
          .filter((exercise) => {
            const category = resolveCourseExerciseCategory(exercise);
            return category !== null && isCourseExerciseCategory(category);
          })
          .map((exercise) => exercise.id);

        if (exerciseIds.length !== nodeExercises.length) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: `Node ${nodeId} contains unsupported exercise categories.`,
            },
          };
        }

        return {
          data: {
            kind: V1NodeSessionKindEnum.V1Session,
            nodeId,
            sessionId: `mock:${nodeId}`,
            exerciseIds,
            requiredResolvedItemCount: exerciseIds.length,
            source: "mock",
          },
        };
      },
    }),

    // ── MUTATION: start course (auto-enroll) ────────────────────────────────
    /**
     * Creates user_course_progress for the course.
     * Idempotent — safe to call even if already started.
     */
    startCourse: builder.mutation<StartCourseResponse, string>({
      invalidatesTags: (_, __, courseId) => [
        { type: "CourseProgress", id: courseId },
        "EnrolledCourses",
      ],
      queryFn: async (courseId) => {
        if (USE_MOCK) {
          return {
            data: {
              courseProgressId: "mock",
              firstNodeId: "n1",
              alreadyStarted: true,
            },
          };
        }
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
     * Marks a node as completed and returns the next node in sequence.
     * Invalidates CourseProgress — triggers a refetch to reflect new statuses.
     */
    completeNode: builder.mutation<CompleteNodeResponse, CompleteNodeArgs>({
      invalidatesTags: (_, __, { courseId }) => [
        { type: "CourseProgress", id: courseId },
      ],
      queryFn: async ({ nodeId, courseId, responses = {} }) => {
        if (USE_MOCK) {
          saveMockNodeLearningEvidence({
            courseId,
            nodeId,
            responses,
            completedAt: new Date().toISOString(),
          });

          return {
            data: {
              nodeId,
              nextNodeId: null, // simplified mock
              unitCompleted: false,
              sectionCompleted: false,
              courseCompleted: false,
            },
          };
        }
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
  useGetEnrolledCoursesQuery,
  useGetCourseCatalogQuery,
  useGetCourseTreeQuery,
  useGetCourseProgressQuery,
  useStartLearningSessionQuery,
  useStartCourseMutation,
  useCompleteNodeMutation,
} = journeyApi;
