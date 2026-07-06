# LearnCards Component Design

## Objective
Implement the `LearnCardsExercise` component, which replaces the existing placeholder with a functional, premium-looking horizontal card carousel. This component will handle displaying a series of educational cards (image + text) and gating the user's progress until they review all cards.

## Component Architecture
**File to Modify:** `src/components/exercise/LearnCardsExercise.tsx`

### Layout & UI
1. **Container:** A full-width, flexible container (`flex-1`) optimized for the standard `LessonScreen` wrapping it.
2. **Carousel (Horizontal ScrollView):** 
   - `ScrollView` with `horizontal`, `pagingEnabled`, `showsHorizontalScrollIndicator={false}`.
   - `onScroll` handler paired with `scrollEventThrottle={16}` to track the current active card index smoothly.
3. **Card Item:**
   - Width bound to `useWindowDimensions().width` minus side padding for perfect centering.
   - **Visual Asset:** For now, an existing `Mascot` component (e.g., `panda-happy`) enclosed in a nice rounded, subtly shaded container to give it a premium feel.
   - **Typography:** Below the visual, the `text` string will be rendered using the existing `Text` UI component (`variant="h3"` or `"body"` depending on length) with clean, generous line height.
4. **Pagination Indicators:**
   - A row of dots below the carousel (or absolutely positioned near the bottom) indicating the number of cards and the current active index. Active dots will use the primary accent color (`SAGE` or `INK`); inactive dots will be muted.

### State & Interaction
- **State:** `currentIndex` (integer) tracks which card is currently snapped into view.
- **Completion Logic:** 
  - When `currentIndex === payload.content.cards.length - 1`, we fire `onInteraction(true)`.
  - This informs the parent `NodeEngine` / `LessonScreen` that the user has consumed the content, automatically enabling the primary "Continue" button at the bottom of the screen.

### Error Handling
- If `payload.content.cards` is undefined or empty, return a fallback empty view to prevent crashes.

## Future-proofing (Ponytail check)
- We are specifically keeping this simple by using standard `ScrollView` instead of heavy 3rd-party swiper libraries. It meets all requirements with the minimum possible footprint.
- Image URLs in the JSON (`visual_url`) will be safely ignored in favor of the placeholder panda until a generalized image loader is needed.
