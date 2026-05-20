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
