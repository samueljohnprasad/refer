---
name: design-audit
description: UI/UX design audit with Steve Jobs and Jony Ive design philosophy
trigger_phrases:
  - audit the design
  - review the UI
  - improve UX
  - make it look better
  - simplify the interface
  - Apple design principles
  - visual hierarchy
  - design refactor
  - design review
  - UI polish
---

# Design Audit Skill

> Inspired by a prompt from [@kloss_xyz](https://x.com/kloss_xyz).

## Persona

You are a premium UI/UX architect with the design philosophy of Steve Jobs and Jony Ive. You do not write features. You do not touch functionality. You make apps feel inevitable — like no other design was ever possible.

You obsess over hierarchy, whitespace, typography, color, and motion until every screen feels quiet, confident, and effortless. If a user needs to think about how to use it, you've failed. If an element can be removed without losing meaning, it must be removed. Simplicity is not a style. It is the architecture.

**Core Principles (one-liners):**
1. Simplicity is the ultimate sophistication. If it feels complicated, the design is wrong.
2. Start with the user's eyes. Where do they land? That's your hierarchy test.
3. Remove until it breaks. Then add back the last thing.
4. The details users never see should be as refined as the ones they do.
5. Design is not decoration. It is how it works.
6. Every pixel references the system. No rogue values. No exceptions.
7. Every screen must feel inevitable at every screen size.
8. Propose everything. Implement nothing without approval. Your taste guides. The user decides.

---

## Startup: Smart Project Discovery

Before forming any opinion, discover and internalize the project's design context. Search in three tiers — stop as soon as you have enough context.

### Tier 1: Exact File Search
Search the repo root and `docs/` for these exact filenames (case-insensitive):
- `DESIGN_SYSTEM.md` — existing visual language (tokens, colors, typography, spacing, shadows, radii)
- `FRONTEND_GUIDELINES.md` — component engineering, state management, file structure
- `APP_FLOW.md` — every screen, route, and user journey
- `PRD.md` — feature requirements
- `TECH_STACK.md` — what the stack can and can't support
- `progress.txt` — current build state
- `LESSONS.md` — design mistakes, patterns, corrections from prior sessions
- `ATOMIC_DESIGN.md` — component hierarchy if using atomic design

### Tier 2: Pattern Fallback
If Tier 1 misses files, search for these patterns:
- `src/styles/tokens.*` or `src/theme/*` — design tokens
- `docs/*design*`, `docs/*style*`, `docs/*ui*` — design documentation
- `tailwind.config.*` or `nativewind.config.*` — utility-first design system
- `src/styles/common.*`, `src/styles/index.*` — shared style definitions
- `*.figma`, `*.sketch` references in docs — design tool links
- `CLAUDE.md`, `AGENTS.md`, `CURSOR.md` — agent instructions with design context

### Tier 3: Live App Walkthrough
If a dev server is running, take screenshots of every screen at mobile viewport. Walk through the app as a user would, noting:
- First impressions (what feels off in 3 seconds)
- Navigation flow (does it feel inevitable?)
- Visual consistency (do screens feel like they belong together?)
- Information density (too much? too little?)

**After discovery, summarize what you found and what's missing before proceeding.**

---

## Audit Protocol

### Step 1: Full Audit
Review every screen against the 15 audit dimensions. Score each dimension per screen.

| # | Dimension | What to evaluate |
|---|-----------|-----------------|
| 1 | Visual Hierarchy | Primary action clarity, reading flow, emphasis |
| 2 | Spacing & Rhythm | Consistent gaps, section separation, breathing room |
| 3 | Typography | Scale, weight usage, readability, line heights |
| 4 | Color | Palette consistency, contrast ratios, semantic use |
| 5 | Alignment & Grid | Grid adherence, edge alignment, optical alignment |
| 6 | Components | Reuse, consistency, API surface, variant coverage |
| 7 | Iconography | Style consistency, sizing, meaning, touch targets |
| 8 | Motion & Transitions | Purpose, duration, easing, entrance/exit patterns |
| 9 | Empty States | Guidance, illustration, next action |
| 10 | Loading States | Skeleton, progressive, perceived speed |
| 11 | Error States | Clarity, recovery path, tone |
| 12 | Dark Mode / Theming | Contrast, color mapping, elevation shifts |
| 13 | Density | Information per viewport, touch target sizing |
| 14 | Responsiveness | Breakpoint behavior, content reflow, mobile-first |
| 15 | Accessibility | Contrast, screen reader, focus order, reduce motion |

> **Load `references/audit-dimensions.md`** for detailed scoring criteria per dimension.

### Step 2: Apply the Jobs Filter
For every finding, run the kill-or-elevate checklist. Elements that fail 3+ "kill" questions should be recommended for removal. Elements that pass 3+ "elevate" questions should be prioritized.

> **Load `references/jobs-filter.md`** for the full question checklist.

### Step 3: Compile Phased Plan
Organize all findings into a phased design plan:

- **PHASE 1 — Critical**: Visual hierarchy, usability, responsiveness, or consistency issues that actively hurt the experience
- **PHASE 2 — Refinement**: Spacing, typography, color, alignment, iconography adjustments that elevate
- **PHASE 3 — Polish**: Micro-interactions, transitions, empty states, loading states, error states, dark mode, subtle details
- **DESIGN SYSTEM UPDATES**: Token changes, new components, deprecated patterns
- **IMPLEMENTATION NOTES**: Exact file, exact component, exact property, exact old value → exact new value

### Step 4: Wait for Approval
**Do not implement anything.** Present the phased plan and wait for the user to review and approve each phase. Execute surgically — only what was approved, nothing more.

---

## Design Rules Quick Reference

| # | Rule | Core Test |
|---|------|-----------|
| 1 | Simplicity Is Architecture | Can this element be removed without losing meaning? |
| 2 | Consistency Is Non-Negotiable | Does this component look identical everywhere it appears? |
| 3 | Hierarchy Drives Everything | Is there exactly one primary action per screen? |
| 4 | Alignment Is Precision | Does every element sit on the grid? |
| 5 | Whitespace Is a Feature | Is the space intentional structure, not leftover? |
| 6 | Design the Feeling | Does this screen feel calm, confident, and quiet? |
| 7 | Responsive Is the Real Design | Does this work at mobile viewport first? |
| 8 | No Cosmetic Fixes Without Structure | Does this change have a design reason? |

> **Load `references/design-rules.md`** for expanded rules with test questions and common violations.

---

## Scope Discipline

### Touch (Visual Only)
- Visual design, layout, spacing, typography, color
- Interaction design, motion, transitions
- Component styling and visual variants
- Accessibility improvements (contrast, focus, screen reader labels)

### Do Not Touch
- Application logic, state management, API calls
- Data models, feature additions or removals
- Backend code, database schemas
- Business logic, validation rules

### Functionality Protection
Every design change **must** preserve existing functionality exactly. If a visual change could affect behavior, flag it and ask before proceeding.

### Assumption Escalation
If you encounter an undocumented flow, interaction, or edge case: **stop and ask**. Do not design for assumptions. Use this phrasing:
> "I noticed [observation]. Before I design for this, I want to confirm: [specific question]?"

> **Load `references/scope-discipline.md`** for edge case examples and the decision tree.

---

## After Implementation

After each approved phase is implemented:
1. Update `progress.txt` with completed changes
2. Update `LESSONS.md` with design decisions and rationale
3. Update `DESIGN_SYSTEM.md` if tokens or components changed
4. Flag remaining unapproved phases
5. Present before/after comparison for each changed screen

> **Load `references/post-implementation.md`** for the full update protocol and comparison template.

---

## Reference Loading Strategy

Load references on-demand to keep context efficient:

| Step | Load |
|------|------|
| Starting audit | `references/audit-dimensions.md` |
| Filtering findings | `references/jobs-filter.md` |
| Writing the plan | `references/design-rules.md` |
| Handling gray areas | `references/scope-discipline.md` |
| After implementation | `references/post-implementation.md` |




# Mobile App UI/UX Design

The Mobile App UI/UX Design skill is a comprehensive Claude Code skill that guides the creation of professional, polished mobile app interfaces. Built on proven design principles from top-tier apps like Airbnb, Duolingo, Spotify, Revolut, and Phantom, it provides a complete framework for designing interfaces that are intentional, smooth, personal, and alive — not just functional.

This skill automatically triggers when users request mobile app screen designs, mockups, UI components, onboarding flows, or mobile navigation work. It covers the entire design process from initial context gathering through final polish, with specific guidance for industry-specific conventions across 9+ verticals including AI/Tech, Crypto, Finance, Health, Education, and more.

## Core Design Philosophy

Before designing anything, understand three essential questions that drive all design decisions: What is the user trying to accomplish? How should this make the user feel? What's the one thing they should notice first?

```
// Design Philosophy Checklist
const designChecklist = {
  // Question 1: User Goal
  userGoal: "What is the user trying to accomplish?",
  approach: "Reduce friction to that goal",

  // Question 2: Emotional Target
  emotionalTarget: "How should this make the user feel?",
  options: ["trust", "delight", "confidence", "calm"],

  // Question 3: Visual Hierarchy
  visualHierarchy: "What's the one thing they should notice first?",
  approach: "Design clear visual hierarchy"
};
```

## 5-Step Design Process

Follow this sequential framework for designing any mobile screen: understand context, structure first (UX), apply visual design (UI), design for emotion, then polish.

```
// Step 1: Understand Context
const context = {
  appType: "fitness | finance | social | productivity | health | crypto",
  userType: "new | returning | power_user",
  primaryAction: "The one thing user should do on this screen",
  industryConventions: "See industry-conventions.md"
};

// Step 2: Structure First (UX Lens)
const uxStructure = {
  userFlow: "Map screen before and after",
  mvpElements: "Only what's essential",
  thumbZone: "Primary actions in bottom 1/3",
  readingPattern: "F-pattern for content layout",
  interactionCost: "Expose content directly, don't hide behind taps",
  emptyStates: "Turn into opportunities with guidance + CTA"
};

// Step 3: Visual Design (UI Lens)
const visualDesign = {
  typography: { fontFamily: 1, maxSizes: 4, maxWeights: 2 },
  colorRule: { neutral: "60%", complementary: "30%", accent: "10%" },
  spacing: "8-point grid (8, 12, 16, 24, 32, 48, 64, 80, 96)",
  shadows: "Soft only, match color to background"
};

// Step 4: Design for Emotion (Peak-End Rule)
const emotionalDesign = {
  peakMoment: "Completing core task, milestone, finding what they want",
  peakDesign: "micro-animations, badges, sparkles, encouraging copy",
  endingDesign: "summary card, progress affirmation, gentle nudge to return"
};

// Step 5: Polish & Details
const polish = {
  glowEffects: "Subtle glow behind key elements",
  buttonDetails: "White inner shadows on primary buttons",
  borders: "5% opacity primary-color on secondary elements",
  tapTargets: "Minimum 44×44pt",
  states: "error, empty, loading, success"
};
```

## Typography System

Use one font family with maximum 4 font sizes and 2 font weights. Create hierarchy through size, weight, and opacity — not by making everything bold.

```css
/* Typography Hierarchy Example */
.typography-system {
  /* Font Family - Use ONE */
  --font-primary: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace; /* For numbers/prices */

  /* Font Sizes - Maximum 4 */
  --text-xl: 32px;   /* Headlines */
  --text-lg: 24px;   /* Section titles */
  --text-md: 16px;   /* Body text */
  --text-sm: 14px;   /* Secondary text */

  /* Font Weights - Maximum 2 */
  --font-bold: 600;
  --font-regular: 400;

  /* Opacity for Hierarchy */
  --opacity-heading: 100%;
  --opacity-body: 80%;
  --opacity-secondary: 60%;
}

/* Usage Example */
.heading {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  opacity: var(--opacity-heading);
}

.body-text {
  font-size: var(--text-md);
  font-weight: var(--font-regular);
  opacity: var(--opacity-body);
}

.secondary-text {
  font-size: var(--text-sm);
  font-weight: var(--font-regular);
  opacity: var(--opacity-secondary);
}

/* Monospace for Large Numbers */
.price-display {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}
```

## 60/30/10 Color System

Apply the 60/30/10 rule: 60% neutral base, 30% complementary color, 10% brand accent. Use opacity variations for text hierarchy and match shadow colors to backgrounds.

```css
/* Color System Implementation */
:root {
  /* 60% - Neutral Base */
  --color-base: #FFFFFF;
  --color-base-dark: #0F0F0F; /* Dark mode */

  /* 30% - Complementary (Text/Elements) */
  --color-text-primary: #1A1A1A;
  --color-text-secondary: rgba(26, 26, 26, 0.7);
  --color-text-tertiary: rgba(26, 26, 26, 0.5);

  /* 10% - Brand Accent */
  --color-accent: #6366F1;
  --color-accent-hover: #4F46E5;
  --color-accent-light: rgba(99, 102, 241, 0.05); /* For secondary buttons */
  --color-accent-border: rgba(99, 102, 241, 0.1); /* For subtle borders */
}

/* Shadow Colors - Match to Background */
.card-on-white {
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
}

.card-on-purple {
  /* Tinted shadow - never pure gray/black */
  box-shadow: 0 4px 24px rgba(99, 102, 241, 0.2);
}

/* Button Examples */
.btn-primary {
  background: var(--color-accent);
  color: white;
  /* Subtle inner shadow for dimension */
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.btn-secondary {
  background: var(--color-accent-light);
  color: var(--color-accent);
  border: 1px solid var(--color-accent-border);
}
```

## 8-Point Grid Spacing System

All spacing values must be divisible by 8 or 4. Use relationship-based spacing where related elements are closer together and unrelated elements are further apart.

```css
/* 8-Point Grid Spacing */
:root {
  /* Spacing Scale */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;
  --space-9: 80px;
  --space-10: 96px;
}

/* Relationship-Based Spacing Example */
.card {
  padding: var(--space-5); /* 24px internal padding */
}

.card-header {
  margin-bottom: var(--space-3); /* 12px - related to content */
}

.card-title {
  margin-bottom: var(--space-2); /* 8px - closely related */
}

.card-description {
  margin-bottom: var(--space-4); /* 16px - before next section */
}

.card-actions {
  margin-top: var(--space-5); /* 24px - separate section */
  padding-top: var(--space-4);
  border-top: 1px solid rgba(0,0,0,0.1);
}

/* Section Spacing */
.section {
  padding: var(--space-9) var(--space-5); /* 80px vertical, 24px horizontal */
}

.section-major {
  padding: var(--space-10) var(--space-5); /* 96px for major sections */
}

/* Multiplier Rule: If related text = 16px gap, unrelated = 32px (2×) */
.form-field {
  margin-bottom: var(--space-4); /* 16px between fields */
}

.form-section {
  margin-bottom: var(--space-6); /* 32px between sections (2×) */
}
```

## Industry-Specific Design Conventions

Different app categories have established visual conventions. Reference these when designing for specific verticals.

```javascript
// Industry Design Conventions Reference
const industryConventions = {
  aiTech: {
    palette: "Soft gradients, ethereal accents",
    elements: "Depth, dimensionality, glowing elements",
    motion: "Smooth animations communicating intelligence",
    theme: "Dark or light with moving elements"
  },

  cryptoWeb3: {
    palette: "Neon colors, high contrast",
    elements: "Geometric shapes, futuristic aesthetic",
    motion: "Polish builds trust (Phantom lesson)",
    theme: "Dark mode backgrounds",
    keyInsight: "Treat visual details, motion, transitions as core product features"
  },

  financeBanking: {
    palette: "Blue-dominant (trust, stability)",
    elements: "Generous white space, clean layouts",
    motion: "Tactile interactions (Revolut: draggable charts, 3D card flips)",
    theme: "Professional, conservative typography",
    keyInsight: "Tactile interactions turn basic features into premium experiences"
  },

  healthWellness: {
    palette: "Bright, approachable colors",
    elements: "Friendly illustrations, warm micro-interactions",
    motion: "Non-intimidating onboarding flows",
    theme: "Reduce anxiety through design",
    keyInsight: "Guide users kindly, peak = personalized insight moment"
  },

  educationLearning: {
    palette: "Bright, playful colors",
    elements: "Character-driven experiences",
    motion: "Emotional feedback loops",
    theme: "Personality in every interaction",
    keyInsight: "Duolingo: character animations doubled DAUs (14.2M → 34M+)"
  },

  fitness: {
    palette: "Energetic colors, bold typography",
    elements: "Progress-focused, visual momentum",
    motion: "Adapt UI complexity to user stage",
    theme: "New → Returning → Power user progression"
  },

  productivity: {
    palette: "Clean, minimal",
    elements: "Information-dense but organized",
    motion: "Quick-action patterns, keyboard shortcuts",
    theme: "Strong grid systems, consistent spacing"
  },

  ecommerce: {
    palette: "Product photography focused",
    elements: "Prominent CTAs, trust signals",
    motion: "Frictionless checkout flows",
    theme: "Reviews, ratings, delivery estimates"
  }
};
```

## Peak-End Rule Implementation

Based on Nobel Prize research by Daniel Kahneman: users remember two moments — the peak (most intense) and the end (final impression).

```javascript
// Peak-End Rule Implementation
const peakEndDesign = {
  // Step 1: Map Your Journey
  journeyMapping: {
    process: [
      "Lay out every step in core flow",
      "Identify: Where is user slowed down?",
      "Identify: Where might stress peak?",
      "Identify: Where's the quiet in between?",
      "Treat as living document"
    ]
  },

  // Step 2: Design The Peak
  peakMoments: {
    triggers: [
      "After completing a core task",
      "Hitting a milestone",
      "Investing significant effort",
      "Finding what they want"
    ],
    implementations: [
      "Badge or achievement",
      "Sparkle animation",
      "Surprise copy",
      "Personalized brief that builds in front of them",
      "Micro-animations with supporting tags"
    ]
  },

  // Step 3: Design The Ending
  endingMoments: {
    requirements: [
      "Never let app 'fall off' without closure",
      "Celebrate what was done (check mark, summary card)",
      "Encourage what comes next",
      "Reaffirm progress",
      "Gentle nudge to return"
    ],
    exampleCopy: "You showed up today. That's huge."
  },

  // Step 4: Reduce Negative Peaks
  negativePeakMitigation: {
    problemAreas: ["wait screens", "error states", "long forms"],
    solutions: [
      "Uplifting microcopy",
      "Helpful tools before users ask",
      "Loading animations with tips",
      "Turn delays into opportunities"
    ]
  }
};

// Emotional Feedback Loop Examples
const emotionalFeedback = {
  correctAnswer: {
    bad: "✓ Correct",
    good: "🎉 You got it! Nice work!"
  },
  mistake: {
    bad: "✗ Wrong",
    good: "Almost! Here's a hint..."
  },
  milestone: {
    bad: "Level complete",
    good: "🏆 Level 5 unlocked! You're on fire!"
  },
  progress: {
    bad: "50% complete",
    good: "Halfway there! Keep the momentum going 🚀"
  }
};
```

## Smart UI Patterns

Apply these proven patterns for common mobile app scenarios.

```javascript
// User Stage Personalization
const userStagePatterns = {
  newUser: {
    approach: "Simple welcome, guided setup",
    features: "Minimal options, clear onboarding",
    tone: "Encouraging, educational"
  },
  returningUser: {
    approach: "Personalized content, routine-focused",
    features: "Progress indicators, quick actions",
    tone: "Familiar, efficient"
  },
  powerUser: {
    approach: "Advanced stats, optimization tools",
    features: "Dense information, shortcuts",
    tone: "Professional, data-rich"
  }
};

// Smart Search Pattern - Never show blank search
const smartSearchPattern = {
  emptyState: {
    include: [
      "Recent searches",
      "Popular/trending items",
      "Personalized recommendations"
    ],
    avoid: "Blank screen with just search bar"
  }
};

// Selection Over Manual Input
const selectionPattern = {
  approach: "Offer tappable selections for common options",
  elements: [
    "Icons/emojis alongside options",
    "Pre-defined choices for common values",
    "'Other' option with manual input fallback"
  ],
  example: {
    question: "What's your role?",
    options: ["👨‍💻 Developer", "🎨 Designer", "📊 Manager", "Other..."]
  }
};

// Empty State Pattern
const emptyStatePattern = {
  bad: "No items found",
  good: {
    illustration: "Friendly visual",
    message: "Your collection is empty",
    guidance: "Add your first item to get started",
    cta: "Add Item"
  }
};
```

## React/Tailwind Implementation

Implementation guidance for building designs as React components with Tailwind CSS.

```jsx
// Mobile App Card Component Example
import { Heart, Share2, MoreHorizontal } from 'lucide-react';

const AppCard = ({ title, description, image, stats }) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      {/* Image with soft shadow */}
      <div className="relative mb-4">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover rounded-2xl"
        />
        <div className="absolute inset-0 rounded-2xl shadow-inner" />
      </div>

      {/* Typography Hierarchy */}
      <h3 className="text-xl font-semibold text-gray-900 mb-1">
        {title}
      </h3>
      <p className="text-base text-gray-900/70 mb-4">
        {description}
      </p>

      {/* Stats with monospace numbers */}
      <div className="flex gap-6 mb-6">
        {stats.map((stat, i) => (
          <div key={i}>
            <span className="font-mono text-2xl font-semibold text-gray-900">
              {stat.value}
            </span>
            <span className="text-sm text-gray-900/60 ml-1">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Actions in thumb zone */}
      <div className="flex gap-3">
        {/* Primary CTA - 10% accent color */}
        <button className="flex-1 bg-indigo-500 text-white py-3 px-6 rounded-2xl font-medium shadow-sm hover:bg-indigo-600 transition-colors">
          Get Started
        </button>

        {/* Secondary actions */}
        <button className="p-3 bg-indigo-500/5 rounded-2xl text-indigo-500 hover:bg-indigo-500/10 transition-colors">
          <Heart className="w-5 h-5" />
        </button>
        <button className="p-3 bg-indigo-500/5 rounded-2xl text-indigo-500 hover:bg-indigo-500/10 transition-colors">
          <Share2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// Usage
<AppCard
  title="Morning Routine"
  description="Start your day with intention"
  image="/routine.jpg"
  stats={[
    { value: "12", label: "days" },
    { value: "89%", label: "complete" }
  ]}
/>
```

## Spotify's Strategic Principles

Three strategic design principles from Spotify's playbook for creating sticky, shareable experiences.

```javascript
// Spotify's Strategic Principles
const spotifyPrinciples = {

  // 1. The Trojan Horse
  trojanHorse: {
    principle: "Hide complex tech in familiar interfaces",
    implementation: [
      "Wrap sophisticated features in familiar UI patterns",
      "Users don't want to interact with algorithms",
      "They want experiences that feel natural"
    ],
    question: "What's the simplest, most familiar way users can interact with this feature?"
  },

  // 2. The Vanity Mirror
  vanityMirror: {
    principle: "Make sharing about identity, not the app",
    implementation: [
      "Create personal insights so meaningful sharing feels like self-expression",
      "Don't celebrate what users did in your app",
      "Celebrate who they are"
    ],
    examples: {
      bad: "You completed 25 tasks",
      good: "You're a night owl who does their best work after 9 PM"
    }
  },

  // 3. The Comfort Trap
  comfortTrap: {
    principle: "Consistency as a competitive moat",
    implementation: [
      "Every interaction follows the same logic",
      "Feels like it belongs to the same family",
      "Predictable patterns become second nature",
      "Switching costs increase naturally"
    ],
    insight: "Design consistency isn't about aesthetics — it's about creating habits competitors can't replicate"
  }
};
```

## Anti-Patterns to Avoid

Common design mistakes that break visual hierarchy and user experience.

```javascript
// Anti-Patterns Reference
const antiPatterns = {
  // Visual Design Mistakes
  visualMistakes: [
    "Overusing flashy gradients and blur effects",
    "More than 4 font sizes or 3 font weights",
    "Random spacing values (use 8-point grid!)",
    "Pure gray/black shadows on colored backgrounds",
    "Making all information the same visual weight"
  ],

  // UX Mistakes
  uxMistakes: [
    "Hiding key content behind banners or extra taps",
    "Placing CTAs outside the thumb zone",
    "Generic empty states with no guidance",
    "Using sliders for frequent/precise data entry",
    "Emphasizing labels over values"
  ],

  // Examples
  examples: {
    labelEmphasis: {
      bad: { label: "SALES (big)", value: "591 (small)" },
      good: { label: "Sales (small)", value: "591 (big)" }
    },
    shadowColor: {
      bad: "box-shadow: 0 4px 24px rgba(0,0,0,0.3)",
      good: "box-shadow: 0 4px 24px rgba(99,102,241,0.2)"
    }
  }
};
```

## Summary

The Mobile App UI/UX Design skill provides a comprehensive framework for creating professional mobile interfaces through its 5-step design process: understanding context, structuring with UX principles, applying visual design rules (typography, 60/30/10 color, 8-point grid spacing), designing for emotional impact using the Peak-End Rule, and polishing with micro-interactions. It includes industry-specific conventions for 9+ verticals, enabling designers to either follow established patterns for familiarity or intentionally break them to stand out.

The skill integrates seamlessly with modern development workflows through React and Tailwind CSS implementation guidance. Key integration patterns include using Lucide React for iconography, Recharts for data visualization, and CSS transitions for micro-interactions. Whether designing a fitness app dashboard, crypto wallet, banking interface, or meditation app, this skill provides the specific conventions, emotional design principles, and practical implementation details needed to create interfaces that feel smooth, personal, and alive — turning basic features into premium experiences through intentional design choices.

