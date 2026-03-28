---
name: frontend-design
description: >
  Design and build distinctive, production-grade frontend interfaces with high
  aesthetic quality and working code. Trigger when the user asks to build a
  website, landing page, dashboard, UI component, web app, poster, portfolio,
  admin panel, or any visual interface. Also trigger when the user says
  "make it look good", "style this", "beautify my UI", "redesign this page",
  or "build me a frontend". Produces clean, functional, visually memorable
  code in HTML/CSS/JS, React, Vue, Svelte, or any requested framework.
  Avoids generic AI aesthetics — every output has a clear, intentional
  design direction.
version: "1.0.0"
author: ecocee
license: MIT
tags: [frontend, ui, design, react, html, css, components, landing-page, dashboard]
---

# Frontend Design

A skill for building distinctive, production-grade frontend interfaces with
genuine aesthetic direction. Every output is intentional, cohesive, and
visually memorable — not generic.

Compatible with: Claude, Claude Code, VS Code agent extensions, Cursor,
Windsurf, Antigravity, and any agent that supports the Agent Skills standard.

---

## Process

Follow this sequence on every frontend request.

### Step 1 — Understand the Context

Before writing a single line of code, answer these internally:

- **Purpose** — What problem does this interface solve? What action should a user take?
- **Audience** — Who is the user? Their expectations shape the aesthetic.
- **Tone** — What feeling should this produce? (See Aesthetic Directions below.)
- **Constraints** — Framework, accessibility requirements, performance targets, existing design system?
- **Memorability** — What is the one thing a user will remember about this interface?

### Step 2 — Commit to an Aesthetic Direction

Pick one direction and execute it with precision. Half-committed design is always worse than a bold wrong choice. Some directions to consider:

| Direction | Character |
|---|---|
| Brutally minimal | Maximum whitespace, one font weight, monochrome, zero decoration |
| Editorial / magazine | Strong typographic hierarchy, columns, pull quotes, grid-breaking |
| Retro-futuristic | Scanlines, glows, monospace, terminal-inspired, neon on dark |
| Organic / natural | Soft curves, earthy palette, texture, handwritten or slab type |
| Luxury / refined | Tight tracking, serif display, muted gold or black, deliberate restraint |
| Brutalist / raw | Visible structure, clashing scale, intentional ugliness as design |
| Playful / toy-like | Thick borders, saturated colour, bouncy motion, rounded geometry |
| Art deco / geometric | Symmetry, ornament, repeated motifs, high contrast |
| Industrial / utilitarian | Functional layout, data-dense, monospace, subdued palette |
| Maximalist | Layered type, competing textures, controlled chaos, every pixel used |

Do not default to any of these — use them as departure points. The final direction must feel designed specifically for this context.

### Step 3 — Design Decisions Before Code

Define these before opening a code block:

- **Font pairing** — One distinctive display font, one refined body font. Never Inter, Roboto, Arial, or system fonts.
- **Colour palette** — Two to four colours maximum. One dominant, one sharp accent. Define as CSS custom properties.
- **Layout structure** — Grid, asymmetry, overlap, diagonal flow, or controlled density. Avoid default stacked-card layouts.
- **Motion** — Identify one high-impact animation moment (page load reveal, hover state, scroll trigger). One well-executed animation beats ten scattered micro-interactions.
- **Atmosphere** — Background treatment: gradient mesh, noise texture, geometric pattern, layered transparency, grain overlay, or dramatic shadow. Never a flat solid colour unless the concept demands it.

### Step 4 — Write Production-Grade Code

Implement the design with the following standards.

**Code quality**
- Functional and complete — no placeholder comments, no TODO, no stub logic
- Responsive across mobile, tablet, and desktop
- Accessible — semantic HTML, keyboard navigable, sufficient colour contrast
- Performant — no unnecessary repaints, efficient selectors, lazy loading where appropriate

**CSS**
- Use CSS custom properties for all colours, spacing, and type scales
- Animate only `transform` and `opacity` (compositor-friendly)
- Never `transition: all` — list properties explicitly
- Respect `prefers-reduced-motion` for all animations
- Use `focus-visible` for keyboard focus styles — never remove outline without a replacement

**Typography**
- Load fonts from Google Fonts, Bunny Fonts, or equivalent (prefer variable fonts)
- Set a clear type scale — at minimum: display, heading, body, caption
- Apply `text-wrap: balance` on headings
- Use `font-variant-numeric: tabular-nums` for any numbers or data

**Motion**
- CSS-only for HTML/CSS output
- Use `animation-delay` for staggered reveals on page load
- Hover and focus states must have visible, intentional transitions
- Scroll-triggered effects where they add genuine value

**Framework-specific**
- React: use hooks correctly; prefer CSS modules or Tailwind if available; no inline styles for layout
- Vue / Svelte: scoped styles; reactive data for any interactive state
- Plain HTML: single file output unless otherwise requested; embed all CSS in a `<style>` block

---

## Aesthetic Rules

### Always

- Commit fully to one design direction — no hedging
- Make every spacing decision intentional — generous negative space or controlled density, never accidental middle ground
- Create atmosphere in backgrounds — depth, texture, or gradient over flat colour
- Vary between light and dark themes across outputs — never default to one
- Let the font choice carry personality — it is the loudest design decision

### Never

- Generic font families: Inter, Roboto, Arial, system-ui, or plain sans-serif as a primary font
- Purple gradients on white backgrounds — the most overused AI-generated aesthetic
- Default card-grid layouts with drop shadows and rounded corners applied without thought
- Evenly distributed colour palettes with no dominant colour
- Space Grotesk, DM Sans, Plus Jakarta Sans, or any other overused startup font
- Scattered micro-interactions with no focal animation moment
- Flat solid colour backgrounds where there is space for more
- Cookie-cutter designs that could belong to any project

---

## Output Format

Produce complete, working code. Structure the response as follows:

1. One sentence stating the aesthetic direction chosen and why it fits the context — no heading, no bullet list.
2. Complete code block — the full implementation, ready to run or paste.
3. Font and dependency note — list any external fonts or libraries used and how to load them, if not already included in the code.

Do not include lengthy design breakdowns, feature lists, or bullet-point summaries of what was built. The code speaks for itself.

---

## Examples

### Example 1: Landing page

User: "Build a landing page for an embedded systems consultancy"
Agent: Chooses an industrial/utilitarian direction — dark background, monospace font, tight grid, amber accent, terminal-inspired hero animation. Outputs a single complete HTML file.

### Example 2: Dashboard

User: "Create a data dashboard for IoT sensor readings"
Agent: Chooses a refined minimal direction — high data density, tabular numerics, muted palette with a single red alert colour, clean geometric sans-serif, subtle grid lines. Outputs a React component.

### Example 3: Redesign request

User: "Make my signup form look better"
Agent: Asks for the existing code or a description of the current design, then applies a clear aesthetic direction — does not simply add padding and border-radius.

### Example 4: Component

User: "Build a pricing card component"
Agent: Chooses a direction (e.g. luxury/refined), pairs a serif display font with a geometric body font, uses a two-colour palette, adds a single hover lift animation, outputs a complete standalone component.

---

## Notes

- Match implementation complexity to the aesthetic. Maximalist designs require elaborate code. Minimalist designs require restraint and precision — not less effort, different effort.
- If the user specifies a framework, use it. If not, default to plain HTML/CSS/JS for maximum compatibility.
- If the user provides brand colours, fonts, or an existing design system, work within those constraints while still making intentional choices within them.
- This skill produces working code — not wireframes, not mockups, not design descriptions.
