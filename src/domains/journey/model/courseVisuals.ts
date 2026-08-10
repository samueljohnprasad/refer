import type { ImageSourcePropType } from "react-native";

const COURSE_IMAGE_SOURCES: Record<string, ImageSourcePropType> = {
  anxiety: require("@/assets/images/panda/panda-anxiety.png"),
  "sleep-reset": require("@/assets/images/panda/panda-yet-sleep-pillow.png"),
};

export function getCourseImageSource(
  iconUrl: string | null | undefined,
): ImageSourcePropType | null {
  if (typeof iconUrl !== "string") return null;

  return COURSE_IMAGE_SOURCES[iconUrl.trim()] ?? null;
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
