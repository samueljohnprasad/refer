/**
 * Unified Design Palette — Single Source of Truth
 *
 * All color values used across the app.
 * Components SHOULD prefer Tailwind classes (e.g. `text-gray-900`) wherever
 * possible. Use these constants only where an inline `style` or third-party
 * prop (e.g. icon `color`) requires a raw hex value.
 */

// ─── Brand ──────────────────────────────────────────────────────────
export const BRAND = {
  /** Core brand purple — primary actions, accents */
  purple: '#7B61FF',
  /** Light lavender — backgrounds, hover states */
  lavenderLight: '#E7E5FB',
  /** Soft background gradient start */
  skyA: '#F6F4FF',
  /** Gradient end / clean white */
  skyB: '#FFFFFF',
  /** Deep ink text */
  ink: '#2E285A',
} as const;

// ─── Semantic ───────────────────────────────────────────────────────
export const SEMANTIC = {
  /** Streak fire, warm actions */
  amber: '#F59E0B',
  /** Goal, target accent (violet-500) */
  goalAccent: '#8B5CF6',
  /** Apple system gray */
  systemGray: '#8E8E93',
  /** Success green */
  success: '#059669',
  /** Error / danger */
  danger: '#EF4444',
} as const;

// ─── Mood Colors ────────────────────────────────────────────────────
export const MOOD = {
  terrible: { color: '#FF6B6B', bg: '#FFE5E5' },
  bad:      { color: '#FFA94D', bg: '#FFF3E5' },
  okay:     { color: '#FFD43B', bg: '#FFF9E5' },
  good:     { color: '#69DB7C', bg: '#E5F9E5' },
  great:    { color: '#74C0FC', bg: '#E5F3FF' },
} as const;

// ─── Surface / Background ──────────────────────────────────────────
export const SURFACE = {
  /** Main app background */
  background: '#F2F2F7',   // offwhite
  /** Card surface */
  card: '#FFFFFF',
  /** Subtle card border */
  border: '#F3F4F6',       // gray-100
} as const;

// ─── Gradients ──────────────────────────────────────────────────────
export const GRADIENTS = {
  /** Discovery card prompt background */
  prompt: [BRAND.skyA, BRAND.skyB] as const,
  /** Featured journaling card (Softened for contrast) */
  featured: ['#F0FBFC', '#E0F7FA', '#F0FBFC'] as const,
  /** XP badge highlight */
  xpHighlight: ['#F59E0B', '#D97706'] as const,
} as const;

// ─── Convenience re-export for compatibility ────────────────────────
/** @deprecated Use BRAND / SEMANTIC / SURFACE directly instead */
export const PALETTE = {
  ...BRAND,
  ...SEMANTIC,
  white: '#FFFFFF',
  softBackground: BRAND.skyA,
  lightPurple: '#DCD6FF',
  yellow: '#FFD24A',
  lightYellow: '#FFF2CC',
  blue: '#60A6FF',
  lightBlue: '#DFF0FF',
  pink: '#FFDFE8',
  grey: '#C4C4C4',
  green: '#65A30D',
  lavender: '#C4B5FD',
  fireWarm: SEMANTIC.amber,
} as const;
