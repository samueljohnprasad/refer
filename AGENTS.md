# Repository Guidelines

## Project Overview

talk like caveman
use ponytail mode (`/ponytail:ponytail` full mode — minimal code, YAGNI, no boilerplate, `// ponytail:` comments)
use impeccable skill (`impeccable` — distinctive high-end design intelligence for all UI/UX work)
use graphify skill (`graphify` — query/path/explain graph before raw grep/exploration, run `graphify update .` after edits)

Happy is an Expo Router React Native app for calm CBT journaling and mental health exercises. The product direction is premium, editorial, calm, and trustworthy. Read `PRODUCT.md` and `DESIGN.md` before making user-facing UI changes.

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
- Keep changes scoped to the requested behavior. Avoid broad refactors while fixing local UI or flow issues.
- Use haptics and motion intentionally; this app already uses `expo-haptics`, `pressto`, `react-native-reanimated`, `moti`, `react-native-pulsar`, and `react-native-keyboard-controller`.
- Preserve existing user work. The worktree may be dirty; do not revert or reformat unrelated files.

## UI Direction

- Follow `DESIGN.md`: sage/white/dark green ink, quiet tonal layering, strong typography, and restrained surfaces.
- Use Cormorant for reflective titles and completion moments; use Geist for labels, controls, body copy, and operational UI.
- Inputs are the primary object on exercise screens. Optional suggestions, AI, and voice controls should feel secondary.
- Avoid generic gradients, decorative ghost cards, sparkle/assistant decoration, oversized arbitrary radii, and monotonous card stacks.
- Keep tap targets large, text readable, and mobile layouts stable across keyboard and safe-area states.

## Verification

- For TypeScript or behavior changes, run the narrowest useful check available.
- For mobile UI changes, prefer verifying in the iOS simulator/dev app when available, especially screens involving keyboard, voice input, gestures, bottom sheets, or animations.
- If verification cannot be run, state that explicitly in the final response.
