import { supabase } from "@/src/network/auth/supabase";
import { V1NodeSessionKindEnum } from "@/src/types/journeyLearning";
import type {
  CourseCatalogListItem,
  CourseStatus,
  EnrolledCourseListItem,
  Exercise,
} from "@/src/types/journeyV5";
import type { V1LearningSessionResult } from "@/src/types/journeyLearning";
import {
  mapCourse,
  mapExercise,
  assertSupportedExercises,
  type CourseRow,
  type ExerciseRow,
  type CourseNodeRow,
} from "./courseServerHelpers";

interface EnrollmentRow {
  course_id: string;
  started_at: string | null;
  status: CourseStatus;
}

const database = supabase as any;

export async function fetchEnrolledCourseIds(): Promise<string[]> {
  const { data, error } = await database
    .from("user_course_progress")
    .select("course_id")
    .order("started_at", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []).map((row: { course_id: string }) => row.course_id);
}

export async function markServerCourseFinaleSeen(
  courseId: string,
): Promise<void> {
  const { error } = await database
    .from("user_course_progress")
    .update({ finale_seen_at: new Date().toISOString() })
    .eq("course_id", courseId);

  if (error) throw new Error(error.message);
}

export async function fetchEnrolledCourses(): Promise<
  EnrolledCourseListItem[]
> {
  const enrollments = await fetchEnrollmentRows();
  if (enrollments.length === 0) return [];

  const courses = await fetchCoursesById(
    enrollments.map((row) => row.course_id),
  );
  const courseById = new Map(courses.map((course) => [course.id, course]));

  return enrollments.flatMap((enrollment) => {
    const course = courseById.get(enrollment.course_id);
    if (!course) return [];

    return [
      {
        ...mapCourse(course),
        status: enrollment.status,
        startedAt: enrollment.started_at,
      },
    ];
  });
}

export async function fetchCourseCatalog(): Promise<CourseCatalogListItem[]> {
  const { data, error } = await database
    .from("courses")
    .select("id, title, description, icon_url, color_hex, order_index")
    .eq("is_published", true)
    .order("order_index", { ascending: true });

  if (error) throw new Error(error.message);
  return ((data ?? []) as CourseRow[]).map(mapCourse);
}

export async function startServerLearningSession(
  courseId: string,
  nodeId: string,
): Promise<V1LearningSessionResult> {
  // ponytail: ensure we never hang infinitely if network drops mid-flight
  return Promise.race([
    (async () => {
      await assertNodeBelongsToCourse(courseId, nodeId);

      const { data, error } = await database
        .from("exercises")
        .select(
          "id, node_id, order_index, type, phase, duration_seconds, scaffold_level, difficulty, is_scored, concept, content",
        )
        .eq("node_id", nodeId)
        .order("order_index", { ascending: true });

      if (error) throw new Error(error.message);

      const exercises = ((data ?? []) as ExerciseRow[]).map(mapExercise);
      if (exercises.length === 0) {
        throw new Error(`No exercises found for node ${nodeId}.`);
      }

      assertSupportedExercises(exercises);

      const sessionResult: V1LearningSessionResult = {
        kind: V1NodeSessionKindEnum.V1Session,
        nodeId,
        sessionId: `server:${nodeId}`,
        exercises,
        requiredResolvedItemCount: exercises.length,
        source: "server",
      };
      return sessionResult;
    })(),
    new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error("Loading learning session timed out. Check your connection.")),
        10000,
      ),
    ),
  ]);
}

export async function fetchCourseExercises(courseId: string): Promise<Exercise[]> {
  const { data, error } = await database
    .from("exercises")
    .select(
      "id, node_id, order_index, type, phase, duration_seconds, scaffold_level, difficulty, is_scored, concept, content, nodes!inner(units!inner(sections!inner(course_id)))",
    )
    .eq("nodes.units.sections.course_id", courseId)
    .order("order_index", { ascending: true });

  if (error) throw new Error(error.message);

  const exercises = ((data ?? []) as ExerciseRow[]).map(mapExercise);
  assertSupportedExercises(exercises);
  return exercises;
}

// ponytail: unenroll from an in-progress course, deleting progress record
export async function unenrollServerCourse(
  courseId: string,
): Promise<{ success: boolean; courseId: string }> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("User must be authenticated to unenroll.");

  const { data: enrollment, error: fetchError } = await database
    .from("user_course_progress")
    .select("status")
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .maybeSingle();

  if (fetchError) throw new Error(fetchError.message);
  if (!enrollment) throw new Error("Course is not enrolled.");
  if (enrollment.status === "completed") {
    throw new Error("Cannot unenroll from a completed course.");
  }

  const { error: deleteError } = await database
    .from("user_course_progress")
    .delete()
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .eq("status", "in_progress");

  if (deleteError) throw new Error(deleteError.message);

  return { success: true, courseId };
}

async function fetchEnrollmentRows(): Promise<EnrollmentRow[]> {
  const { data, error } = await database
    .from("user_course_progress")
    .select("course_id, started_at, status")
    .order("started_at", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as EnrollmentRow[];
}

async function fetchCoursesById(courseIds: string[]): Promise<CourseRow[]> {
  if (courseIds.length === 0) return [];

  const { data, error } = await database
    .from("courses")
    .select("id, title, description, icon_url, color_hex, order_index")
    .in("id", courseIds);

  if (error) throw new Error(error.message);
  return (data ?? []) as CourseRow[];
}

async function fetchCourseNodes(courseId: string): Promise<CourseNodeRow[]> {
  const { data, error } = await database
    .from("nodes")
    .select(
      "id, order_index, units!inner(order_index, sections!inner(order_index, course_id))",
    )
    .eq("units.sections.course_id", courseId);

  if (error) throw new Error(error.message);
  return (data ?? []) as CourseNodeRow[];
}

async function assertNodeBelongsToCourse(courseId: string, nodeId: string) {
  const { data, error } = await database
    .from("nodes")
    .select("id, units!inner(sections!inner(course_id))")
    .eq("id", nodeId)
    .eq("units.sections.course_id", courseId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("Node does not belong to this course.");
}
