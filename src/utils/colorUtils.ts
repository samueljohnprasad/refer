/**
 * Color Utilities
 *
 * Lightweight hex color manipulation functions for generating
 * shadow colors, tints, and shades without external dependencies.
 */

/**
 * Darken a hex color by a given factor (0–1).
 * Factor 0 = no change, factor 1 = pure black.
 *
 * @param hex - 6-digit hex color string (e.g. "#58CC02")
 * @param factor - Darkening factor between 0 and 1. Default: 0.2
 * @returns Darkened hex color string
 */
export function darkenHex(hex: string, factor: number = 0.2): string {
    const cleaned: string = hex.replace('#', '');
    const r: number = Math.max(0, Math.round(parseInt(cleaned.slice(0, 2), 16) * (1 - factor)));
    const g: number = Math.max(0, Math.round(parseInt(cleaned.slice(2, 4), 16) * (1 - factor)));
    const b: number = Math.max(0, Math.round(parseInt(cleaned.slice(4, 6), 16) * (1 - factor)));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Lighten a hex color by a given factor (0–1).
 * Factor 0 = no change, factor 1 = pure white.
 *
 * @param hex - 6-digit hex color string (e.g. "#58CC02")
 * @param factor - Lightening factor between 0 and 1. Default: 0.2
 * @returns Lightened hex color string
 */
export function lightenHex(hex: string, factor: number = 0.2): string {
    const cleaned: string = hex.replace('#', '');
    const r: number = Math.min(255, Math.round(parseInt(cleaned.slice(0, 2), 16) + (255 - parseInt(cleaned.slice(0, 2), 16)) * factor));
    const g: number = Math.min(255, Math.round(parseInt(cleaned.slice(2, 4), 16) + (255 - parseInt(cleaned.slice(2, 4), 16)) * factor));
    const b: number = Math.min(255, Math.round(parseInt(cleaned.slice(4, 6), 16) + (255 - parseInt(cleaned.slice(4, 6), 16)) * factor));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
