# Design Philosophy Skill

A Claude Code skill that teaches how to think like the best designers in the world — the people behind Linear, Vercel, Stripe, Apple, GitHub, Notion, and more.

## What This Is

Not a style guide. Not a CSS cheat sheet. This skill captures the **design thinking** extracted from studying 80+ designer portfolios, essays, and the actual products they shipped. When loaded, it helps you design and build interfaces that feel intentional, refined, and human — on any platform.

## Structure

```
design-philosophy/
├── SKILL.md                          # Core philosophy (456 lines)
│                                      # 10 sections of design thinking
│
├── references/
│   ├── design-examples.md            # 10 product breakdowns (Linear, Vercel, Stripe...)
│   ├── design-system-patterns.md     # Font pairing, color, spacing, shadow systems
│   │
│   ├── rauno-interaction-design.txt  # Gesture physics, spatial consistency
│   ├── rauno-vercel-design.txt       # Vercel homepage case study
│   ├── rauno-designing-depth.txt     # Layered composition, choreography
│   ├── rauno-novelty.txt             # 90/10 rule, frequency vs. novelty
│   ├── rauno-contrasting-aesthetics.txt  # Beauty at style intersections
│   │
│   ├── emil-developing-taste.txt     # What taste is, how to build it
│   ├── emil-you-dont-need-animations.txt  # When NOT to animate
│   ├── emil-good-vs-great-animations.txt  # Origin awareness, easing, springs
│   ├── emil-7-animation-tips.txt     # Actionable motion techniques
│   │
│   ├── jakub-interface-details.txt   # Concentric radii, text rendering, shadows
│   ├── jakub-gestures-in-motion.txt  # Spring-based gesture system
│   ├── jakub-drag-gestures.txt       # Snap points, progressive reveal
│   │
│   ├── raphael-12-principles-animation.txt  # Disney principles for UI
│   │
│   └── examples/                     # 13 product screenshots
│       ├── linear-homepage.png
│       ├── vercel-homepage.png
│       ├── stripe-homepage.png
│       ├── raycast-homepage.png
│       ├── notion-homepage.png
│       └── ...
```

## SKILL.md — 10 Sections

| # | Section | What It Teaches |
|---|---------|-----------------|
| 1 | **The Designer's Mindset** | Constraint over decoration. Performance IS design. Invisible compound of small details. |
| 2 | **Developing Taste** | Emil Kowalski's framework: surround yourself with great work, analyze WHY, practice. |
| 3 | **The Philosophy of Motion** | Frequency x novelty framework. 90/10 rule. Interruptibility. Choreography. Staggering. 12 Disney principles for UI. Gesture design. |
| 4 | **Composition & Visual Storytelling** | Depth through layers. Visual rhythm. Product demo heroes. Whitespace as communication. |
| 5 | **Craft Details That Compound** | Text rendering. Concentric border radius. Shadows over borders. Optical alignment. |
| 6 | **Contrasting Aesthetics** | Creating curiosity through unexpected style combinations. The novelty tax. |
| 7 | **Building With Intention** | Layered enhancement. Accessibility as design. Programmatic visuals. Product marketing narrative. |
| 8 | **Product Design Patterns** | Information density thinking. Tokenization. Navigation as architecture. Component craft. Signature motion. |
| 9 | **Design System Patterns** | Font pairing logic. Type scales. Color systems. Radius/shadow/transition patterns. |
| 10 | **Reference Library** | Index to all essays and examples. |

## Sources

### Designers Studied

Designers at Apple, Vercel, Linear, GitHub, OpenAI, Shopify, Microsoft, and independent studios:

- **Rauno Freiberg** (Vercel) — interaction design, depth, novelty, contrasting aesthetics
- **Emil Kowalski** (Linear) — taste, animation philosophy, practical motion
- **Jakub Krehel** (Interfere) — interface details, gesture design, craft
- **Raphael Salaja** — 12 principles of animation applied to UI
- **Gavin Nelson** (OpenAI), **Evil Rabbit** (Vercel), **Charlie Deets** (Apple/Dia), **Claudio Guglieri** (Microsoft), **Sebastiaan de With** (Apple), and 70+ more

### Products Analyzed

Linear, Vercel, Stripe, Raycast, GitHub, Notion, Resend, Arc Browser, Sonner, Vaul, Pitch, Cal.com — with screenshots and design system data.

## How It Works

When the skill triggers, Claude reads SKILL.md for the philosophy, then dips into the reference files when specific depth is needed (animation techniques, design system patterns, product examples). The essays contain the full original thinking from these designers — not summaries, but the actual reasoning and examples they shared.

## Triggers

The skill activates when you're building any interface and want it to look and feel professionally designed. Keywords: "make it look good", "improve the design", "build a website", "create an app", "design a component", animation questions, typography decisions, layout choices, color schemes.
