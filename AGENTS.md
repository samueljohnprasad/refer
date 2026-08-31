# Repository Guidelines

## Project Overview

talk like caveman
use ponytail mode (`/ponytail:ponytail` full mode — minimal code, YAGNI, no boilerplate, `// ponytail:` comments)
use impeccable skill (`impeccable` — distinctive high-end design intelligence for all UI/UX work)
use graphify skill (`graphify` — query/path/explain graph before raw grep/exploration, run `graphify update .` after edits)
use clean-code skill (`clean-code` — readable names, small functions, single responsibility, clean error handling)

Happy is an Expo Router React Native app for gamified CBT journaling and mental health exercises. The product direction is premium, trustworthy, calm, playful, gamified, and engaging like Duolingo. Read `PRODUCT.md` and `DESIGN.md` before making user-facing UI changes.

## Commands

- iOS dev build: `npm run ios`
- Supabase types: `npm run types`

This repo currently has multiple lockfiles (`package-lock.json`, `yarn.lock`, `bun.lock`). Do not change package manager state unless the task requires dependency work.

## Architecture

- Routing lives under `app/` and uses Expo Router.
- Shared app code is mostly under `src/`, with older/shared root folders such as `components/`, `hooks/`, `lib/`, and `constants/`.
- Use the `@/` alias for root-relative imports. It is configured in `tsconfig.json` and `babel.config.js`.
- Global providers are composed in `app/_layout.tsx`.
- Design tokens for raw colors, radii, and theme constants live in `lib/tokens.ts`. Prefer these over new ad hoc hex values when inline styles need raw values.
- UI primitives exist under `components/ui/`; project-specific product components are generally under `src/components/`.

## Code Style

- TypeScript is strict. Keep new code typed and avoid widening with `any` unless matching an existing boundary.
- React components are functional components.
- No React component, hook, or helper file may exceed 300 lines. If a touched component/hook/helper is already over 300 lines, split it before adding behavior.
- Function should have single responsibility. Keep components, hooks, and helpers single-purpose. Extract named helpers/components instead of growing mixed-responsibility files.
- Keep changes scoped to the requested behavior. Avoid broad refactors while fixing local UI or flow issues.
- Use haptics and motion intentionally; this app already uses `expo-haptics`, `pressto`, `react-native-reanimated`, `moti`, `react-native-pulsar`, and `react-native-keyboard-controller`.
- Preserve existing user work. The worktree may be dirty; do not revert or reformat unrelated files.

## UI Direction

- Follow `DESIGN.md`: bright gamified colors, physical 3D button depth, bouncy animations, rounded shapes, and playful interaction patterns.
- Use Nunito throughout. Build hierarchy with weight, size, spacing, and color: 800 for primary prompts, 700 for actions, 600 for choices and labels, and 400 for supporting content.
- Inputs are the primary object on exercise screens. Optional suggestions, AI, and voice controls should feel secondary.
- Avoid generic gradients, decorative ghost cards, sparkle/assistant decoration, oversized arbitrary radii, and monotonous card stacks.
- Keep tap targets large, text readable, and mobile layouts stable across keyboard and safe-area states.

## Verification

- For TypeScript or behavior changes, run the narrowest useful check available.
- For mobile UI changes, prefer verifying in the iOS simulator/dev app when available, especially screens involving keyboard, voice input, gestures, bottom sheets, or animations.
- If verification cannot be run, state that explicitly in the final response.

## Engineering Decision Rules

- Do not make major decisions independently. Stay within the user’s explicit request and existing product direction. Ask for permission before changing a source of truth, architecture, data model, visible content, navigation or user flow, dependencies, scope, or performing a destructive/broad refactor. Do not silently invent alternatives, hide data, remove records, or choose a materially different behavior; report the tradeoff and wait for direction.
- Do not maintain backward compatibility for deprecated code paths. Remove deprecated paths directly instead of adding compatibility layers, fallbacks, or migration plans.
- Under the current requirements, choose the simplest implementation that runs end to end. Avoid abstractions, configuration, and indirection without a concrete need.
- Build progressively: complete the smallest usable version first, then add features on a stable foundation.
- Keep components modular and separate responsibilities clearly.
- Prefer mature, well-maintained libraries when they reduce complexity or improve reliability. Do not reimplement existing capabilities without a clear reason.
- Before implementing functionality or adding dependencies, inspect the capabilities, documentation, and type definitions of existing dependencies.
- Make architectural decisions for long-term evolution. Avoid stopgap solutions that are expected to be replaced.
- Study proven patterns from mature products before designing a new solution from scratch.
- When changing keyboard shortcuts, update `keybindings.ts` and the Keyboard Shortcuts dialog together.
- Do not add subtitles, helper text, or descriptive copy beneath headings, labels, cards, or settings by default. Use concise, self-explanatory labels; add supporting copy only when explicitly requested or needed to prevent misunderstanding or error.
- Keep comments focused on durable reasoning. Do not add comments about minor events, bug fixes, or historical migrations unless they answer an important question future readers will have.
- This project supports iOS 26 and later only. Do not add Android support or fallbacks for iOS versions below 26.
- dont write the test cases


Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
