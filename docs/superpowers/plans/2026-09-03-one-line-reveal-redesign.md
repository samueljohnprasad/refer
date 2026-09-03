# OneLineReveal UI Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish the OneLineReveal exercise by removing artificial card styles, extraneous metadata, and mismatched text colors to fit the app's clean flat aesthetic.

**Architecture:** We will update `OneLineRevealCategoryEngine.tsx`'s `StyleSheet` to match the exact visual audit, removing drop shadows, unifying text colors, integrating the "Why it matters" block gracefully, and removing the extraneous "One idea, one tap" note. Note: Transforming the underlying interaction to a predictive choice requires database content changes, so this plan focuses on the client-side UI and flow execution for the existing schema.

**Tech Stack:** React Native, Expo, TypeScript.

## Global Constraints

- No components, hooks, or helpers may exceed 300 lines.
- Follow `DESIGN.md`: bright gamified colors, clean flat bento grid structures, no heavy shadows.
- Preserve existing user work; only touch what is necessary.

---

### Task 1: Update OneLineRevealCategoryEngine UI

**Files:**
- Modify: `src/components/exercise/OneLineRevealCategoryEngine.tsx`

**Interfaces:**
- Consumes: Existing `OneLineRevealData` from the `content` prop.
- Produces: A cleaner, flat-styled `View` with no drop shadows, no "One idea..." note, and unified text colors.

- [ ] **Step 1: Convert styles and remove extraneous elements**
Modify `OneLineRevealCategoryEngine.tsx` to:
1. Remove `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius` from `ideaCard` and add `borderWidth: 2`, `borderColor: SEMANTIC_COLORS.border.strong`.
2. Delete the `<Text style={styles.note}>` block entirely.
3. Change `styles.secondLine` color from `SEMANTIC_COLORS.brand.pressed` to `SEMANTIC_COLORS.text.primary` (so it matches `styles.firstLine`).
4. Simplify `whyCard` so it flows naturally (already done via schema checks, ensure it only renders if `why` exists).

```tsx
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import {
  COURSE_EXERCISE_FONTS,
  SEMANTIC_COLORS,
} from "@/src/components/exercise/courseExerciseTheme";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

export function OneLineRevealCategoryEngine({
  exercise,
  savedResponse,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const revealed = saved?.revealed === true;

  useEffect(() => {
    if (!saved) {
      onInteraction(
        {
          format: CourseExerciseCategoryEnum.OneLineReveal,
          phase: "reveal",
          revealed: false,
          isCorrect: true,
        },
        true,
      );
    }
  }, [onInteraction, saved]);

  return (
    <View style={styles.screenContent}>
      <CourseExerciseHeading
        title={readString(content.title) ?? "One idea"}
        instruction={readString(content.instruction) ?? "Tap to reveal."}
      />
      <View style={styles.ideaCard}>
        <Text style={styles.firstLine}>{readString(content.firstLine)}</Text>
        {revealed ? (
          <Text style={styles.secondLine}>
            {readString(content.secondLine)}
          </Text>
        ) : null}
      </View>
      
      {revealed && readString(content.why) ? (
        <View style={styles.whyCard}>
          <View style={styles.checkCircle}>
            <Text style={styles.check}>✓</Text>
          </View>
          <View style={styles.whyCopy}>
            <Text style={styles.whyTitle}>
              {readString(content.whyTitle) ?? "Why it matters"}
            </Text>
            <Text style={styles.whyBody}>{readString(content.why)}</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 12,
  },
  ideaCard: {
    minHeight: 240,
    justifyContent: "center",
    gap: 14,
    paddingHorizontal: 26,
    paddingVertical: 30,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: SEMANTIC_COLORS.border.strong,
    backgroundColor: SEMANTIC_COLORS.surface.primary,
  },
  firstLine: {
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.heading,
    fontSize: 24,
    lineHeight: 31,
  },
  secondLine: {
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.heading,
    fontSize: 24,
    lineHeight: 31,
  },
  whyCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 11,
    marginTop: 16,
    paddingHorizontal: 17,
    paddingVertical: 15,
    borderWidth: 1.5,
    borderColor: SEMANTIC_COLORS.brand.primary,
    borderRadius: 24,
    backgroundColor: SEMANTIC_COLORS.brand.soft,
  },
  checkCircle: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: SEMANTIC_COLORS.brand.primary,
  },
  check: {
    color: SEMANTIC_COLORS.surface.primary,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 14,
  },
  whyCopy: { flex: 1 },
  whyTitle: {
    color: SEMANTIC_COLORS.brand.pressed,
    fontFamily: COURSE_EXERCISE_FONTS.heading,
    fontSize: 16,
    lineHeight: 20,
  },
  whyBody: {
    marginTop: 7,
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 13.5,
    lineHeight: 20,
  },
});
```

- [ ] **Step 2: Typecheck the changes**
Run `npx tsc --noEmit` to verify types.
Expected: PASS

- [ ] **Step 3: Commit**
Run `git add src/components/exercise/OneLineRevealCategoryEngine.tsx` and commit with message "style(exercise): polish OneLineReveal UI per design audit".
