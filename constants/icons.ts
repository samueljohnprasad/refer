/**
 * Icon Size Scale — Standardized icon dimensions
 *
 * Use these instead of arbitrary pixel sizes across the app.
 * Based on 8pt grid with intermediate sizes for flexibility.
 */
export const ICON_SIZE = {
  /** 14px — badges, inline indicators */
  xs: 14,
  /** 18px — small buttons, card icons */
  sm: 18,
  /** 22px — standard icons, navigation */
  md: 22,
  /** 28px — featured icons, section headers */
  lg: 28,
  /** 36px — hero icons, primary actions */
  xl: 36,
} as const;

export type IconSize = keyof typeof ICON_SIZE;
