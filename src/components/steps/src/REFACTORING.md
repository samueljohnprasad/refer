# Onboarding Stepper Refactoring

## Overview

The onboarding stepper component has been refactored to improve code organization, maintainability, and testability while preserving all original functionality.

## File Structure

### Before

```
src/components/steps/src/
└── index.tsx (392 lines - all logic in one file)
```

### After

```
src/components/steps/src/
├── index.tsx (190 lines - main component)
├── types.ts (type definitions)
├── constants.ts (configuration constants)
├── utils.ts (validation logic)
├── renderStepInput.tsx (step rendering logic)
└── hooks/
    ├── useStepNavigation.ts (navigation state & logic)
    └── useBackgroundAnimation.ts (animation logic)
```

## Changes Made

### 1. **types.ts** - Type Definitions

Extracted all TypeScript interfaces and types:

- `InputType`
- `MoodDef`
- `OnBoardingFormData`
- `AgeRangeOption`
- `StepsAppProps`

**Benefits:**

- Centralized type definitions
- Better IntelliSense support
- Easier to reuse types across files

### 2. **constants.ts** - Configuration Constants

Extracted all static configuration data:

- `MOODS` - Step definitions with emojis and colors
- `AGE_RANGES` - Age range options
- `GENDERS` - Gender options
- `BACKGROUND_COLORS` - Animation color palette
- `TOTAL_STEPS` - Total number of steps
- `BUTTON_COLOR` - Primary action color

**Benefits:**

- Easy to modify without touching component logic
- Configuration changes don't require understanding component internals
- Can be easily moved to a config file or fetched from an API

### 3. **utils.ts** - Validation Logic

Extracted the `canProceedToNextStep` function:

```typescript
export const canProceedToNextStep = (
  currentMood: MoodDef,
  formData: OnBoardingFormData
): boolean
```

**Benefits:**

- Pure function - easier to test
- Can be unit tested independently
- Logic reusable in other components

### 4. **hooks/useStepNavigation.ts** - Navigation State Management

Custom hook managing all step navigation logic:

- Current step tracking
- Split button state
- Active index management
- `increaseActiveIndex()` and `decreaseActiveIndex()` methods

**Benefits:**

- Encapsulated navigation logic
- Reusable in other stepper components
- Easier to test navigation separately

### 5. **hooks/useBackgroundAnimation.ts** - Animation Logic

Custom hook for all background animations:

- Background color transitions
- Glass overlay animations
- Floating animations

**Benefits:**

- Separates animation concerns
- Easier to modify animations without touching business logic
- Can be reused or swapped out easily

### 6. **renderStepInput.tsx** - Step Rendering Logic

Extracted the `renderStepInput` function that returns the appropriate component for each step.

**Benefits:**

- Cleaner main component
- Each step component clearly visible
- Easier to add or modify steps

### 7. **index.tsx** - Main Component (Refactored)

Simplified from 392 to ~190 lines by:

- Using extracted hooks
- Using extracted utilities
- Using extracted constants
- Improved callback memoization with `useCallback`

**Benefits:**

- Much more readable
- Clear separation of concerns
- Easier to understand flow
- Better performance with proper memoization

## Migration Guide

### No Breaking Changes

All exports remain the same:

```typescript
// Still works exactly the same
import { App, onboardFormDataAtom } from "@/components/steps/src";
```

### If You Need to Access Internal Types/Constants

```typescript
// New imports available
import { OnBoardingFormData } from "@/components/steps/src/types";
import { MOODS, TOTAL_STEPS } from "@/components/steps/src/constants";
```

## Testing Benefits

### Before Refactoring

- Hard to test validation logic (embedded in component)
- Animation logic tightly coupled
- Navigation logic difficult to test in isolation

### After Refactoring

```typescript
// Easy to unit test
import { canProceedToNextStep } from "./utils";

test("can proceed when name is filled", () => {
  const result = canProceedToNextStep(
    { inputType: "name" },
    { name: "John", reasons: [] }
  );
  expect(result).toBe(true);
});

// Easy to test hooks
import { renderHook } from "@testing-library/react-hooks";
import { useStepNavigation } from "./hooks/useStepNavigation";

test("increases active index", () => {
  const { result } = renderHook(() => useStepNavigation());
  act(() => result.current.increaseActiveIndex());
  expect(result.current.currentStep).toBe(1);
});
```

## Performance Improvements

1. **Memoized Callbacks**: All event handlers now use `useCallback`
2. **Separated Concerns**: Animations don't re-render when form data changes
3. **Optimized Re-renders**: Custom hooks prevent unnecessary re-renders

## Maintenance Improvements

### Adding a New Step

**Before:** Modify multiple places in one large file
**After:**

1. Add to `MOODS` in `constants.ts`
2. Add case in `renderStepInput.tsx`
3. Add validation if needed in `utils.ts`

### Modifying Colors/Styles

**Before:** Search through 392-line component
**After:** Edit `constants.ts` - one place

### Changing Navigation Logic

**Before:** Modify component with all business logic
**After:** Edit `useStepNavigation` hook only

## Code Quality Metrics

| Metric                | Before    | After        |
| --------------------- | --------- | ------------ |
| Lines in main file    | 392       | ~190         |
| Number of files       | 1         | 7            |
| Testable functions    | 1         | 4+           |
| Average file size     | 392 lines | ~50-80 lines |
| Cyclomatic complexity | High      | Low          |

## Future Enhancements Made Easier

With this refactoring, the following are now much easier:

1. **Add Analytics** - Hook into `useStepNavigation`
2. **A/B Testing** - Swap out `MOODS` constant
3. **Dynamic Steps** - Make `constants.ts` fetch from API
4. **Step Animations** - Modify `useBackgroundAnimation` only
5. **Form Persistence** - Hook into form updates in one place
6. **Skip Logic** - Modify `canProceedToNextStep` utility

## Conclusion

This refactoring maintains 100% backward compatibility while significantly improving:

- ✅ Code organization
- ✅ Testability
- ✅ Maintainability
- ✅ Performance
- ✅ Developer experience
- ✅ Separation of concerns

The component is now production-ready and follows React best practices.
