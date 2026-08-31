# Quickstart & Validation Guide

## 1. Prerequisites

- Happy Journals repository checked out locally.
- iOS Simulator booted (`npm run ios`).
- Ensure no type errors exist (`npx tsc --noEmit`).

## 2. Validation Steps

**Step 1: Check Complexity Limit**
Run the linting check to ensure cyclomatic complexity meets the threshold (max 2).
```bash
npx eslint src/components/exercise/microlearning/microlearningContentValidation.ts
```
Expected Outcome: No complexity warnings or errors for this file.

**Step 2: Check Static Typings**
```bash
npx tsc --noEmit
```
Expected Outcome: 0 type errors.

**Step 3: Visual & Behavioral Validation**
1. Boot the dev app in the iOS Simulator.
2. Navigate to a journey map exercise.
3. Validate that the UI (instructions, subtitle, progress, interaction layout) renders identically to the main branch.
4. Interact with the exercise to verify completion works as expected.

## 3. Reference
- See [`contracts/exercise-config.md`](contracts/exercise-config.md) for the configuration schema.
- See [`data-model.md`](data-model.md) for the global defaults overview.
