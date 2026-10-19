# Design Direction: Soft Tactile (Playful Calm)

## 1. Concept Sentences (Source Families)

1. **Play (Winner):** *"Happy is a wooden board game with satisfying, chunky tactile pieces that reward every small move."*
2. **Printed Matter:** *"Happy is a botanical field notebook stamped with daily specimen observations and clean ink rules."*
3. **Objects & Materials:** *"Happy is a precision ceramic tea set where every tool rests in its own tactile groove."*

---

## 2. Direction Evaluation

### A. Field Notebook (Printed Matter)
- **Type:** Condensed grotesque for data, serif headline, ink rules.
- **Color:** Warm newsprint ground (`#F5F5F0`), bone white panels, jet black ink.
- **Verdict:** Elegant for reading, but cold and static for interactive CBT exercises. Lacks the dopamine and feedback loop that keeps users practicing daily.

### B. Native Sharpened (Instrument / System)
- **Type:** SF Pro Heavy, SF Mono for stats, Apple Liquid Glass chrome.
- **Color:** iOS grouped background (`#F2F2F7`), system green accent.
- **Verdict:** Feels like a default Apple utility (Notes or Health). Lacks the playful warmth, emotional safety, and Duolingo-grade delight of Happy.

### C. Soft Tactile — Playful Calm (WINNER)
- **Type:** Nunito throughout (800 for display/titles, 700 for actions, 600 for labels/chips, 400 for input).
- **Color:** Sage canvas (`#F8FAF7`), pure white writing surfaces, sage-500 (`#5F7F58`) with sage-700 (`#29452A`) 3D physical rim depth.
- **Physicality:** Physical button depth (`border-2 border-b-[4px]` or `[5px]`), Apple continuous squircles (`borderCurve: "continuous"`), instant active press sink (`translateY: 2.5px`), rich haptics.
- **Clarity:** Direct single-mode writing (no awkward "+ Add" buttons for single thoughts). Inputs glow with sage focus.

---

## 3. Design Tokens

### Colors
```ts
export const DIRECTION_TOKENS = {
  canvas: "#F8FAF7",             // Warm sage tinted ground (60%)
  surface: "#FFFFFF",            // Pure crisp white card surface (30%)
  surfaceElevated: "#F3F7F2",    // Soft sage pill background
  inkPrimary: "#142414",         // Deep forest ink for headings & input
  inkSecondary: "#526B50",       // Sage-tinted body & captions
  inkMuted: "#8FA38D",           // Faint placeholders & borders
  brandPrimary: "#5F7F58",       // Vibrant sage face (10%)
  brandPressed: "#29452A",       // Dark tactile rim (3D depth)
  borderDefault: "#E5E9E2",      // Neutral tactile card border
  borderDepth: "#D0D7CC",        // Card bottom rim depth
  borderFocused: "#5F7F58",      // Active input border
  borderFocusedDepth: "#29452A", // Active input bottom rim depth
  disabledFace: "#E5E7EB",       // Duolingo-grade disabled button face
  disabledRim: "#CBD5E1",        // Duolingo-grade disabled button 3D rim
  disabledLabel: "#9CA3AF",      // Disabled text
};
```

### Typography Roles (Nunito)
- **Prompt / H1:** 28px, Weight 800, leading 34px, tracking -0.01em
- **Subtitle / Body:** 16px, Weight 500, leading 23px
- **Composer Input:** 17px, Weight 600, leading 25px
- **Primary Action (CTA):** 17px, Weight 700, tracking 0.01em
- **Guidance & Chips:** 13-14px, Weight 600

### Tactile Rules
1. **Cards & Inputs:** `border-2 border-b-[4px]` with darker bottom rim; squircle continuous radius (`rounded-3xl` / 24px).
2. **Buttons:** Full pill `rounded-full`, physical rim depth (`border-b-[4px]` or `SvgAppButton`), instant translateY sink on press.
3. **No "+ Add" on Single Input:** Direct writing with live state update; Continue CTA lights up reactively.
4. **Suggestions & Disclosures:** Soft pill containers, never raw horizontal divider lines across the screen.
5. **Seamless Chrome:** Header background matches canvas (`#F8FAF7`) with 12px rounded capsule progress bar.


  1. Pipeline Architecture: Visual Mermaid flowchart from Phase 0 to Phase 6.
  2. Phase Breakdown Table:
      • Phase 0 (Setup): agent-update-manager
      • Phase 1 (Recon): market-research-analyst + competitive-intelligence-agent
      • Phase 2 (Strategy): marketing-director + brand-strategist + customer-journey-funnel-
      strategist
      • Phase 3 (Creative): video-pattern-reverse-engineer + growth-creative-agent + content-
      strategist
      • Phase 4 (Channels): video-creative-director + landing-page-conversion-specialist +
      seo-aio-strategist + paid-ads-specialist + social-media-engagement-agent + influencer-
      partnership-strategist
      • Phase 5 (Retention): email-lifecycle-marketer + crm-customer-retention-agent +
      marketing-automation-specialist
      • Phase 6 (Gate): analytics-optimization-analyst + ethics-compliance-reviewer
  3. Execution Contract: Specific inputs, agent assignments, and deliverables defined per
  phase.


  Most relevant groups:
- Market intelligence: market-pulse, market-movers, market-research-analyst
- Competitors: competitor-analysis, competitor-tracking
- ASO: aso-audit, keyword-research, seasonal-aso, android-aso, asc-aso-audit
- Advertising: paid-ads-specialist, apple-search-ads, asc-apple-ads
- Strategy: marketing-orchestrator, marketing-director, monetization-strategy
- Growth/content: growth-creative-agent, creator-ugc-marketing
- Retention/CRM: retention-engagement, retention-optimization, email-lifecycle-marketer, marketing-automation-specialist, crm-customer-retention-agent
- Research workflow: research, research-to-decision