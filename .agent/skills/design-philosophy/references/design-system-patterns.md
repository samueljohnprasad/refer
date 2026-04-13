# Design System Patterns
> Extracted from analyzing computed styles across 83 designer portfolios (198 data points)

This is NOT a list of values to copy. It's a map of the RELATIONSHIPS and SYSTEMS these designers use. The goal is to understand the logic behind their choices so you can build coherent systems for any project.

## Font Pairing Logic

### The Three Roles

Top designers think of fonts in terms of roles, not aesthetics:
1. **Voice** — the primary typeface that carries your content. Must be highly readable, neutral enough to disappear into the text. This is 90% of your typography.
2. **Contrast** — a secondary typeface used sparingly for emphasis, editorial moments, or personality. Creates tension against the voice font.
3. **Technical** — monospace, used for code, data, labels, or to signal precision/technical context.

### Pairing Patterns Found

From 86 sites with 2+ custom fonts:

**Sans-only (46 sites)** — Most common. Uses weight, size, and spacing for hierarchy instead of different typefaces. Examples:
- Inter + Inter Display (body + display variant)
- Geist Regular + Geist SemiBold + Geist Medium
- Aeonik Regular + Aeonik Medium

Why it works: One typeface family guarantees visual consistency. The "display" variant typically has tighter spacing and more personality at large sizes.

**Sans + Mono (20 sites)** — Second most common. The mono font signals "technical" content. Examples:
- Inter + IBM Plex Mono
- Inter + JetBrains Mono
- interVariable + berkeleyMono
- Geist + Geist Mono

Why it works: The structural regularity of monospace creates inherent visual contrast against proportional text. It signals "this is code/data" without needing color or boxes.

**Sans + Serif (18 sites)** — Used for editorial contrast. The serif adds warmth, personality, or classical authority. Examples:
- Inter + Instrument Serif (italic for emphasis within sans body)
- Inter + Libre Baskerville (editorial contrast)
- interVariable + Libre Baskerville (Jakub Krehel — serif italic used only for the word "deeply" in bio)
- Inter Display + Instrument Serif (Charlie Osborne — serif for large section headings)
- Inter + Crimson Pro + Plus Jakarta Sans (Bradley Ziffer)

Why it works: Serif fonts activate a different reading mode. They feel older, more authoritative, more editorial. Used sparingly within sans-serif context, a single serif word or heading creates powerful contrast.

**The 4-font site: Oguz Yagiz** — Inter + Instrument Serif + IBM Plex Mono + SquarePeg
- Inter: body text (voice)
- InstrumentSerif: the word "designer" in gradient — editorial accent
- IBMPlexMono: technical labels
- SquarePeg: likely a playful signature-style accent
Uses only weights 400 and 500. The variety comes from typeface contrast, not weight contrast.

### Why Inter Dominates (65+ sites)

Inter was designed specifically for screens by Rasmus Andersson (whose portfolio we studied). It's not the "safe choice" because designers lack imagination — it's dominant because:
- Excellent readability at small sizes (13-14px)
- Clean at all weights
- Wide character set
- Variable font support (one file, any weight)
- The Display variant adds personality at large sizes
- It "disappears" — lets content speak

### The Decision Framework

When choosing fonts for a project:
1. Start with one font. Add more ONLY when a single family can't express the hierarchy you need.
2. If you need a second font, ask: do I need CONTRAST (serif) or TECHNICAL distinction (mono)?
3. Never mix two fonts that serve the same role (two different sans-serifs fighting for attention).
4. The fewer fonts, the more weight and spacing do the work of hierarchy.

## Type Scale Logic

### The Observed Scale

From analyzing size distributions across all sites:

**Body text range**: 14-16px dominates
- 16px: used by 152 sites (standard web default)
- 14px: used by 112 sites (many designers prefer this — slightly tighter, more "app-like")
- 12px: used by 100 sites (secondary text, labels, metadata)

**Heading range**:
- 24px: 67 sites (most popular heading size — section titles)
- 20px: 42 sites (subsection headings)
- 32px: 26 sites (page-level headings)
- 48px: 24 sites (hero headings)
- 40px: 18 sites (large feature text)
- 64-86px: rare, hero-only

**Average sites use 4.7 different sizes.** Not 12, not 8 — under 5. This is key: restraint in the type scale forces you to use weight, spacing, and color for hierarchy instead of size alone.

### Size Relationships

The most refined sites use scales with clear mathematical or proportional relationships:

**Rauno (rauno.me)**: 13, 14, 16 — three sizes total. Hierarchy through weight (400, 500) and color.

**Fabian Schultz**: 12, 14, 16 — three sizes. One font (Inter). Hierarchy through color (white, gray, muted gray) and weight.

**Jakub Krehel**: 14, 16 — TWO sizes. Hierarchy almost entirely through weight, color, and spacing.

**Drut Design**: 12, 14, 15, 16, 18, 20, 24, 32, 40, 56 — 10 sizes. This is a full marketing site with case studies, so the wider range makes sense.

### The Pattern

- **Portfolios/blogs**: 3-4 sizes is enough. 12/14/16/24.
- **Marketing sites**: 5-7 sizes. Add 32, 40, 48+ for heroes and feature callouts.
- **Complex apps**: Can expand but should still have a defined scale, not arbitrary values.

### Letter Spacing

Negative letter-spacing is almost universal on headings:
- -0.14px to -0.2px: subtle tightening for body-adjacent sizes (very common)
- -0.5px to -1px: moderate tightening for section headings
- -1.5px to -3px: aggressive tightening for large hero text (40px+)

The logic: larger text has more perceived space between characters. Tightening compensates for this optical illusion, making large text feel more solid and intentional.

Positive letter-spacing (0.1-0.4px) is used for:
- Small-caps labels
- Category/tag text
- Uppercase text (which NEEDS tracking to be readable)

### Line Height

The most common values reveal a pattern:
- 24px line-height on 16px text = 1.5 ratio
- 20px line-height on 14px text = ~1.43 ratio
- 28px line-height on 16-18px text = ~1.55-1.75 ratio

For headings, the ratio drops:
- 48px line-height on 40px heading = 1.2 ratio
- 68px line-height on 64px heading = 1.06 ratio

**The rule**: body text needs breathing room (1.4-1.7). Headings need to feel tight and impactful (1.0-1.3). The larger the text, the tighter the line height ratio should be.

### Weight Distribution

From 198 data points:
- **400 only**: 49 sites — hierarchy through size and color alone
- **400, 500**: 47 sites — the most refined choice. 500 is just barely heavier than 400, creating subtle emphasis
- **400, 500, 600**: 24 sites — adds one more level for headings
- **400, 500, 600, 700**: 19 sites — full hierarchy, common on marketing sites

The insight: the best portfolios use FEWER weights. 400 + 500 is enough. The difference between 400 and 500 is subtle but perceptible — it's emphasis without shouting.

Exception: Guglieri uses weight 1000 (Black) for single-word impact in his hero. This works because it's a deliberate extreme used once, not scattered across the page.

## Color Relationship Thinking

### Background-Text Contrast

The median contrast ratio between primary background and primary text across all sites is **0.85** (on a 0-1 luminance scale). This means the best designers maintain high contrast but NOT maximum contrast.

**Why not pure black on pure white?**
- rgb(0,0,0) on rgb(255,255,255) is a contrast ratio of 21:1 — actually too harsh for sustained reading
- The eye fatigues faster with maximum contrast
- Slightly reduced contrast feels more refined and comfortable

### Dark Mode Color Systems

119 sites use dark backgrounds. The average luminance of the darkest background is **0.046** (on 0-1 scale).

What does 0.046 look like? It's NOT pure black. The common values:
- rgb(8, 8, 8) — iker.design — almost black but with just enough to distinguish from browser chrome
- rgb(16, 16, 16) — jakub.kr — gives elements room to go darker for hover states
- rgb(17, 17, 17) — common starting point
- rgb(22, 22, 22) — rauno.me — a slightly warmer dark
- rgb(23, 23, 23) — fabianschultz.com
- rgb(28, 28, 28) — common secondary background

**The logic**: Pure black (#000) has nowhere to go darker for hover states, pressed states, or depth levels. Starting at rgb(16-28) gives you room for a stepped background system:
- Level 0 (deepest): rgb(8-16)
- Level 1 (base surface): rgb(16-28)
- Level 2 (elevated): rgb(28-38)
- Level 3 (interactive): rgb(38-50)

**Text on dark**:
- Primary: rgb(223-237) — NOT pure white, slightly off-white
- Secondary: rgb(150-160) — clearly subordinate
- Tertiary: rgb(100-120) — very muted, for metadata
- Interactive accent: typically one color, often amber/yellow (Fabian uses rgb(245, 158, 11))

### Light Mode Color Systems

40 sites use primarily light backgrounds. Average luminance of lightest background: **0.986**.

Common light background values:
- rgb(255, 255, 255) — pure white, used for primary content areas
- rgb(244-250, 244-250, 244-250) — slightly off-white for page background or secondary sections

**Text on light**:
- Primary: rgb(0-26, 0-26, 0-26) — near-black
- Secondary: rgb(69-105) — medium gray
- Tertiary: rgb(150-160) — light gray for metadata
- The darkest text is rarely pure black — rgb(10-26) is more common and feels less harsh

### Accent Color Philosophy

Accents are used EXTREMELY sparingly. From the data:
- Guglieri: pink (rgb(250,75,189)), yellow (#FFDB00), cyan (rgb(51,187,255)) — but ONLY for interactive sticky notes on the hero, not for UI elements
- Fabian Schultz: amber (rgb(245,158,11)) — only for "New" tags and active states
- Baseline Design: chartreuse (rgb(212,252,82)) — bold accent for CTAs
- Rauno: yellow (rgb(255,255,2)) — reserved for highlights

Most sites use NO accent color at all. The hierarchy is entirely grayscale.

**The decision**: add an accent color only when you have a specific element that MUST draw the eye (CTA button, "new" tag, active state indicator). If everything is important, nothing is.

## Border Radius Systems

### The Universal Values

From 198 data points:
- **8px**: 58 sites — the most universal radius. Works for cards, inputs, buttons.
- **12px**: 41 sites — slightly softer, common for larger cards.
- **16px**: 35 sites — substantial roundness, for featured elements.
- **4px**: 32 sites — subtle, for small elements, code blocks, tags.
- **6px**: 30 sites — between subtle and standard.
- **100px/999px/9999px**: ~60 sites combined — full pill shape for buttons, tags, avatars.

### System Logic

Top designers use 3-5 radius values in a consistent system:

**Minimal (Rauno)**: 8px, 12px — two values. Everything is either "standard" or "prominent."

**Compact (Jakub)**: 2px, 6px, 8px, 12px — four levels from sharp to soft.

**Full (Guglieri)**: 4px, 8px, 16px, 28px, 40px, 50px — wider range for a more expressive design.

**The pattern**: Each step roughly doubles. 4→8→16→32 or 6→12→24. This creates visual consistency because the proportional relationships are maintained.

### The Concentric Rule (Revisited)

From Jakub's research — this is the single most impactful radius detail:
`outer_radius = inner_radius + padding`

This means you can't just pick radius values independently. They must relate to each other based on the spacing between nested elements.

## Shadow Systems

### Shadow Anatomy

The most common shadow found across all sites:
```
rgba(0, 0, 0, 0.12) 0px 2px 8px 0px,
rgba(0, 0, 0, 0.08) 0px 1px 3px 0px
```
This is Guglieri's shadow — two layers:
1. A small, tight shadow (1px offset, 3px blur) for definition
2. A larger, softer shadow (2px offset, 8px blur) for depth

**The 1px ring shadow**: `rgba(255, 255, 255, 0.08) 0px 0px 0px 1px` — used on dark backgrounds, adds a subtle light border that creates glass-like definition. Found on jakub.kr and brianlovin.com.

**Brian Lovin's shadow**: `rgba(255, 255, 255, 0.04) 0px 0px 0px 0.5px inset, rgba(255, 255, 255, 0.04) 0px 1px 0px 0px inset` — inner glow effect with two inset shadows at very low opacity (4%). Creates a subtle raised glass appearance.

### Shadow Logic

- Dark mode: use rgba(255,255,255, very low opacity) for subtle light edges instead of dark shadows
- Light mode: use multi-layered rgba(0,0,0) shadows at low opacity (0.03-0.18)
- Interactive states: darken shadow slightly on hover, don't change the offset
- Shadows should be SO subtle that removing them barely changes the appearance — but you feel the difference

## Transition Systems

### The Common Patterns

From analyzing transitions across all sites:
- `color 0.15s cubic-bezier(0.4, ...)` — 16 sites use this exact Tailwind-style transition
- `color 0.2s` — 19 sites
- `opacity 0.15s` — 16 sites
- `opacity 0.2s` — 11 sites
- `background-color 0.15s` / `background-color 0.2s` — very common

### The Logic

Two timing categories:
1. **0.15s** — for micro-interactions: hover color change, opacity shifts, border highlights
2. **0.2s** — for slightly larger state changes: background transitions, elevation changes

Properties to transition:
- `color` — text hover states
- `opacity` — showing/hiding, hover emphasis
- `background-color` — button/card hover
- `border-color` — input focus
- `transform` — scale on press, position changes
- `box-shadow` — elevation changes

Properties NOT to transition:
- `width`/`height` — causes layout thrash
- `padding`/`margin` — causes layout thrash
- `all` — transitions everything including things that shouldn't animate

### Backdrop Blur Levels

Sites that use backdrop blur (26%) typically use a RANGE of blur values:

**Charlie Osborne**: 0.5, 0.5625, 1.125, 2.25, 4.5, 9, 18, 36px — a doubling progression!
**Drut Design**: 0.078125, 0.15625, 0.3125, 0.625, 1.25, 2.5, 5, 10px — another doubling progression
**Oguz Yagiz**: 1, 2, 3, 6, 12px

The doubling pattern (each level is 2x the previous) creates a natural depth-of-field effect where closer elements are sharp and further elements progressively blur.

## Design Token Categories

From analyzing CSS custom property naming patterns:
- `--line-*` (128 properties) — line heights defined as tokens
- `--font-*` (58) — font families
- `--type-*` (56) — typography scale definitions
- `--color-*` (54) — color palette
- `--ease-*` (42) — easing curve definitions
- `--letter-*` (34) — letter spacing scale
- `--background-*` / `--foreground-*` (55 combined) — semantic color roles
- `--space-*` / `--spacing-*` (37 combined) — spacing scale
- `--accent-*` (19) — accent color variations

**The insight**: the best sites define easing curves as tokens, not just colors. Having `--ease-out-expo` or `--ease-spring` as reusable values ensures motion consistency across the entire interface.
