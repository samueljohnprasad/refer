# Implementation Plan: Journal Entry Zoom Transition

This plan details the implementation of a native shared element transition (using Expo Router's `Link.AppleZoom`) from the `EntryCard` in the Daily Notes list to the `JournalEntryScreen` detail view.

## 1. Goal
To create a seamless, Apple-native zoom transition where an individual Journal Entry card visually expands to become the full-screen background gradient of the Journal Entry detail screen.

## 2. Source Component: `EntryCardsView.tsx` & `EntryCard`

Currently, `EntryCard` uses an imperative `onPress` which triggers `router.push("/tabs/screens/journal-entry")` via its parent container. To support the native zoom transition, we must move to a declarative `<Link>` structure.

### Key Changes
1. **Declarative Routing**: Replace the root `<Pressable>` in `EntryCard` with an Expo Router `<Link>` wrapping a `<Link.Trigger>`.
2. **Visual Matching**: The target screen (`JournalEntryScreen`) uses a full-screen `LinearGradient` based on the entry's mood. For the best visual handoff, `EntryCard` should also use a colored background (or gradient) representing the mood, rather than just a transparent row.
3. **The AppleZoom Wrapper**: Wrap the card's background/visual container in `<Link.AppleZoom>`. 

**Implementation Details:**
```tsx
import { Link } from "expo-router";

// Inside EntryCard component:
<Link 
  href={{ pathname: "/tabs/screens/journal-entry" }} // Note: you'll need to pass the entry ID via params or global state as you currently do
  asChild
>
  <Link.Trigger>
    <Pressable className="py-4 ...">
      {/* 
        CRITICAL: The element inside Link.AppleZoom must be the direct child and 
        ideally have explicit bounds/styles so the layout engine can measure it.
      */}
      <Link.AppleZoom>
        <View style={{ backgroundColor: getMoodColor(entry.moods?.main_mood), borderRadius: 16 }}>
          {/* Card Content (Title, Transcript Excerpt, Date, Metadata) */}
        </View>
      </Link.AppleZoom>
    </Pressable>
  </Link.Trigger>
</Link>
```

## 3. Destination Component: `JournalEntryScreen.tsx`

Currently, `JournalEntryScreen` renders a `LinearGradient` as its root view, containing a `KeyboardAvoidingView` and `ScrollView`.

### Key Changes
1. **The Target Wrapper**: Wrap the main `LinearGradient` in `<Link.AppleZoomTarget>`. 
2. **Consistent Routing Configuration**: Ensure `app/tabs/screens/journal-entry.tsx` is still configured as a `fullScreenModal` or standard screen. The zoom transition will hijack the default presentation animation.

**Implementation Details:**
```tsx
import { Link } from "expo-router";

// Inside JournalEntryScreen.tsx return block:
<Link.AppleZoomTarget>
  <LinearGradient
    colors={currentGradient as [string, string, ...string[]]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    className="flex-1"
    style={{ flex: 1, paddingTop: top, paddingBottom: bottom }}
  >
    <KeyboardAvoidingView ...>
      <ScrollView ...>
        {/* Entry Content */}
      </ScrollView>
    </KeyboardAvoidingView>
  </LinearGradient>
</Link.AppleZoomTarget>
```

## 4. State Management Adjustments
Currently, `MentalHealthProfileContainer` sets the selected entry in Jotai state (`selectedJournalEntryAtom`) *before* pushing the route.
When moving to declarative `<Link>` routing:
*   **Option A**: Update the Jotai atom in an `onPressOut` or `onPressIn` handler on the `<Pressable>` inside the link, ensuring state is set just before the transition starts.
*   **Option B (Preferred)**: Pass the `entry.id` as a URL param in the `<Link href={{ pathname: "...", params: { id: entry.id } }}>` and refactor `journal-entry.tsx` to read the ID from `useLocalSearchParams()` and load the data.

## 5. Potential Pitfalls
*   **Text Reflow**: If the text inside the card is vastly different in layout compared to the detail screen, the text might visually "snap" or fade during the transition. To mitigate this, ensure the `Link.AppleZoom` specifically wraps the *background container* and allows the text to naturally fade/crossfade via the default OS behavior.
*   **Dynamic Sizes**: The `EntryCard` height is currently dynamic based on the excerpt. If the OS struggles to measure the dynamic height before the animation fires, you may need to give the card a fixed height or `minHeight`.

## 6. Implementation Tasks

- [ ] **Task 1: Update State Management & Routing (Preparation)**
  - Update `JournalEntryRoute` (`app/tabs/screens/journal-entry.tsx`) to read the `id` from `useLocalSearchParams()`.
  - Ensure the route gracefully loads the journal entry data (or falls back to the Jotai atom if pre-loaded) so that declarative `<Link>` navigation with params works.
  
- [ ] **Task 2: Refactor `MentalHealthProfileContainer`**
  - Remove the imperative `router.push("/tabs/screens/journal-entry")` from the `handleEntryPress` callback.
  - Rely on the `EntryCard`'s internal `<Link>` to handle the actual navigation.

- [ ] **Task 3: Refactor `EntryCard` to use `<Link>`**
  - Wrap the `EntryCard` component's return block (the `<Pressable>`) in a `<Link href={{ pathname: "/tabs/screens/journal-entry", params: { id: entry.id } }} asChild>`.
  - Wrap the inner `<Pressable>` with `<Link.Trigger>`.
  
- [ ] **Task 4: Apply `<Link.AppleZoom>` (Source Component)**
  - Apply a background color/gradient to the `EntryCard` that matches its `main_mood` (using the same `MOOD_GRADIENTS` logic).
  - Wrap the background container/view inside the `EntryCard` with `<Link.AppleZoom>`.
  
- [ ] **Task 5: Apply `<Link.AppleZoomTarget>` (Destination Component)**
  - In `JournalEntryScreen.tsx`, wrap the main `LinearGradient` component with `<Link.AppleZoomTarget>`.
  
- [ ] **Task 6: Test & Polish**
  - Run on iOS simulator/device to test the transition.
  - Adjust margins, padding, and text crossfading to ensure a buttery smooth hand-off without layout popping.
