import type { ImageSourcePropType } from "react-native";

const COURSE_IMAGE_SOURCES: Record<string, ImageSourcePropType> = {
  // Quieting the Storm (Anxiety)
  anxiety: require("@/assets/images/panda/panda-anxiety-storm.png"),
  "anxiety-storm": require("@/assets/images/panda/panda-anxiety-storm.png"),
  "quieting-the-storm": require("@/assets/images/panda/panda-anxiety-storm.png"),

  // Finding Light Again (Mood)
  mood: require("@/assets/images/panda/panda-finding-light.png"),
  "finding-light": require("@/assets/images/panda/panda-finding-light.png"),
  "finding-light-again": require("@/assets/images/panda/panda-finding-light.png"),

  // Steady Under Pressure (Stress)
  stress: require("@/assets/images/panda/panda-steady-pressure.png"),
  "steady-pressure": require("@/assets/images/panda/panda-steady-pressure.png"),
  "steady-under-pressure": require("@/assets/images/panda/panda-steady-pressure.png"),

  // Coming Home to Yourself (Self Understanding)
  "self-understanding": require("@/assets/images/panda/panda-coming-home.png"),
  "self_understanding": require("@/assets/images/panda/panda-coming-home.png"),
  "coming-home": require("@/assets/images/panda/panda-coming-home.png"),
  "coming-home-to-yourself": require("@/assets/images/panda/panda-coming-home.png"),

  // Sleep Reset (Sleep)
  sleep: require("@/assets/images/panda/panda-yet-sleep-pillow.png"),
  "sleep-reset": require("@/assets/images/panda/panda-yet-sleep-pillow.png"),
};

// ponytail: direct map with keyword fallback for robust course art resolution
export function getCourseImageSource(
  iconUrl: string | null | undefined,
): ImageSourcePropType | null {
  if (typeof iconUrl !== "string") return null;

  const key = iconUrl.trim().toLowerCase();
  if (COURSE_IMAGE_SOURCES[key]) {
    return COURSE_IMAGE_SOURCES[key];
  }

  // Keyword-based fallback if passed title or non-standard key
  if (key.includes("storm") || key.includes("anxiety")) {
    return COURSE_IMAGE_SOURCES["anxiety-storm"];
  }
  if (key.includes("light") || key.includes("mood")) {
    return COURSE_IMAGE_SOURCES["finding-light"];
  }
  if (key.includes("pressure") || key.includes("steady") || key.includes("stress")) {
    return COURSE_IMAGE_SOURCES["steady-pressure"];
  }
  if (key.includes("home") || key.includes("yourself") || key.includes("understanding")) {
    return COURSE_IMAGE_SOURCES["coming-home"];
  }
  if (key.includes("sleep")) {
    return COURSE_IMAGE_SOURCES["sleep-reset"];
  }

  return null;
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
