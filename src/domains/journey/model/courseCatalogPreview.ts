import type {
  CourseJourneyPreview,
  CourseJourneyPreviewSection,
  GetCourseTreeResponse,
} from "@/src/types/journeyV5";

function buildSectionPreview(
  courseTree: GetCourseTreeResponse,
): CourseJourneyPreviewSection[] {
  const unitCountBySection = new Map<string, number>();
  const nodeCountByUnit = new Map<string, number>();

  for (const node of courseTree.nodes) {
    nodeCountByUnit.set(
      node.unitId,
      (nodeCountByUnit.get(node.unitId) ?? 0) + 1,
    );
  }

  const nodeCountBySection = new Map<string, number>();

  for (const unit of courseTree.units) {
    unitCountBySection.set(
      unit.sectionId,
      (unitCountBySection.get(unit.sectionId) ?? 0) + 1,
    );

    nodeCountBySection.set(
      unit.sectionId,
      (nodeCountBySection.get(unit.sectionId) ?? 0) +
        (nodeCountByUnit.get(unit.id) ?? 0),
    );
  }

  return courseTree.sections.map((section) => ({
    id: section.id,
    title: section.title,
    orderIndex: section.orderIndex,
    unitCount: unitCountBySection.get(section.id) ?? 0,
    nodeCount: nodeCountBySection.get(section.id) ?? 0,
  }));
}

export function buildCourseJourneyPreview(
  courseTree: GetCourseTreeResponse,
): CourseJourneyPreview {
  return {
    courseId: courseTree.course.id,
    sectionCount: courseTree.sections.length,
    unitCount: courseTree.units.length,
    nodeCount: courseTree.nodes.length,
    estimatedMinutes: courseTree.nodes.reduce(
      (totalMinutes, node) => totalMinutes + node.estimatedMins,
      0,
    ),
    sections: buildSectionPreview(courseTree),
  };
}
