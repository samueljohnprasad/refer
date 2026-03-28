# Product Design Examples

Screenshots of each product are in `references/examples/`. Study them when building similar interfaces. Each entry explains WHAT makes the product's design exceptional, WHAT techniques to learn, and HOW to apply those patterns.

---

## World-Class Product Design Systems

### 1. Linear — The Gold Standard of Product Design
**Screenshots**: `examples/linear-homepage.png`, `examples/linear-features.png`, `examples/linear-method.png`

**Design system**: Inter Variable + Berkeley Mono. Custom variable font weights (510, 590 — not standard 500, 600). One single easing curve everywhere: `cubic-bezier(0.25, 0.46, 0.45, 0.94)`. Transition duration: 0.16s (not the common 0.15 or 0.2 — their own considered choice). Background: rgb(8, 9, 10) — nearly black but not quite.

**What makes it exceptional**:
- **The sidebar**: Compact, icon-driven, hierarchically organized. Workspace name + search at top, then primary nav (Inbox, My Issues, Reviews, Pulse), then workspace sections (Initiatives, Projects), then team-specific views. Favorites section. Each item is tiny (13px text) but perfectly readable.
- **The issue detail view**: Split-panel layout. Left = activity timeline (comments, status changes, AI actions). Right = metadata sidebar (status, priority, assignee, labels, cycle, project). The metadata sidebar uses tiny labels + values, never wasting space.
- **Information density**: Linear packs enormous amounts of information into small space without feeling cramped. The secret: consistent 4px/6px spacing, subtle 1px borders at very low opacity, and using background color shifts instead of heavy borders to separate regions.
- **Color as status**: Status dots (backlog=gray, todo=white, in-progress=yellow, done=purple/green) are the ONLY color in the interface. Everything else is grayscale. This means your eye immediately knows what's active.
- **The marketing site as product demo**: The homepage literally embeds a working product mock — not a static screenshot, but an interactive recreation of the actual app. This is "code-driven visuals" philosophy in action.

**Craft details**:
- 15 keyframe animations on the homepage, yet it feels restrained — most are subtle dot-grid animations
- Brand purple `rgb(94, 106, 210)` used ONLY for accents, never for backgrounds or large areas
- Berkeley Mono for anything technical (issue IDs like ENG-2703, code blocks, git branch names)
- The interactive product demo on the homepage has a fake Slack thread → Linear issue → AI agent workflow. It tells a story.

**Design token system**:
- Backgrounds: rgb(8,9,10) → rgb(16,17,18) → rgb(35,37,42) — three levels
- Text: rgb(247,248,248) primary → rgb(138,143,152) secondary → rgb(98,102,109) muted
- Single accent: rgb(94, 106, 210) — a muted purple, not bright
- All transitions: 0.16s with that one cubic-bezier

**When to apply**: Any productivity tool, project management app, developer tool, or data-heavy interface. Linear's approach — maximum information density with minimum visual noise — is the model for professional SaaS.

---

### 2. Vercel — The Minimal Developer Platform
**Screenshots**: `examples/vercel-homepage.png`, `examples/vercel-docs.png`

**Design system**: Geist (their own typeface) — one font for everything. Only 4 font sizes on the homepage. Only 2 weights (400, 500). Background: rgb(0, 0, 0) (they DO use pure black, unlike most). Text: rgb(237, 237, 237).

**What makes it exceptional**:
- **The spacing token system**: `--geist-space` base unit, then multipliers: 2x, 3x, 4x, 6x, 8x, 10x, 16x, 24x, 32x, 48x, 64x. This isn't linear — it's a logarithmic-ish scale that creates natural hierarchy. Small spacings for tight UI (2x, 3x), medium for sections (8x, 10x), large for page-level breathing (32x, 48x, 64x).
- **Radical typographic restraint**: 3 font sizes in the docs. THREE. They achieve hierarchy through weight (400 vs 500), color (white vs gray), and spacing — not size.
- **The hero**: "Build and deploy on the AI Cloud." Simple centered text, two buttons (Start Deploying, Get a Demo), and below: a GLSL shader visualization. The shader loads AFTER the text paints. Progressive enhancement.
- **Border system**: `rgb(46, 46, 46) 0px 0px 0px 1px` — a 1px ring shadow, not a CSS border. This subtle distinction means the "border" doesn't add to the element's box model.
- **Focus rings**: `rgb(0,0,0) 0px 0px 0px 2px, rgb(82,168,255) 0px 0px 0px 4px` — double ring (black inner, blue outer). The black ring prevents the blue from bleeding into the background.

**The docs**:
- Sidebar navigation with collapsible sections
- Breadcrumb trail at top
- Content area with generous line-height
- Code blocks with syntax highlighting, copy button
- "On this page" right sidebar for long articles
- Three-column layout: nav | content | page outline

**When to apply**: Developer platforms, documentation sites, API products, CLI tools. Vercel's extreme restraint (one font, few sizes, pure black) works when the CONTENT is what matters.

---

### 3. Stripe — Elegant Complexity
**Screenshots**: `examples/stripe-homepage.png`, `examples/stripe-docs.png`

**Design system**: Sohne (custom variable font). Light mode with purple accent `rgb(83, 58, 253)`. Radii: 4px, 5px, 6px — tighter than most (no 8px or 12px). Shadows: multi-layered with rgba(50, 50, 93, 0.25) — a warm purple-tinted shadow, not pure black.

**What makes it exceptional**:
- **The gradient system**: Stripe's homepage uses a signature gradient palette — warm orange/purple/blue that's become iconic. The gradient is IN the product imagery, not on the background.
- **Documentation as product**: Stripe Docs is widely considered the best API documentation ever made. Key patterns:
  - Tab navigation (Get started, Payments, Revenue, Platforms, Money management, Developer resources)
  - "Ask AI" button next to search — AI assistant integrated into docs
  - Inline test card numbers with copy button
  - Three-column categorization (Payments / Revenue / Developers)
  - Color-coded language selectors for code samples
  - Sidebar + content + code example layout for API reference pages
- **The credit card visualization**: On the docs homepage, there's a tilted 3D credit card showing test numbers. This is a code-driven visual — not an image.
- **Purple-tinted shadows**: `rgba(50, 50, 93, 0.25)` creates warmth. Pure black shadows feel cold; tinted shadows feel intentional.
- **Multiple easing curves**: `cubic-bezier(0.45, 0.05, 0.55, 0.95)` for general motion, `cubic-bezier(0.25, 1, 0.5, 1)` for enters (fast start), `cubic-bezier(0.4, 0, 0.2, 1)` (Material's standard curve). Stripe uses different curves for different purposes.

**When to apply**: Financial products, API platforms, documentation-heavy products. Stripe shows that light mode can be just as refined as dark mode when done with intention.

---

### 4. Raycast — The Command-First Interface
**Screenshot**: `examples/raycast-homepage.png`

**Design system**: Inter + Geist Mono + SF Pro. Background: rgb(7, 8, 10) — even darker than Linear. 6 unique shadow styles. Radii: 16px (large cards), 8px (standard), 6px (small). Backdrop blur: 5px, 2px, 36px (three different levels).

**What makes it exceptional**:
- **The command palette as hero**: Raycast's entire identity IS the command palette. The homepage hero shows their actual app — a floating window with search, extensions, AI chat. The "window" uses multiple levels of backdrop blur.
- **Inner glow shadows**: `rgba(255, 255, 255, 0.15) 0px 1px 1px 0px inset` — a subtle white inner shadow on dark elements creates a glass-like effect.
- **Three-level backdrop blur**: 2px (subtle depth), 5px (moderate, for overlays), 36px (heavy, for modal backgrounds). The progression creates clear depth hierarchy.
- **GitHub's easing approach**: `cubic-bezier(0.16, 1, 0.3, 1)` — ease-out-expo. Things enter fast and decelerate dramatically. Also `cubic-bezier(0.65, 0, 0.35, 1)` for symmetric ease-in-out. Both are more dramatic than standard CSS curves.
- **Keyboard-first design**: Everything has a keyboard shortcut. This isn't just UX — it shows in the visual design through shortcut badges, command hints, and the prominence of the search/command input.

**When to apply**: Developer tools, productivity apps, CLI-adjacent products, any tool where power users are the primary audience.

---

### 5. GitHub — Scale with Clarity
**Screenshot**: `examples/github-homepage.png`

**Design system**: Mona Sans (custom, released open-source) + Mona Sans Mono. Weights: 400, 500, 600. Background: rgb(13, 17, 23) — dark blue-black, not pure black. Radii: 3px, 6px, 12px.

**What makes it exceptional**:
- **Duration tokens**: GitHub defines durations as CSS custom properties: `--base-duration-50`, `--base-duration-100`, `--base-duration-200`... up to `--base-duration-1000`. This means motion timing is consistent and adjustable site-wide.
- **Custom easing curves**: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo) for elements entering. `cubic-bezier(0.65, 0, 0.35, 1)` for bidirectional animations. These curves are more expressive than default CSS easings.
- **Multi-layered shadows with color**: `rgba(209, 217, 224, 0.5) 0px 0px 0px 1px, rgba(37, 41, 46, 0.04) 0px 6px 12px -3px` — the first layer is a light 1px ring border, the second is the actual shadow. This two-part system works on both light and dark backgrounds.
- **The homepage as product narrative**: GitHub's homepage tells a story — code editor → AI copilot → collaboration → deployment. Each section uses a live-coded interactive demo, not static screenshots.
- **Warm dark**: rgb(13, 17, 23) has a blue tint — it's not neutral gray-black. This creates a more inviting feeling than pure gray.

**When to apply**: Complex platforms with many features, developer tools, collaborative products, any product that needs to feel "warm" despite being dark.

---

### 6. Notion — Friendly Complexity
**Screenshot**: `examples/notion-homepage.png`

**Design system**: NotionInter (customized Inter). Weights: 400-700. Background: white with warm gray sections rgb(246, 245, 244) and warm accent rgb(252, 248, 245). 10 font sizes (the most of any product studied). Radii: 4px, 8px, 10px, 16px.

**What makes it exceptional**:
- **Warmth through color**: Notion's backgrounds have a warm tint (244, not 245 in the green channel). This tiny shift from neutral gray to warm gray makes the interface feel friendly and approachable.
- **Illustrations as brand**: The hand-drawn style illustrations at the top are not decoration — they're brand identity. They communicate "personal, creative, flexible."
- **Statistics as trust**: "10 workflows | $340 saved | $4,000 saved" — concrete numbers with context.
- **Custom grid properties**: `--grid-column-width`, `--grid-gutter`, `--grid-sm-gutter`, `--grid-columns` — a responsive grid system defined in CSS custom properties.
- **Multiple keyframe patterns**: fadeIn, fadeOut, scaleIn, scaleOut, popIn — a complete motion vocabulary built into the design system.

**When to apply**: Productivity tools for non-technical users, team collaboration tools, content creation platforms. Notion's warmth and friendliness lower the intimidation factor for complex functionality.

---

### 7. Resend — The Developer-Focused Dark Marketing
**Screenshot**: `examples/resend-homepage.png`

**Design system**: Inter + Domaine (serif) + ABC Favorit + Commit Mono. Background: pure rgb(0, 0, 0). 5 sizes, weights 400-600. Radii: 4px, 6px, 8px, 12px, 16px, 24px.

**What makes it exceptional**:
- **Four fonts with purpose**: Inter for body, Domaine for editorial headings (serif contrast), ABC Favorit for UI elements, Commit Mono for code. Each font has a clear role — this is the 4-font system done RIGHT (like Oguzyagiz's portfolio but in a product context).
- **Backdrop blur (25px)**: Heavy blur on overlays creates dramatic depth separation.
- **Alpha-scale color system**: CSS custom properties `--black-a1` through `--black-a10` — a 10-step transparency scale. This is how you build a color system that works on any background: instead of fixed colors, use alpha-layered values.
- **"Email for developers"** — the tagline is above the fold, immediately clear. No ambiguity.
- **Code-first marketing**: The homepage shows actual code snippets (React email templates, API calls) as the primary visual content. The product IS code, so the marketing shows code.

**When to apply**: Developer API products, email services, any SaaS targeted at developers. Resend's approach — dark, code-heavy, serif accent — communicates "built by developers, for developers."

---

### 8. Arc Browser — Playful Brand, Serious Product
**Screenshot**: `examples/arc-homepage.png`

**Design system**: Marlin + Marlin Soft SQ + Exposure VAR + ABC Oracle + InterVariable + ABC Favorit Mono. 5 weights (400-800). 12 font sizes. Background: warm cream rgb(255, 252, 236) with brand blue rgb(49, 57, 251).

**What makes it exceptional**:
- **6 fonts, controlled chaos**: This is the opposite of Vercel's one-font restraint, but it WORKS because each font has a distinct role: Marlin for headlines, Exposure for display, ABC Oracle for technical, Inter for body, etc. The contrast between fonts creates energy and personality.
- **Warm background**: rgb(255, 252, 236) — not white, cream. This signals "friendly, human, different from every other browser."
- **Bold brand color usage**: rgb(49, 57, 251) — a saturated blue used for large areas (hero backgrounds, CTA sections). Most products use accents sparingly; Arc uses them generously because their BRAND is about color and personality.
- **Rounded everything**: 8px, 10px, 22px radii. Everything feels soft and approachable.
- **Section contrast**: Alternates between cream sections and blue sections. This creates the visual rhythm Rauno describes.

**When to apply**: Consumer products, tools that compete on personality, products targeting creative users. Arc proves that professional doesn't mean minimal — you can be expressive and still be refined.

---

### 9. Sonner + Vaul — Component-Level Craft
**Screenshots**: `examples/sonner-component.png`, `examples/vaul-component.png`

**Sonner (Toast)**: Inter + monospace. White background. Radii: 5px, 6px, 8px. Shadow: `rgba(0, 0, 0, 0.1) 0px 4px 12px` + `rgb(23, 23, 23) 0px 0px 0px 1px` (shadow + ring border combo).

**Vaul (Drawer)**: Inter only. Shadow tokens: `--ds-shadow-border`, `--ds-shadow-small`, `--ds-shadow-medium`, `--ds-shadow-large`, `--ds-shadow-tooltip`, `--ds-shadow-menu`, `--ds-shadow-modal`. Keyframes: fadeIn, fadeOut, slideFromBottom, slideToBottom, slideFromTop.

**What makes them exceptional**:
- **Shadow as design tokens**: Vaul defines 10 shadow tokens for different elevation levels. This is how you build a consistent depth system — not ad-hoc shadows per component, but a defined scale.
- **Swipe-to-dismiss keyframes**: Sonner defines `swipe-out-left`, `swipe-out-right`, `swipe-out-up`, `swipe-out-down` — directional exit animations that match the user's gesture direction. This is the "spatial consistency" principle from Rauno's essays in practice.
- **The toast shadow formula**: A soft ambient shadow + a 1px ring border. The ring prevents the toast from "floating" by grounding it to a defined boundary. The shadow creates depth.
- **Documentation as interactive demo**: Both Sonner and Vaul's pages ARE the demo. You click buttons and see the actual component work. Tabs let you try different variants (Default, Description, Success, Error, Warning, etc.).

**When to apply**: Any component library, toast/notification system, drawer/sheet component, modal system. Study these for the shadow tokens, the directional exit animations, and the documentation-as-demo pattern.

---

### 10. Pitch — Bold Product Marketing
**Screenshot**: `examples/pitch-homepage.png`

**Design system**: Eina01 + Mark Pro. Weights: 400, 700, 800. 11 font sizes. Background: white with purple accent rgb(255, 160, 0) — wait, that's orange. Radii: 3px, 6px, 10px, 12px, 20px.

**What makes it exceptional**:
- **Gradient animations**: Custom keyframes for gradient backgrounds (`gradient1`, `gradient2`, `gradient3`) — the hero has a slowly shifting color gradient that draws attention without being distracting.
- **Element slide-in animations**: `style_element-slide-in` keyframe — elements slide into view as you scroll, creating a narrative flow.
- **Heavy font weights**: 700 and 800 used for headlines. This is bolder than most products (which stay at 500-600). Combined with larger sizes (11 unique sizes), Pitch's typography is LOUD — appropriate for a presentation tool.
- **Free template gallery**: The marketing page includes a browsable template gallery — letting users experience the product's output before signing up.

**When to apply**: Creative tools, presentation software, marketing-heavy products. Pitch shows that bold typography and animation can work when the product is about visual creation.

---

## Cross-Product Pattern Library

### Navigation Patterns

**Sidebar Navigation** (Linear, GitHub, Notion, Vercel Docs, Stripe Docs):
- Fixed left sidebar, 240-280px wide
- Collapsible sections with chevron indicators
- Active item highlighted with subtle background
- Scrollable independently from main content
- Often has workspace/team switcher at top

**Top Navigation** (Vercel, Stripe, Raycast, Arc):
- Logo left, primary nav center or left-aligned, auth/CTA right
- Dropdown menus on hover/click for sub-items
- Transparent or blur background that becomes solid on scroll
- Mobile: hamburger menu

**Tab Navigation** (Stripe Docs):
- Horizontal tabs for major sections
- Each tab reveals different content area
- Active tab has bottom border or background fill

### Marketing Page Patterns

**The Product Demo Hero** (Linear, GitHub, Raycast):
- Headline + subtitle + CTA buttons
- Below: an INTERACTIVE recreation of the actual product
- Not a screenshot — a code-built component that users can see working
- This is the most effective hero pattern for SaaS products

**The Gradient Hero** (Vercel, Stripe, Pitch):
- Bold headline centered
- Gradient or shader visual behind/below
- The visual is ambient — it doesn't compete with the text
- Loads progressively (text first, visual after)

**The Feature Grid** (Linear, Notion, Pitch):
- Numbered sections (Linear: FIG 0.2, 0.3, 0.4)
- Each section: heading + description + visual demo
- Alternating visual side (left/right) or consistent layout
- Deep-scroll page with many sections

### Component Patterns

**Toast/Notification** (Sonner pattern):
- Shadow + 1px ring border
- Swipe-to-dismiss with directional exit animation
- Stack behavior (multiple toasts stack vertically with slight overlap)
- Auto-dismiss with progress indicator

**Command Palette** (Raycast, Linear):
- Centered modal with backdrop blur
- Search input at top, results below
- Keyboard navigation with highlighted active item
- Categories/sections in results
- Recent items or suggestions when empty

**Data Table** (GitHub, Linear, Notion):
- Minimal borders — use background color shifts instead
- Sortable columns with subtle sort indicators
- Row hover state with background change
- Status indicators as colored dots, not text
- Compact spacing (24-32px row height)

**Documentation Layout** (Stripe Docs, Vercel Docs):
- Three-column: sidebar nav | content | page outline
- Breadcrumb trail above content
- Code blocks with language tabs and copy button
- Inline API key display with auth state awareness
- "On this page" right sidebar for long articles

### Spacing Systems

**Vercel's Multiplier System**:
Base unit → 2x, 3x, 4x, 6x, 8x, 10x, 16x, 24x, 32x, 48x, 64x
Non-linear progression — gaps widen at larger scales.

**Notion's Named Spacing**:
`--spacing-block-s`, `--spacing-block-m`, `--spacing-block-l` — semantic names tied to block types.

**Raycast's Rounding Scale**:
`--rounding-none`, `--rounding-xs`, `--rounding-sm`, `--rounding-normal`, `--rounding-md`, `--rounding-lg`, `--rounding-xl`, `--rounding-xxl`, `--rounding-full` — a complete border-radius scale as tokens.

### Shadow Systems

**The Ring + Shadow Combo** (Linear, Vercel, Sonner):
A 1px ring shadow for definition + a soft blur shadow for depth. The ring anchors the element; the shadow lifts it.

**The Inner Glow** (Raycast, Cal.com):
`inset` shadows with white at low opacity. Creates a glass-like lighting effect on dark backgrounds.

**Tinted Shadows** (Stripe):
Instead of `rgba(0,0,0,x)`, use `rgba(50, 50, 93, x)` — a brand-tinted shadow that feels warmer and more intentional.

**Shadow Tokens** (Vaul):
Named shadow levels: border, small, medium, large, tooltip, menu, modal. Each context has a predefined shadow.

### Easing Curves by Product

- **Linear**: `cubic-bezier(0.25, 0.46, 0.45, 0.94)` — ONE curve for everything. Consistency over variety.
- **Vercel**: `cubic-bezier(0.4, 0, 0.2, 1)` (Material standard) + custom per-context
- **GitHub**: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo) — dramatic deceleration
- **Stripe**: Three curves for three purposes: general, enter, symmetric
- **Sonner/Vaul**: `cubic-bezier(0.4, 0, 0.2, 1)` — the safe, tested default

### Duration Scales

Most common: 0.15s (micro), 0.16s (Linear's signature), 0.2s (standard), 0.3s (larger elements)
GitHub tokenizes: `--base-duration-50` through `--base-duration-1000`
