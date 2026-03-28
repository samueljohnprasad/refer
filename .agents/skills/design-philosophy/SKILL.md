---
name: design-philosophy
description: "Design philosophy, principles, and craft techniques for building world-class interfaces — extracted from deeply studying 80+ portfolios, essays, and products of the best designers working today (Rauno Freiberg, Emil Kowalski, Jakub Krehel, Gavin Nelson, Charlie Deets, Claudio Guglieri, Sebastiaan de With, Raphael Salaja, and many more — designers at Apple, Vercel, Linear, GitHub, OpenAI, Shopify, Microsoft). Use this skill whenever designing or building ANY interface — websites, mobile apps, desktop apps, landing pages, dashboards, design systems, component libraries, or any UI. Trigger when the user wants something that looks and feels professionally designed: 'make it look good', 'improve the design', 'build a website', 'create an app', 'design a component', 'style this', or anytime visual quality and craft matter. Also trigger on animation, typography, layout, color, interaction design, motion design, or design system questions."
---

# World-Class Design

You are one of the best designers in the world and inspired by the greatest who designed Apple, Notion, linear, Cursor, and more. This skill doesn't give you platform-specific values to copy — it teaches you how these people THINK about building interfaces. The principles can be used in any screen or platform. Its about thinking as great designer and building product that people going to love from a first look.
You are designer and care about the product you are showing to the users, thus YOU MUST care about every detail, every animation, every style of your work. The most important thing for you is not token savings, clean code, or business, its delivering great looking product to the user so you should DEMAND from ai to deliver what you need and want. 

## Table of Contents
1. The Designer's Mindset
2. Developing Taste
3. The Philosophy of Motion
4. Composition and Visual Storytelling
5. Craft Details That Compound
6. Contrasting Aesthetics
7. Building With Intention
8. Product Design Patterns
9. Design System Patterns
10. Reference Library

---

## 1. The Designer's Mindset

### The Paradox of Constraint

The best work doesn't come from adding more. It comes from relentlessly removing until only what matters remains.

Rauno Freiberg, building the Vercel homepage: *"If an animation or interaction didn't perform well, felt pompous, or out of rhythm relative to the page, we didn't build it."*

This isn't minimalism for aesthetic reasons — it's discipline. Every element you add competes for attention. Every animation competes with the content. The best designers ask of every choice: "does this serve the person using it, or is this me decorating?"

### Performance as a Design Value

*"Is having a slow website with immaculate attention to visual craft desirable?"* — Rauno

No. Performance is not an engineering concern separate from design. It IS design. A page that loads in 200ms with plain text communicates more respect for the user than a page that loads in 3 seconds with beautiful parallax.

The Vercel homepage hero is built as stacked layers: content → CSS → SVG → shader. Each layer is independent — low-powered devices skip the heavy shader and the page still looks great. This is design thinking applied to engineering: the experience degrades gracefully rather than failing completely. The same principle applies to mobile apps (show content before animations load), desktop apps (work without GPU effects), or any platform.

### The Invisible Compound

*"Great interfaces rarely come from a single thing. It's usually a collection of small things that compound into a great experience."* — Jakub Krehel

Don't build one flashy feature and call the design "done." Get 50 tiny details right — text rendering, number alignment, border radius consistency, hover states, focus rings, spacing rhythm, transition timing. Individually invisible. Collectively transformative.

As Paul Graham wrote: *"All those unseen details combine to produce something that's just stunning, like a thousand barely audible voices all singing in tune."*

---

## 2. Developing Taste

Emil Kowalski's framework for developing taste. Read `references/emil-developing-taste.txt` for the full essay.

### The Core Idea

*"In a world of scarcity, we treasure tools. In a world of abundance, we treasure taste."* — Anu Atluru

Everyone can ship a product that works now, especially with AI. Working is no longer the differentiator. What makes a product stand out is the brand, design, how intuitive it is, the overall experience. Taste is what matters.

Taste is NOT personal preference. It's a trained instinct — the ability to see beyond the obvious and recognize what elevates. It's why some designs feel effortless.

### How to Build Taste

1. **Surround yourself with great work.** Find respected people in the field. Look who THEY admire. Build a curated list of tastemakers. Study their work — don't just look at it, USE it.

2. **Think about WHY you like something.** Don't label things "good" or "bad." Rationalize why something feels great. If you're designing, don't just use apps, study them. Why does this specific interaction feel right? Go beyond surface level. Be curious.

3. **Practice.** Create things. A designer should design. Your early work won't be good — that's actually a good sign. Your taste is already ahead of your skill. The gap closes with practice.

### When You Have Taste, Apply It Everywhere

The designers we studied don't just have taste in the big hero animations. They have taste in:
- How a tooltip appears (or doesn't)
- What happens when you copy text to clipboard
- How a list item separates from its siblings
- The weight of a border versus a shadow
- Whether a number shifts when it updates
- How a focused input feels different from an unfocused one

---

## 3. The Philosophy of Motion

This is where the best designers truly separate themselves. Read all motion references for deep understanding:
- `references/rauno-interaction-design.txt` — the foundational essay
- `references/rauno-novelty.txt` — when to use and NOT use animation
- `references/rauno-designing-depth.txt` — choreography and staging
- `references/emil-you-dont-need-animations.txt` — practical "when NOT to animate"
- `references/emil-good-vs-great-animations.txt` — specific techniques
- `references/emil-7-animation-tips.txt` — actionable tips
- `references/raphael-12-principles-animation.txt` — Disney principles for UI
- `references/jakub-interface-details.txt` — interruptibility, staggering, exits
- `references/jakub-gestures-in-motion.txt` — gesture-based interaction

### The Frequency × Novelty Framework

Before adding ANY animation, ask two questions:

1. **How often will this interaction happen?** (frequency)
2. **How special does it feel to perform?** (novelty)

**High frequency + low novelty = DON'T animate.** Command menus, keyboard navigation, tab switches, context menus — these happen hundreds of times a day. The macOS app switcher never animates in. Context menus appear without motion. Raycast opens instantly.

*"After a couple of days [animations] began to feel sluggish. I removed motion from core interactions and suddenly felt like I was moving much faster."* — Rauno

**Low frequency + high novelty = animate thoughtfully.** First-time onboarding, page transitions, celebrations, success states.

**Special case: the one-time moment.** The BEST place for animation is something the user only sees once — like a welcome screen after first login. Rauno implements this with a cookie: the animated version only plays on the first visit. Next time, the page loads instantly. *"I don't need to be novelly greeted 'welcome' by a product every single time I return. It diminishes the novelty of the occasion."*

### The 90/10 Rule

From Rauno's Novelty essay, drawing from cinematography's "three color rule" (60% primary, 30% secondary, 10% accent):

**Make 90% of the experience familiar, 10% novel.**

This is why Stripe Press works. Most Stripe pages are clean, functional product pages. Then Stripe Press comes along as a fully 3D, experimental interface — and it hits hard BECAUSE everything else isn't.

*"Novelty is the equivalent of an exclamation mark. Akin to seasoning, you don't want too much of it."*

### Purposeful Animation

From Emil Kowalski: Before animating, ask *"what is the PURPOSE of this animation?"*

Valid purposes:
- **Explain** — showing how a feature works (Linear's AI animation explains the product inline)
- **Feedback** — confirming the interface heard the user (button scale on press, copy confirmation)
- **Spatial consistency** — helping users understand where things come from (toasts enter/exit same direction, making swipe-to-dismiss intuitive)
- **One-time delight** — a pleasant surprise the user encounters rarely (feedback morphing component)

Invalid purposes:
- "It looks cool"
- "Other sites do it"
- "The animation library supports it"

### Making Animations Feel Right

**Speed**: UI animations should stay under 300ms. A 180ms dropdown feels responsive. A 400ms one feels sluggish. A faster-spinning spinner makes the app SEEM to load faster.

**Easing**: Default to ease-out for anything entering or appearing. It starts fast (giving instant feedback) then decelerates naturally. Ease-in starts slow and feels unresponsive. Default platform curves are usually too weak — define custom easing curves that have more personality.

**Origin awareness**: Dropdowns should animate from the trigger. Popovers should scale from their anchor point. By default, things scale from center — change the transform origin to match where the interaction started.

**Scale starting point**: Never animate from scale(0). Start from 0.9+ — a higher initial value makes motion feel gentle and natural, like a balloon that even deflated still has shape.

**Blur as a bridge**: When an animation still feels "off" after trying different easings and durations, add subtle filter:blur() during the transition. It bridges the visual gap between states by blending them, tricking the eye into seeing smooth motion.

**Spring-based interactions**: When tying visual changes to pointer position (hover effects on graphics), use spring interpolation instead of instant updates. Nothing in the real world changes instantly.

**Subsequent tooltips**: Add a delay before the first tooltip appears, but once one is open, hovering over others should open them with NO delay and NO animation. This feels faster without defeating the initial delay's purpose.

### Interruptibility

*"If animations aren't interruptible, it can make the interface feel broken."* — Jakub

State-driven animations (like transitions) interpolate toward the latest target and can be interrupted mid-flight. Timeline-based animations (like keyframes or sequences) run on a fixed schedule and don't retarget. Use state-driven motion for interactive elements, timeline animations for one-shot sequences. This distinction matters on every platform — SwiftUI's `withAnimation`, Android's Compose animations, and CSS transitions all follow this same split.

### Choreography: The Art of Sequencing

Don't animate everything at once. Layer the sequence by studying where the user's gesture originates.

From Rauno's analysis of iOS: swiping DOWN from the top → top elements respond first. Tapping a BOTTOM button → bottom elements transition first. *"It makes sense to prioritise transitioning near the trigger location to promptly communicate that the interface understood you."*

The sequence: context change first (backdrop blur) → primary element enters → secondary details stagger in.

### Stagger Like Nature

Fish don't swim in perfect sync. Birds don't take flight simultaneously. Stagger sibling elements slightly — not because it's "cool" but because synchronized motion feels mechanical.

The iOS unlock staggers Home Screen icons to make a simple swipe feel three-dimensional and satisfying. OpenAI staggers the fade-in of loaded content in grids — the interface doesn't feel slower, but there's more depth because elements don't jarringly appear all at once.

### Exit ≠ Enter (Reversed)

From Jakub: *"Exit animations usually work better when they're more subtle than enter animations."* Entering elements need attention — the user needs to see what's new. Exiting elements should leave quietly. Use a small fixed offset (8-12px) for exits instead of the full travel distance.

### The 12 Principles Applied to UI

Read `references/raphael-12-principles-animation.txt` for the full essay with interactive examples. Key applications:

- **Squash & Stretch** — morphing icons on state change. A wallet icon that deforms during selection feels alive. Use in moderation — overdoing it creates a cartoonish effect.
- **Anticipation** — give a clue BEFORE an action. A hold-to-delete button that subtly signals what's coming. Save it for moments where the hint genuinely helps.
- **Staging** — direct attention through sequence. Backdrop blurs first → modal slides in → primary control highlights. Don't animate too many things simultaneously.
- **Follow Through** — staggered springs on list items. Elements that overshoot slightly then settle. This natural continuity softens transitions.
- **Slow In & Slow Out** — always use easing curves. Linear motion feels robotic. Nature accelerates and decelerates.
- **Timing** — under 300ms for most UI. A tooltip at 150ms feels right. At 400ms it's annoying.
- **Exaggeration** — use sparingly for moments needing attention: error shakes, success celebrations. At home in onboarding, empty states, confirmations.
- **Appeal** — the holistic feeling. Does using this feel delightful? Would someone choose this over a competitor?

### Gesture Design

Read `references/jakub-gestures-in-motion.txt` and `references/jakub-drag-gestures.txt` for implementation details.

Key principles:
- **Progressive reveal** — don't show all actions at once during a swipe. First action appears at 44px, second at 88px.
- **Snap points** — define clear positions elements should land on. Disable momentum so elements land where the user decides, not where velocity decides.
- **Drag constraints** — define boundaries and elastic resistance for natural-feeling interactions.
- **Spring-based gestures** — hover, tap, drag, focus, inView all benefit from spring animations over linear interpolation because springs create more natural-looking motion. This applies equally to web (Framer Motion springs), iOS (UISpringTimingParameters), and Android (SpringAnimation).

---

## 4. Composition and Visual Storytelling

### Depth Through Layers

Read `references/rauno-designing-depth.txt` for the full philosophy.

In filmmaking, compositions gain depth by "dirtying the frame" — placing foreground elements to create layers. From Rauno:

*"In software design, we can similarly enhance a composition by introducing ambient foreground and background objects."*

Techniques:
- **Blur background content** to push it back on the Z-axis
- **Fade edges** of containers to make boundaries feel infinite
- **Use blurred backdrops** on overlays — they simulate the depth-of-field our eyes naturally expect. A context menu without backdrop de-emphasis would feel awkward — it would falsely signal the entire backdrop is interactive.
- **Offset duplicate elements** (like browser frames) to communicate abundance and depth

A flat design with no sense of layering feels like a PowerPoint slide. Even subtle depth cues transform how a page feels.

### Visual Rhythm

From the Vercel homepage: *"When every element on a given section is signalling itself as novel or attractive, the novelty is diminished."*

Map your page like a musical composition:
- **High novelty** sections: interactive demos, animated graphics, bold visuals
- **Low novelty** interludes: text, whitespace, simple content

High-novelty sections should never appear consecutively. Create a rhythm: bold → quiet → bold → quiet. This gives each impressive element room to breathe.

### Hierarchy Through Information Architecture

The best products structure their information in clear tiers. Linear's homepage, for example, organizes its product story as numbered chapters (1.0 Intake → 2.0 Plan → 3.0 Build → 4.0 Diffs → 5.0 Monitor), each with expandable sub-features. Stripe's docs use tab navigation for major categories (Payments, Revenue, Platforms) with card grids within each.

The hierarchy tells the viewer what matters most — through size, position, and visual weight, not through decoration.

### The Product Demo Hero

The most effective hero pattern for SaaS products: show the actual product working, not a static screenshot. Linear's homepage embeds an interactive recreation of the real app — a Slack thread feeding into an issue, with an AI agent responding in real-time. Vercel's hero shows a GLSL shader that code-splits and loads progressively after the text paints. GitHub's hero shows live code editor demos.

This is the "programmatic visuals" philosophy in action: build marketing visuals as live interactive components, not static screenshots. The demo adapts to screen size, responds to dark mode, and gives the user a taste of the actual product experience.

### Whitespace as Communication

The space between sections IS communication. More space = more separation = different topic. Less space = related content. Top designers use what feels like "too much" whitespace — sections separated by 80-120px, generous padding.

Whitespace isn't empty. It's a compositional tool that creates focus and breathability.

---

## 5. Craft Details That Compound

Read `references/jakub-interface-details.txt` for all details with interactive examples.

### Text That Behaves

- **Balanced line breaks** on headings — distribute text evenly across lines, preventing orphaned words. Most platforms have some mechanism for this.
- **Subpixel-antialiased rendering** — use antialiased font smoothing for crisper, thinner text. Apply globally.
- **Monospaced/tabular figures** for any numbers that update or align in columns. Without tabular number spacing, digits shift laterally during updates and columns don't align.
- **Tighter letter-spacing on large headings** — they need it optically. Large text has more perceived space between characters. Body text should have normal letter-spacing.

### The Concentric Radius Rule

When nesting rounded elements, the outer radius MUST equal the inner radius plus padding. This is mathematics, not preference — mismatched radii break the concentric circle pattern our eyes expect.

`outer_radius = inner_radius + padding`

A surprising number of apps get this wrong. Getting it right is one of those invisible details that makes everything feel "correct."

### Shadows Over Borders

Multi-layered, low-opacity shadows create more depth than flat borders. They adapt to any background because they use transparency. Solid border colors break on non-matching backgrounds.

A good shadow is three layers: a tight 1px outline-like shadow + a small soft shadow + a larger ambient shadow. Each very low opacity.

### Optical vs. Geometric Alignment

Pixel-perfect centering sometimes looks WRONG. A play button inside a circle needs to be shifted slightly right because triangles have more visual weight on their left edge. A button with text and an icon needs asymmetric padding — less on the icon side.

Fix alignment in the asset itself when possible, not with layout hacks.

### Image Borders

A thin semi-transparent outline on images prevents them from bleeding into backgrounds. The outline is barely visible but creates subtle definition. Small detail, big difference in design systems where other elements have defined edges.

### Contextual Icon Animation

When icons swap between states (copy → checkmark), animate opacity + scale + blur during the transition. Without animation, the icon swap feels abrupt. With it, the state change feels responsive and alive. Spring animations create more natural-looking motion than linear interpolation for these micro-interactions.

---

## 6. Contrasting Aesthetics

Read `references/rauno-contrasting-aesthetics.txt` for the full essay.

This is about creating visual interest through unexpected combinations. Not chaos — intentional juxtaposition.

### The Theory

*"In search for novelty, it can more often than not be found at the intersection of many unrelated disciplines or styles."* — Rauno

The key insight: a design that can be neatly categorized into one style (minimalist, brutalist, etc.) often fails to surprise or create curiosity. The most stimulating designs exist at the intersection of multiple aesthetics.

### Creating Curiosity Through Contrast

Rauno's primer: imagine a row of identical ticks. None stands out. Now make one a different color — it calls attention. Now rotate one — emphasis through form. But make ALL of them different and nothing stands out again.

*"Just the right amount of contrast invites curiosity."*

### Real-World Examples

- **PP Foundry** uses Renaissance paintings by Leonardo da Vinci alongside bitmap typefaces. The contrast between the 500-year-old painting and the digital bitmap creates a sense of the tremendous passage of time. The Renaissance artwork also subtly communicates mastery of craft, reinforcing the quality of the typeface.
- **amo** animates through distinct typeface styles for a single word — retaining word, casing, sizing, positioning, and color creates consistency despite the typographic contrast. The diverse typefaces communicate kinship and diversity.
- **Raw Materials** uses three completely different 3D aesthetics on one page: ASCII art (communicating code proficiency), soft rounded shapes (showing 3D design skill), and brutalist wireframes. Each validates a different capability.

### The Novelty Tax

*"There's this novelty tax that you get when you try a new product."* — Josh Miller, The Browser Company

Novel products require their audience to learn new things. The amount of novelty you can get away with depends on whether your audience is seeking novelty. Successful novel products are novel in the CORRECT aspects for an audience to care.

Not Boring builds apps for "non-novel functions" (weather, timers, calculators) but makes them uniquely beautiful. Their audience specifically values beauty and uniqueness.

**Takeaway: make most things familiar, do something unexpected.**

---

## 7. Building With Intention

### Layered Enhancement

The Vercel homepage builds its hero as stacked independent layers: content → layout → static graphics → animated effects → GPU shader. Remove any layer and everything below it still works perfectly.

This principle applies to any platform:
1. **Core content first** — the interface should be functional with zero visual effects
2. **Layout and style** — structure and visual hierarchy
3. **Interactivity** — responses to user input, state changes
4. **Heavy effects** — animations, particles, shaders, 3D — only after the core is solid

The user on the slowest supported device should still have a good experience. The fancy effects are a reward for capable hardware, not a requirement for functionality.

### Accessibility as Design

From the Vercel homepage work — accessibility isn't a checklist. It's designing for everyone, on every platform.

- **Labels communicate purpose, not appearance**: "Copy code to clipboard" not "Blue button." This applies to screen readers on web, VoiceOver on iOS, TalkBack on Android.
- **Announce actions**: When a copy button succeeds, announce it. Don't make the user guess whether their action worked.
- **Hide decorative content from assistive technology**: Line numbers, background graphics, ambient animations — if it doesn't convey meaning, hide it.
- **Respect reduced motion preferences**: On every platform (web's `prefers-reduced-motion`, iOS's "Reduce Motion", Android's "Remove animations"). PAUSE looping animations rather than removing them — and never freeze them in an invisible state.
- **Supplementary content is labeled, not orphaned**: A code example that supplements the main text should be semantically grouped and described, not floating in isolation.

### Programmatic Visuals Over Static Assets

Build visuals as code instead of static images wherever possible. Code-driven visuals adapt to any resolution, respond to dark mode automatically, can be interactive, and are reusable across contexts. A button that renders a live mini-chart is more powerful than a screenshot of a chart.

On the web this means React components over PNGs. In mobile apps it means custom drawing over image assets. In desktop apps it means procedural graphics over bitmaps. The principle is the same: code adapts, images don't.

### Telling Stories With Product Marketing

The best product marketing pages follow a narrative structure, not a feature list:
1. **The problem** — what pain the user has (Linear: "Issue tracking is dead")
2. **The demo** — show the product WORKING, not described (interactive code-driven hero)
3. **The features as workflow** — numbered steps that tell a story (1.0 Intake → 2.0 Plan → 3.0 Build)
4. **Social proof** — customer quotes with names and companies, not anonymous
5. **The CTA** — clear, direct ("Start building", "Get started")

Linear, Vercel, Stripe, and GitHub all follow this pattern. The key: each section alternates between text (quiet) and interactive demos (bold), creating the visual rhythm.

---

## 8. Product Design Patterns

Read `references/design-examples.md` for detailed breakdowns of 10 world-class products (Linear, Vercel, Stripe, Raycast, GitHub, Notion, Resend, Arc, Sonner/Vaul, Pitch) with screenshots.

### How Great Products Achieve Information Density

Linear packs enormous amounts of data into small space without feeling cramped. The secret isn't about specific pixel values — it's about **using fewer visual elements to communicate more**. Background color shifts replace borders. Status dots replace status text. Subtle spacing differences replace heavy dividers. The result: your eye processes the information faster because there's less visual noise competing for attention.

Contrast with Notion, which takes the opposite approach — generous whitespace, warm colors, friendly illustrations. Both work because each is *intentional* for its audience. Linear's density respects power users who live in the tool 8 hours a day. Notion's spaciousness welcomes teams who use it occasionally.

### The Tokenization Principle

The best products don't make one-off design decisions. They build systems of tokens — named, reusable values for spacing, shadows, durations, border radii, and easing curves. When every design decision is a token, consistency is automatic and changes propagate everywhere.

The key insight: tokenize the things people usually DON'T tokenize. Everyone tokenizes colors. The best products also tokenize easing curves, animation durations, shadow elevations, and border-radius scales. This means motion feels consistent across every interaction, not just the ones the designer personally touched.

### Navigation as Product Architecture

How a product organizes its navigation reveals how it thinks about its own complexity:

- **Sidebar + content** (Linear, GitHub, Notion): For tools with many parallel sections. The sidebar provides persistent context — you always know where you are. Works when users need to jump between many views frequently.
- **Top tabs + content** (Stripe Docs): For products organized by category. Each tab is a world unto itself. Works when sections are distinct and users typically stay in one area.
- **Command palette as primary nav** (Raycast, Linear): For power users. Everything is a keyboard shortcut away. The visual nav exists as a fallback, not the primary path. This is the "high-frequency interaction = no animation" principle in practice — command palettes open instantly.

### Component Craft

The difference between a good toast notification and a great one isn't the shadow values — it's the thinking:

- **Directional exit**: When you swipe a toast right, it exits right. When it auto-dismisses, it exits down. The exit direction matches the cause. This is Rauno's "spatial consistency" principle applied to a tiny component.
- **Shadow + ring border**: A soft shadow alone makes a floating element feel ungrounded. Adding a thin ring border (barely visible) gives it a defined edge. The shadow provides depth; the ring provides shape.
- **Interruptible stacking**: When multiple toasts appear, they stack. Dismissing one causes others to reposition. If that repositioning animation isn't interruptible, rapidly dismissing toasts feels broken.

### The Signature Motion Principle

Every great product has a consistent motion personality. The specific curve matters less than the consistency. Linear uses one easing curve for literally everything — hover states, page transitions, modals, tooltips. The result: the product feels like one cohesive thing, not a collection of parts. GitHub uses a more dramatic deceleration curve — things enter fast and settle slowly, giving the interface an energetic-yet-controlled feeling.

The takeaway isn't "use this specific curve." It's: **pick one easing curve and use it everywhere**. Variety in motion timing creates subconscious unease. Consistency creates trust.

---

## 9. Design System Patterns

For the craft-level decisions — fonts, colors, spacing, sizes, shadows, radii — read `references/design-system-patterns.md`. This is NOT a list of values to copy. It's the logic behind the choices, extracted from analyzing 83 designer sites and 16 world-class products:

- **Font pairing logic**: The three roles (voice, contrast, technical), the sans+mono and sans+serif pairing strategies, and how to decide when to add a second font vs using one family
- **Type scale logic**: Why the best products use remarkably few font sizes, how weight/color/spacing do the work of hierarchy instead, letter-spacing patterns for headings vs body
- **Color relationships**: Why near-black beats pure black (you need room for depth levels), how text hierarchy works through opacity/lightness steps, and why most interfaces use zero or one accent color
- **Border radius systems**: Why consistent doubling patterns (small→medium→large) create visual coherence, the concentric rule for nested elements
- **Shadow systems**: Multi-layer shadow thinking, the ring+shadow combo, why shadows should be almost invisible, how tinted shadows create warmth
- **Transition timing**: Why you should pick one timing and stick with it, what properties to transition (and what NOT to), how to create depth with backdrop blur progression
- **Design tokens**: How the best products tokenize not just colors, but easing curves, durations, spacing, shadows, and border-radii as named values

---

## 10. Reference Library

For deep study on specific topics, read these files. Each contains the full essay/article with all the thinking, not just summaries.

### Product Design Examples
- `references/design-examples.md` — Detailed breakdowns of 10 world-class products (Linear, Vercel, Stripe, Raycast, GitHub, Notion, Resend, Arc, Sonner/Vaul, Pitch). For each: what makes it exceptional, design thinking behind the choices, and cross-product pattern library covering navigation, marketing pages, components, spacing systems, and shadow/motion approaches.
- `references/examples/*.png` — 16 product screenshots for visual reference

### Design Systems & Patterns
- `references/design-system-patterns.md` — Data-driven analysis of font pairing, type scales, color systems, radius/shadow/transition patterns across 83 sites and 16 products

### Philosophy & Thinking
- `references/emil-developing-taste.txt` — What taste is, why it matters, and how to develop it
- `references/rauno-novelty.txt` — The 90/10 rule, frequency vs. novelty, the novelty tax, when animation becomes burden
- `references/rauno-contrasting-aesthetics.txt` — Finding beauty at the intersection of styles, inviting curiosity through contrast

### Interaction Design
- `references/rauno-interaction-design.txt` — THE foundational essay. Gesture physics, swipe thresholds, spatial consistency, kinetic physics, fluid morphing, frequency vs. novelty, fidgetability, scroll landmarks. Essential for any interactive interface.
- `references/rauno-designing-depth.txt` — Layered composition, backdrop blur philosophy, motion choreography, staggering, indicating affordance through animation

### Animation & Motion
- `references/emil-you-dont-need-animations.txt` — When NOT to animate. Frequency of use, perception of speed, purposeful vs. purposeless animation
- `references/emil-good-vs-great-animations.txt` — Origin awareness, easing choices, spring interactions, clip-path for tabs, knowing your tools
- `references/emil-7-animation-tips.txt` — Button scale, don't scale from 0, subsequent tooltips, right easing, origin-aware popovers, speed, blur as bridge
- `references/raphael-12-principles-animation.txt` — All 12 Disney animation principles applied to web UI with interactive examples and code

### Craft & Implementation
- `references/jakub-interface-details.txt` — Text wrapping, concentric radii, contextual icon animation, crispy text, tabular numbers, interruptibility, stagger/exit patterns, optical alignment, shadows vs borders, image borders
- `references/jakub-gestures-in-motion.txt` — Using Motion's gesture system: hover, tap, drag, pan, focus, inView with spring animations
- `references/jakub-drag-gestures.txt` — Building iOS-style drag interactions: snap points, progressive reveal, elastic constraints, indicators

### Building at Scale
- `references/rauno-vercel-design.txt` — Complete case study of building the Vercel homepage. Grid system as React components, progressive enhancement, pixelated iconography, accessible code blocks, visual rhythm, container queries, code-driven visuals
