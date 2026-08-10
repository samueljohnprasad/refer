import type {
  GetCourseTreeResponse,
  Node,
  Section,
  Unit,
} from "@/src/types/journeyV5";

export interface CourseOverviewLesson {
  id: string;
  title: string;
  estimatedMinutes: number;
}

export interface CourseOverviewUnit {
  id: string;
  title: string;
  lessons: CourseOverviewLesson[];
}

export interface CourseOverviewSection {
  id: string;
  title: string;
  description: string | null;
  orderIndex: number;
  units: CourseOverviewUnit[];
  lessonCount: number;
}

export interface CourseOverview {
  id: string;
  title: string;
  description: string;
  iconUrl: string | null;
  sectionCount: number;
  unitCount: number;
  lessonCount: number;
  totalDurationWeeks: number | null;
  sessionsPerWeek: number | null;
  sections: CourseOverviewSection[];
}

export function buildCourseOverview(
  tree: GetCourseTreeResponse,
): CourseOverview {
  const unitsBySection = groupUnitsBySection(tree.units);
  const nodesByUnit = groupNodesByUnit(tree.nodes);
  const sections = [...tree.sections]
    .sort(compareOrder)
    .map((section) =>
      buildOverviewSection(section, unitsBySection, nodesByUnit),
    );

  return {
    id: tree.course.id,
    title: tree.course.title,
    description: tree.course.description,
    iconUrl: tree.course.iconUrl ?? null,
    sectionCount: sections.length,
    unitCount: tree.units.length,
    lessonCount: tree.nodes.length,
    totalDurationWeeks: tree.course.totalDurationWeeks ?? null,
    sessionsPerWeek: tree.course.sessionsPerWeek ?? null,
    sections,
  };
}

function buildOverviewSection(
  section: Section,
  unitsBySection: Map<string, Unit[]>,
  nodesByUnit: Map<string, Node[]>,
): CourseOverviewSection {
  const units = (unitsBySection.get(section.id) ?? []).map((unit) => ({
    id: unit.id,
    title: unit.title,
    lessons: (nodesByUnit.get(unit.id) ?? []).map((node) => ({
      id: node.id,
      title: node.title,
      estimatedMinutes: node.estimatedMins,
    })),
  }));

  return {
    id: section.id,
    title: section.title,
    description: section.narrativeHook ?? getFirstObjective(section),
    orderIndex: section.orderIndex,
    units,
    lessonCount: units.reduce(
      (total, unit) => total + unit.lessons.length,
      0,
    ),
  };
}

function groupUnitsBySection(units: Unit[]): Map<string, Unit[]> {
  const groupedUnits = new Map<string, Unit[]>();
  for (const unit of [...units].sort(compareOrder)) {
    const sectionUnits = groupedUnits.get(unit.sectionId) ?? [];
    sectionUnits.push(unit);
    groupedUnits.set(unit.sectionId, sectionUnits);
  }
  return groupedUnits;
}

function groupNodesByUnit(nodes: Node[]): Map<string, Node[]> {
  const groupedNodes = new Map<string, Node[]>();
  for (const node of [...nodes].sort(compareOrder)) {
    const unitNodes = groupedNodes.get(node.unitId) ?? [];
    unitNodes.push(node);
    groupedNodes.set(node.unitId, unitNodes);
  }
  return groupedNodes;
}

function getFirstObjective(section: Section): string | null {
  const objective = Object.values(section.objectives ?? {}).find(
    (value) => typeof value === "string" && value.trim().length > 0,
  );
  return objective ?? null;
}

function compareOrder(
  left: { orderIndex: number },
  right: { orderIndex: number },
): number {
  return left.orderIndex - right.orderIndex;
}
