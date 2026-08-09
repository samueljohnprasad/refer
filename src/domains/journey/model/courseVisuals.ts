import type { ImageSourcePropType } from "react-native";

const COURSE_IMAGE_SOURCES: Record<string, ImageSourcePropType> = {
  "sleep-reset": require("@/assets/images/panda/panda-yet-sleep-pillow.png"),
};

export function getCourseImageSource(
  courseId: string,
  iconUrl: string | null | undefined,
): ImageSourcePropType | string | null {
  if (COURSE_IMAGE_SOURCES[courseId]) {
    return COURSE_IMAGE_SOURCES[courseId];
  }

  return typeof iconUrl === "string" && /^https?:\/\//.test(iconUrl)
    ? iconUrl
    : null;
}

export function resolveCourseAccentColor(
  colorHex: string | null | undefined,
): string {
  if (!colorHex) {
    return "#1CB0F6";
  }

  return colorHex.startsWith("#") ? colorHex : `#${colorHex}`;
}

export function getCourseMonogram(title: string): string {
  const firstCharacter = title.trim().charAt(0);
  return firstCharacter ? firstCharacter.toUpperCase() : "C";
}
