# Jump Back In (Recent Exercises) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the manual "Pinned Favorites" section with an auto-populated "Jump Back In" section tracking recent exercises.

**Architecture:** Use `@react-native-async-storage/async-storage` to persist an array of the most recent exercise IDs. Expose a custom hook to read/write this array, and update the `ExercisesScreen` UI to render the top 2 elements from this array.

**Tech Stack:** React Native, Expo, AsyncStorage

## Global Constraints

- Max 5 items stored in history
- Default fallbacks: "pmr" and "breathing-box"
- No UI for adding/reordering (read-only shelf)

---

### Task 1: Create `useRecentExercises` Hook

**Files:**
- Create: `src/hooks/useRecentExercises.ts`

**Interfaces:**
- Consumes: `@react-native-async-storage/async-storage`
- Produces: `useRecentExercises` (returns `recentIds`), `trackRecentExercise` (function to log an exercise)

- [ ] **Step 1: Write the hook implementation**

```typescript
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@recent_exercises';
const MAX_ITEMS = 5;

// Shared tracker so it can be called anywhere (e.g. from a completion screen)
export const trackRecentExercise = async (exerciseId: string) => {
  try {
    const currentJSON = await AsyncStorage.getItem(STORAGE_KEY);
    let currentList: string[] = currentJSON ? JSON.parse(currentJSON) : [];
    
    // Remove if already exists to move it to the front
    currentList = currentList.filter(id => id !== exerciseId);
    
    // Add to front
    currentList.unshift(exerciseId);
    
    // Truncate to max
    currentList = currentList.slice(0, MAX_ITEMS);
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(currentList));
  } catch (error) {
    console.error('Failed to track recent exercise:', error);
  }
};

export const useRecentExercises = () => {
  const [recentIds, setRecentIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) {
          setRecentIds(JSON.parse(json));
        }
      } catch (error) {
        console.error('Failed to fetch recent exercises:', error);
      }
    };
    
    fetchRecent();
  }, []); // Note: this only fetches on mount. Real-time sync would require a context, but mount is fine for this screen.

  return { recentIds };
};
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useRecentExercises.ts
git commit -m "feat: add useRecentExercises hook for local storage tracking"
```

### Task 2: Update ExercisesScreen UI

**Files:**
- Modify: `src/screens/ExercisesScreen/ExercisesScreen.tsx`

**Interfaces:**
- Consumes: `useRecentExercises`, `trackRecentExercise`

- [ ] **Step 1: Import the hook**

```typescript
// Add at the top of src/screens/ExercisesScreen/ExercisesScreen.tsx
import { useRecentExercises, trackRecentExercise } from "@/src/hooks/useRecentExercises";
```

- [ ] **Step 2: Replace Pinned Favorites component logic**

Replace the current `PinnedFavorites` or the block defining `items` and `emptySlots` (lines ~506-520) with:

```typescript
  const { recentIds } = useRecentExercises();
  
  // Map IDs to actual exercise config objects
  // If no recents, default to box breathing and PMR
  const defaultIds = ["breathing-box", "pmr"];
  const displayIds = recentIds.length > 0 ? recentIds.slice(0, 2) : defaultIds;
  
  const items = displayIds.map(id => exercises.find(ex => ex.type === id)).filter(Boolean) as ExerciseConfig<any>[];
```

- [ ] **Step 3: Update tracking on press**

Modify the `onPress` wrapper inside `ExercisesScreen` or `renderItem` so that when a user presses an exercise card, it calls `trackRecentExercise`:

```typescript
  // Find where the shelf renders items and modify the onPress prop:
  const handleExercisePress = useCallback((exercise: ExerciseConfig<any>) => {
    trackRecentExercise(exercise.type);
    onPress(exercise);
  }, [onPress]);
  
  // Replace references of `onPress={onPress}` with `onPress={handleExercisePress}` 
  // inside the rendering functions (like renderItem).
```

- [ ] **Step 4: Rewrite the Section Header and Content**

Replace the drag-and-drop `Sortable.Grid` block and the "+ Add exercise" empty slots mapped over `emptySlots` with a simple horizontal scroll view (lines ~521-560):

```tsx
    <View style={{ marginBottom: 40 }}>
      <View style={[nutrieStyles.sectionHeader, { paddingTop: 16 }]}>
        <View style={[nutrieStyles.categoryBadge, { backgroundColor: "transparent", paddingHorizontal: 0 }]}>
          <Text style={[nutrieStyles.categoryBadgeText, { color: INK_MUTED }]}>
            Jump Back In
          </Text>
        </View>
      </View>

      <View style={{ marginHorizontal: -CAROUSEL_PEEK, marginTop: 12 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: CAROUSEL_GAP, paddingHorizontal: CAROUSEL_PEEK }}
          snapToInterval={SHELF_CARD_WIDTH + CAROUSEL_GAP}
          decelerationRate="fast"
        >
          {items.map(item => (
             <View key={item.type} style={{ width: SHELF_CARD_WIDTH }}>
               <ExerciseShelfCard exercise={item} onPress={handleExercisePress} />
             </View>
          ))}
        </ScrollView>
      </View>
    </View>
```

- [ ] **Step 5: Clean up unused imports**

Remove `import Sortable from "react-native-sortables"` or any unused states (`setItems`) related to the old drag-and-drop.

- [ ] **Step 6: Commit**

```bash
git add src/screens/ExercisesScreen/ExercisesScreen.tsx
git commit -m "feat: replace pinned favorites with jump back in recent exercises"
```
