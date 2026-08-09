import catalogData from "@/src/data/mock/course-catalog.json";
import type {
  CourseCatalogListItem,
  CourseJourneyPreview,
} from "@/src/types/journeyV5";

type MockCourseMetadata = Exclude<(typeof catalogData)[number]["metadata"], null>;

function mapCourseMetadata(
  courseId: string,
  metadata: MockCourseMetadata | null,
): CourseJourneyPreview | null {
  if (!metadata) return null;

  return {
    courseId,
    sectionCount: metadata.section_count,
    unitCount: metadata.unit_count,
    nodeCount: metadata.node_count,
    estimatedMinutes: metadata.estimated_minutes,
    sections: metadata.sections.map((section) => ({
      id: section.id,
      title: section.title,
      orderIndex: section.order_index,
      unitCount: section.unit_count,
      nodeCount: section.node_count,
    })),
  };
}

export function mapMockCatalogCourse(
  course: (typeof catalogData)[number],
): CourseCatalogListItem {
  return {
    id: course.id,
    title: course.title,
    description: course.description,
    iconUrl: course.icon_url,
    colorHex: course.color_hex,
    orderIndex: course.order_index,
    metadata: mapCourseMetadata(course.id, course.metadata),
  };
}

export function getMockCatalogCourses(): CourseCatalogListItem[] {
  return catalogData.map(mapMockCatalogCourse);
}
