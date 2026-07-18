# Reusable Exercise Intro Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship one reusable intro component system for all exercises and remove stale intro variants.

**Architecture:** Keep `IntroStep` as the adapter used by exercise configs, but move visual structure into focused intro primitives under `src/components/exercise/intro/`. Migrate all exercise configs to the unified contract and delete obsolete variant logic.

**Tech Stack:** React Native, Expo Router, TypeScript, NativeWind utility classes, app design tokens from `lib/tokens.ts`

## Global Constraints

- Keep `IntroStep` as the config-facing entry point
- Remove `layoutVariant` from intro usage
- Reuse `lib/tokens.ts` values instead of new raw colors where possible
- Preserve existing exercise config architecture
- Keep the refactor scoped to intro rendering and its current consumers

---

### Task 1: Record the shared intro contract

**Files:**
- Create: `docs/superpowers/specs/2026-07-18-reusable-exercise-intro-design.md`
- Create: `docs/superpowers/plans/2026-07-18-reusable-exercise-intro.md`

**Interfaces:**
- Consumes: current `IntroStep` props and current exercise config usage
- Produces: written contract for the implementation

- [ ] Write the design doc
- [ ] Write the implementation plan

### Task 2: Extract reusable intro primitives

**Files:**
- Create: `src/components/exercise/intro/ExerciseIntro.tsx`
- Create: `src/components/exercise/intro/ExerciseIntroDurationPill.tsx`
- Create: `src/components/exercise/intro/ExerciseIntroHero.tsx`
- Create: `src/components/exercise/intro/ExerciseIntroSequence.tsx`
- Create: `src/components/exercise/intro/index.ts`
- Modify: `src/components/exercise/steps/IntroStep.tsx`

**Interfaces:**
- Consumes: `title`, `subtitle`, `duration`, `bulletPoints`, `mascotState`
- Produces: one shared visual intro implementation with no layout branching

- [ ] Build the intro primitives with token-based styling
- [ ] Refactor `IntroStep` into a thin adapter over the new primitives
- [ ] Remove legacy default-vs-variant rendering branches

### Task 3: Migrate exercise configs

**Files:**
- Modify: `src/exercises/thoughtReframing/config.ts`
- Modify: every other `src/exercises/*/config.ts` file that currently passes `IntroStep` props

**Interfaces:**
- Consumes: existing `createStep(IntroStep, ...)` usage
- Produces: unified intro usage with no `layoutVariant`

- [ ] Remove stale intro variant props from configs
- [ ] Keep copy and step lists intact unless a config requires minor normalization

### Task 4: Verify and clean stale references

**Files:**
- Modify: any barrel exports touched by the intro extraction

**Interfaces:**
- Consumes: repo-wide intro references
- Produces: no remaining stale intro variant usage

- [ ] Search for remaining `layoutVariant` references
- [ ] Run narrow TypeScript verification for the edited path
- [ ] Run `git diff --check`
