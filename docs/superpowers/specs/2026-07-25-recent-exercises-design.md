# Jump Back In (Recent Exercises) Design Spec

## Feature Summary
Replace the static, manually-curated "Pinned Favorites" section on the Exercises Screen with a dynamic "Jump Back In" section that automatically displays the user's most recently completed exercises.

## 1. Data Flow & Storage
- **Local Persistence:** Use the app's existing local storage solution (e.g., MMKV) to persist a simple array of strings `recent_exercises`.
- **Update Logic (`trackRecentExercise`):** 
  - Called upon completion (or initiation) of an exercise.
  - Takes the `exerciseId` as input.
  - Removes the ID if it already exists in the list to prevent duplicates.
  - Prepends the new ID to the start of the list.
  - Slices the array to keep a maximum of 5 items.

## 2. Default State & Fallbacks
- When the `recent_exercises` array is empty (first-time users, or fresh app installs), the system must provide default recommendations to avoid empty space.
- **Defaults:** Automatically return the objects for `Box Breathing` and `Progressive Muscle Relaxation` (or equivalent safe, universal exercises defined in the configuration).

## 3. UI Implementation (`ExercisesScreen.tsx`)
- **Remove Obsolete Logic:** Delete `react-native-sortables` usage, drag-and-drop mechanics, and the dotted "+ Add exercise" empty slots.
- **Section Headers:** 
  - Change section title from "Pinned Favorites" to "Jump Back In".
  - Remove the instructional subtitle about long-pressing to reorder.
- **Layout:** Use a standard horizontal `ScrollView` or `FlatList`.
- **Card Rendering:** Render exactly 2 exercise cards based on the top items returned by the storage hook.

## 4. Interaction Model
- The cards behave identically to standard shelf cards. Pressing them directly launches the corresponding exercise detail or flow.
- No editing, pinning, or deletion interactions are required for this section. It is purely read-only from the user's perspective.
