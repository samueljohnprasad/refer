---
name: panda-mascot-design
description: Complete design system, generation pipeline, and Duolingo-grade art direction standards for Happy's panda mascot (Happi). Enforces Anti-AI Slop Quality Gates, Mobbin-verified Duolingo illustration rules, and modular separation of concern documentation.
---

# Happi the Panda: Mascot Design System & Creation Skill

This skill defines the visual identity, generation pipeline, Anti-AI Slop Quality Gates, and Duolingo-grade illustration standards for **Happi**, the panda companion in Happy.

---

## Modular Documentation (Separation of Concerns)

The mascot design system is organized into dedicated, single-responsibility files:

1. [**01 - Brand Identity & Anatomical Specifications**](file:///Users/samuelprasad/Desktop/happy/journals/.agents/skills/panda-mascot-design/01-brand-identity-and-anatomy.md)
   * Master reference image [`panda.png`](file:///Users/samuelprasad/Desktop/happy/journals/assets/images/panda/panda.png).
   * 60/40 chibi head-to-body proportions, skull crown tuft, rounded ears, mitten paws.
   * Color token rules: `#FFFFFF` coat, `#1E1E24` charcoal outlines, `#C8BEE6` signature lavender belly heart, `#FCA5A5` blush.

2. [**02 - Duolingo Mascot Design Standards (Mobbin Primary Research)**](file:///Users/samuelprasad/Desktop/happy/journals/.agents/skills/panda-mascot-design/02-duolingo-design-standards.md)
   * 14 verified production Duolingo iOS screens analyzed via Mobbin MCP ([3730667e](https://mobbin.com/screens/3730667e-3607-419e-b2ca-873815f89de9), [31fdc425](https://mobbin.com/screens/31fdc425-1a41-4b78-b4e6-762bff0b9306), [c78046b1](https://mobbin.com/screens/c78046b1-5d17-4225-ad76-2d66a72ac8bd), [8086bc1d](https://mobbin.com/screens/8086bc1d-dede-4e4f-bc90-181f53bd642f)).
   * The 6 Golden Rules of Duolingo Master Illustrators (Geometric construction, 32px squint test, mitten paws, color economy, single-token narrative, emotional mirroring).

3. [**03 - Anti-AI Slop Quality Gate & Acceptance Rubric**](file:///Users/samuelprasad/Desktop/happy/journals/.agents/skills/panda-mascot-design/03-anti-ai-slop-quality-gate.md)
   * 8 instant disqualification checks (realistic fingers, fur texture, stock prop clutter, wobbly strokes, airbrushed gradients, missing heart, bad silhouette, dead smile).
   * 10-point acceptance rubric (10/10 required before merge).

4. [**04 - Live Mascot Asset Catalog & Screen Mapping**](file:///Users/samuelprasad/Desktop/happy/journals/.agents/skills/panda-mascot-design/04-asset-catalog-and-screen-mapping.md)
   * Complete inventory of all 9 live transparent assets in [`assets/images/panda/`](file:///Users/samuelprasad/Desktop/happy/journals/assets/images/panda/).
   * Acting descriptions and target screens in Happy ([`ExerciseFlowRunner.tsx`](file:///Users/samuelprasad/Desktop/happy/journals/src/screens/ExerciseFlowScreen/ExerciseFlowRunner.tsx), [`QuizStressLevelStep.tsx`](file:///Users/samuelprasad/Desktop/happy/journals/src/screens/OnboardingScreen/steps/QuizStressLevelStep.tsx), [`CommonTrapCategoryEngine.tsx`](file:///Users/samuelprasad/Desktop/happy/journals/src/components/exercise/CommonTrapCategoryEngine.tsx)).

5. [**05 - Queued Mascot Poses & Prompt Recipes**](file:///Users/samuelprasad/Desktop/happy/journals/.agents/skills/panda-mascot-design/05-queued-poses-and-prompt-recipes.md)
   * Vetted prompt recipes for `panda-flex`, `panda-transcend`, and `panda-pleading`, ready to generate once image API quota resets (~12:02 UTC).

6. [**06 - Technical Production & Engineering Pipeline**](file:///Users/samuelprasad/Desktop/happy/journals/.agents/skills/panda-mascot-design/06-technical-production-pipeline.md)
   * Step-by-step pipeline: subagent generation → `sips` PNG conversion → `pngjs` BFS flood-fill background transparency → [`HappiExpression`](file:///Users/samuelprasad/Desktop/happy/journals/src/screens/OnboardingScreen/types.ts#L128) union typing → [`HappiMascot.tsx`](file:///Users/samuelprasad/Desktop/happy/journals/src/screens/OnboardingScreen/components/HappiMascot.tsx#L14) component wiring.
