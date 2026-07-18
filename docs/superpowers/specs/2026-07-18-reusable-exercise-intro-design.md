# Reusable Exercise Intro Design

## Goal

Replace the current mixed intro treatments with one reusable exercise intro system that works across all exercise categories, starting with the existing `IntroStep` path.

## Problem

The app currently has multiple intro looks inside one shared step:

- a legacy default layout
- a `simplified_timeline` branch used by Thought Reframing

This creates inconsistent spacing, hierarchy, hero treatment, and sequence rhythm across exercises. It also makes new flows likely to drift again.

## Decision

Keep the current config-driven architecture and standardize all exercise intros through one shared component system behind `IntroStep`.

## UX Direction

- One canonical intro layout for all exercises
- Duration pill at top center
- Calm hero block with mascot
- Cormorant title, Geist subtitle
- Vertical sequence list as the default structure for guided exercises
- Stable footer spacing so CTA placement feels identical across flows

## Component Model

Create reusable intro primitives under `src/components/exercise/intro/`:

- `ExerciseIntro`
- `ExerciseIntroDurationPill`
- `ExerciseIntroHero`
- `ExerciseIntroSequence`

`IntroStep` remains the config-facing adapter so existing exercise configs do not need a new rendering system.

## Data Contract

Keep the existing config content model with small cleanup:

- `title`
- `subtitle`
- `duration`
- `bulletPoints`
- `mascotState`

Remove `layoutVariant`. The shared intro should render one consistent layout by default.

## Migration Scope

Update all exercises currently using `IntroStep` to rely on the unified intro system. No screen-specific intro branches should remain after migration.

## Constraints

- Follow `DESIGN.md` tokens and hierarchy
- Do not introduce ad hoc colors when tokens already exist
- Keep changes scoped to intro rendering and intro config usage
- Remove stale intro-only code once all consumers are migrated

## Verification

- Type-check changed files as narrowly as practical
- Search for remaining `layoutVariant` intro usage
- Confirm all `IntroStep` consumers still compile against the shared contract
