import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  fetchCourseCatalog,
  fetchCourseExercises,
  fetchEnrolledCourseIds,
  fetchEnrolledCourses,
  startServerLearningSession,
} from "@/src/domains/journey/data/courseServerQueries";
import {
  callEdgeFunction,
  EDGE_FUNCTION_URLS,
} from "@/src/lib/supabase/edgeFunctions";
import type {
  CompleteNodeArgs,
  CompleteNodeResponse,
  CourseCatalogListItem,
  EnrolledCourseListItem,
  Exercise,
  GetCourseProgressResponse,
  GetCourseTreeResponse,
  StartCourseResponse,
} from "@/src/types/journeyV5";
import type {
  StartV1LearningSessionArgs,
  V1LearningSessionResult,
} from "@/src/types/journeyLearning";
import { createLogger } from "@/src/lib/logger";

type QueryError = { status: "CUSTOM_ERROR"; error: string };
type LogContext = Record<string, string | number | boolean | undefined>;

const log = createLogger("JourneyAPI");
const COUNTED_RESULT_FIELDS = [
  "sections",
  "units",
  "nodes",
  "exercises",
] as const;

async function runServerQuery<T>(
  operation: string,
  request: () => Promise<T>,
  context: LogContext = {},
) {
  const startedAt = Date.now();
  log.info("request_started", { operation, ...context });

  try {
    const data = await request();
    log.info("request_succeeded", {
      operation,
      ...context,
      ...summarizeResult(data),
      durationMs: Date.now() - startedAt,
    });
    return { data };
  } catch (error) {
    log.error("request_failed", {
      operation,
      ...context,
      error: getErrorMessage(error),
      durationMs: Date.now() - startedAt,
    });
    return { error: toQueryError(error) };
  }
}

function summarizeResult(result: unknown): LogContext {
  if (Array.isArray(result)) return { resultCount: result.length };
  if (!result || typeof result !== "object") return {};

  const record = result as Record<string, unknown>;
  const counts: LogContext = {};
  for (const field of COUNTED_RESULT_FIELDS) {
    if (Array.isArray(record[field]))
      counts[`${field}Count`] = record[field].length;
  }
  if (record.nodeProgressMap && typeof record.nodeProgressMap === "object") {
    counts.progressCount = Object.keys(record.nodeProgressMap).length;
  }
  return counts;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function toQueryError(error: unknown): QueryError {
  return {
    status: "CUSTOM_ERROR",
    error: error instanceof Error ? error.message : String(error),
  };
}

export const journeyApi = createApi({
  reducerPath: "journeyApi",
  baseQuery: fakeBaseQuery<QueryError>(),
  tagTypes: [
    "CourseTree",
    "CourseProgress",
    "EnrolledCourses",
    "NodeExercises",
    "CourseExercises",
  ],
  endpoints: (builder) => ({
    getEnrolledCourseIds: builder.query<string[], void>({
      providesTags: ["EnrolledCourses"],
      queryFn: () =>
        runServerQuery("enrolled_course_ids", fetchEnrolledCourseIds),
    }),

    getEnrolledCourses: builder.query<EnrolledCourseListItem[], void>({
      providesTags: ["EnrolledCourses"],
      queryFn: () => runServerQuery("enrolled_courses", fetchEnrolledCourses),
    }),

    getCourseCatalog: builder.query<CourseCatalogListItem[], void>({
      queryFn: () => runServerQuery("course_catalog", fetchCourseCatalog),
    }),

    getCourseExercises: builder.query<Exercise[], string>({
      providesTags: (_, __, courseId) => [
        { type: "CourseExercises", id: courseId },
      ],
      queryFn: (courseId) =>
        runServerQuery(
          "course_exercises",
          () => fetchCourseExercises(courseId),
          { courseId },
        ),
    }),

    getCourseTree: builder.query<GetCourseTreeResponse, string>({
      providesTags: (_, __, courseId) => [{ type: "CourseTree", id: courseId }],
      queryFn: (courseId) =>
        runServerQuery(
          "course_tree",
          () =>
            callEdgeFunction<{ courseId: string }, GetCourseTreeResponse>(
              EDGE_FUNCTION_URLS.getCourseTree,
              { courseId },
            ),
          { courseId },
        ),
    }),

    getCourseProgress: builder.query<GetCourseProgressResponse, string>({
      providesTags: (_, __, courseId) => [
        { type: "CourseProgress", id: courseId },
      ],
      queryFn: (courseId) =>
        runServerQuery(
          "course_progress",
          () =>
            callEdgeFunction<{ courseId: string }, GetCourseProgressResponse>(
              EDGE_FUNCTION_URLS.getCourseProgress,
              { courseId },
            ),
          { courseId },
        ),
    }),

    startLearningSession: builder.query<
      V1LearningSessionResult,
      StartV1LearningSessionArgs
    >({
      providesTags: (_, __, { nodeId }) => [
        { type: "NodeExercises", id: nodeId },
      ],
      queryFn: ({ courseId, nodeId }) =>
        runServerQuery(
          "learning_session",
          () => startServerLearningSession(courseId, nodeId),
          { courseId, nodeId },
        ),
    }),

    startCourse: builder.mutation<StartCourseResponse, string>({
      invalidatesTags: (_, __, courseId) => [
        { type: "CourseProgress", id: courseId },
        "EnrolledCourses",
      ],
      queryFn: (courseId) =>
        runServerQuery(
          "start_course",
          () =>
            callEdgeFunction<{ courseId: string }, StartCourseResponse>(
              EDGE_FUNCTION_URLS.startCourse,
              { courseId },
            ),
          { courseId },
        ),
    }),

    completeNode: builder.mutation<CompleteNodeResponse, CompleteNodeArgs>({
      invalidatesTags: (_, __, { courseId }) => [
        { type: "CourseProgress", id: courseId },
      ],
      queryFn: (args) =>
        runServerQuery(
          "complete_node",
          () =>
            callEdgeFunction<CompleteNodeArgs, CompleteNodeResponse>(
              EDGE_FUNCTION_URLS.completeNode,
              args,
            ),
          {
            courseId: args.courseId,
            nodeId: args.nodeId,
            responseCount: Object.keys(args.responses ?? {}).length,
          },
        ),
    }),
  }),
});

export const {
  useGetEnrolledCourseIdsQuery,
  useGetEnrolledCoursesQuery,
  useGetCourseCatalogQuery,
  useGetCourseExercisesQuery,
  useGetCourseTreeQuery,
  useGetCourseProgressQuery,
  useStartLearningSessionQuery,
  useStartCourseMutation,
  useCompleteNodeMutation,
} = journeyApi;
