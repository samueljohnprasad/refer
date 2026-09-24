import { resolveCourseExerciseCategory } from "@/src/domains/journey/learning/courseExerciseCategoryResolver";
import { isCourseExerciseCategory } from "@/src/types/courseExercises";
import type { CourseCatalogListItem, Exercise } from "@/src/types/journeyV5";

export interface CourseRow {
  id: string;
  title: string;
  description: string | null;
  icon_url: string | null;
  color_hex: string;
  order_index: number;
}

export interface ExerciseRow {
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

export interface CourseNodeRow {
  id: string;
  order_index: number;
  units: CourseUnitRelation | CourseUnitRelation[];
}

export interface CourseUnitRelation {
  order_index: number;
  sections: CourseSectionRelation | CourseSectionRelation[];
}

export interface CourseSectionRelation {
  order_index: number;
}

export function mapCourse(course: CourseRow): CourseCatalogListItem {
  return {
    id: course.id,
    title: course.title,
    description: course.description ?? "",
    iconUrl: course.icon_url,
    colorHex: course.color_hex,
    orderIndex: course.order_index,
  };
}

export function mapExercise(row: ExerciseRow): Exercise {
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

export function hasSupportedCategory(exercise: Exercise): boolean {
  const category = resolveCourseExerciseCategory(exercise);
  return category !== null && isCourseExerciseCategory(category);
}

export function assertSupportedExercises(exercises: Exercise[]): void {
  if (exercises.every(hasSupportedCategory)) return;
  throw new Error("Course contains unsupported exercise categories.");
}

export function buildNodeOrder(nodes: CourseNodeRow[]): Map<string, number> {
  return new Map(
    [...nodes].sort(compareCourseNodes).map((node, index) => [node.id, index]),
  );
}

export function compareCourseNodes(left: CourseNodeRow, right: CourseNodeRow): number {
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

export function firstRelation<T>(relation: T | T[] | null | undefined): T | undefined {
  return Array.isArray(relation) ? relation[0] : (relation ?? undefined);
}
