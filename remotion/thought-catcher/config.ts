// ponytail: thought-catcher reel — shared geometry, palette, fonts
export const COMP = {
  width: 1080,
  height: 1920,
  fps: 30,
} as const;

export const COLOR = {
  paper: "#EBE7E1",
  ink: "#1E1C1A",
  red: "#D7372C",
  grey: "#8A857E",
  card: "#FBFAF8",
} as const;

/** Google Fonts stack for this composition only — WelcomeHero.tsx loads its
 *  own pair the same way; each composition owns its font link. */
export const FONTS = {
  display: '"Anton", sans-serif',
  caption: '"Instrument Sans", sans-serif',
  captionSerif: '"Instrument Serif", serif',
  mono: '"JetBrains Mono", monospace',
} as const;

export const FONT_CSS_URL =
  "https://fonts.googleapis.com/css2?family=Anton&family=Instrument+Sans:wght@500&family=Instrument+Serif:ital@1&family=JetBrains+Mono:wght@400;700&display=swap";
