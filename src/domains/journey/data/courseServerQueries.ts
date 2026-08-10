import { supabase } from "@/src/network/auth/supabase";
import { resolveCourseExerciseCategory } from "@/src/domains/journey/learning/courseExerciseCategoryResolver";
import { isCourseExerciseCategory } from "@/src/types/courseExercises";
import { V1NodeSessionKindEnum } from "@/src/types/journeyLearning";
import type {
  CourseCatalogListItem,
  CourseStatus,
  EnrolledCourseListItem,
  Exercise,
} from "@/src/types/journeyV5";
import type { V1LearningSessionResult } from "@/src/types/journeyLearning";

interface EnrollmentRow {
  course_id: string;
  started_at: string | null;
  status: CourseStatus;
}

interface CourseRow {
  id: string;
  title: string;
  description: string | null;
  icon_url: string | null;
  color_hex: string;
  order_index: number;
}

interface ExerciseRow {
  id: string;
  node_id: string;
  order_index: number;
  type: string;
  phase: string | null;
  duration_seconds: number | null;
  scaffold_level: number | null;
  difficulty: number | null;
  is_scored: boolean;
  concept: string | null;
  content: Record<string, unknown> | null;
}

interface CourseNodeRow {
  id: string;
  order_index: number;
  units: CourseUnitRelation | CourseUnitRelation[];
}

interface CourseUnitRelation {
  order_index: number;
  sections: CourseSectionRelation | CourseSectionRelation[];
}

interface CourseSectionRelation {
  order_index: number;
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

  return {
    kind: V1NodeSessionKindEnum.V1Session,
    nodeId,
    sessionId: `server:${nodeId}`,
    exercises,
    requiredResolvedItemCount: exercises.length,
    source: "server",
  };
}

export async function fetchCourseExercises(
  courseId: string,
): Promise<Exercise[]> {
  const courseNodes = await fetchCourseNodes(courseId);
  if (courseNodes.length === 0) return [];

  const { data, error } = await database
    .from("exercises")
    .select(
      "id, node_id, order_index, type, phase, duration_seconds, scaffold_level, difficulty, is_scored, concept, content",
    )
    .in(
      "node_id",
      courseNodes.map((node) => node.id),
    );

  if (error) throw new Error(error.message);

  const nodeOrder = buildNodeOrder(courseNodes);
  const exercises = ((data ?? []) as ExerciseRow[])
    .map(mapExercise)
    .sort(
      (left, right) =>
        (nodeOrder.get(left.nodeId) ?? 0) -
          (nodeOrder.get(right.nodeId) ?? 0) ||
        left.orderIndex - right.orderIndex,
    );

  assertSupportedExercises(exercises);
  return exercises;
}

async function fetchEnrollmentRows(): Promise<EnrollmentRow[]> {
  const { data, error } = await database
    .from("user_course_progress")
    .select("course_id, started_at, status")
    .order("started_at", { ascending: true });

  if (error) throw new Error(error.message);
  return ((data ?? []) as EnrollmentRow[]).filter((row) => row.course_id);
}

async function fetchCoursesById(courseIds: string[]): Promise<CourseRow[]> {
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

function mapCourse(course: CourseRow) {
  return {
    id: course.id,
    title: course.title,
    description: course.description ?? "",
    iconUrl: course.icon_url,
    colorHex: course.color_hex,
    orderIndex: course.order_index,
  };
}

function mapExercise(row: ExerciseRow): Exercise {
  return {
    id: row.id,
    nodeId: row.node_id,
    orderIndex: row.order_index,
    type: row.type,
    phase: row.phase ?? undefined,
    durationSeconds: row.duration_seconds ?? undefined,
    scaffoldLevel: row.scaffold_level ?? undefined,
    difficulty: row.difficulty,
    isScored: row.is_scored,
    concept: row.concept,
    content: row.content ?? {},
  };
}

function hasSupportedCategory(exercise: Exercise): boolean {
  const category = resolveCourseExerciseCategory(exercise);
  return category !== null && isCourseExerciseCategory(category);
}

function assertSupportedExercises(exercises: Exercise[]): void {
  if (exercises.every(hasSupportedCategory)) return;
  throw new Error("Course contains unsupported exercise categories.");
}

function buildNodeOrder(nodes: CourseNodeRow[]): Map<string, number> {
  return new Map(
    [...nodes].sort(compareCourseNodes).map((node, index) => [node.id, index]),
  );
}

function compareCourseNodes(left: CourseNodeRow, right: CourseNodeRow): number {
  const leftUnit = firstRelation(left.units);
  const rightUnit = firstRelation(right.units);
  const leftSection = firstRelation(leftUnit?.sections);
  const rightSection = firstRelation(rightUnit?.sections);

  return (
    (leftSection?.order_index ?? 0) - (rightSection?.order_index ?? 0) ||
    (leftUnit?.order_index ?? 0) - (rightUnit?.order_index ?? 0) ||
    left.order_index - right.order_index
  );
}

function firstRelation<T>(relation: T | T[] | null | undefined): T | undefined {
  return Array.isArray(relation) ? relation[0] : (relation ?? undefined);
}
