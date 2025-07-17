/**
 * Calculates the perceived brightness of a hex color
 * @param hex Hex color string (with or without #)
 * @returns Brightness value from 0 (darkest) to 255 (lightest)
 */
export const getBrightness = (hex: string): number => {
  let col = hex.replace("#", "");
  if (col.length === 3) {
    col = col.split("").map((c) => c + c).join("");
  }
  const num = parseInt(col, 16);
  const r = num >> 16;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  return (r * 299 + g * 587 + b * 114) / 1000;
};

/**
 * Slightly lightens or darkens a hex color
 * @param hex Hex color string
 * @param amount Amount to adjust (-255 to 255, negative for darker, positive for lighter)
 * @returns Adjusted hex color string
 */
export const adjustColour = (hex: string, amount = -15): string => {
  let usePound = false;
  if (hex[0] === "#") {
    hex = hex.slice(1);
    usePound = true;
  }

  const num = parseInt(hex, 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amount));
  const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amount));

  return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
};
