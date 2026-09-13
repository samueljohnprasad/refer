# Spec: Next Journey Bridge (Post-Course Completion)

## Problem Statement

When I finish the final exercise of a course and dismiss the celebratory completion overlay, the journey map leaves me sitting on the final node of the completed course with no obvious direction, recommendation, or prompt for what to do next. As a learner trying to build mental health habits, I feel stranded and unsure where to go next, risking churn right at the peak moment of my accomplishment.

## Solution

When viewing a completed course map, a persistent floating dock card appears anchored above the bottom navigation bar. It celebrates the course completion and recommends the next logical uncompleted course from the catalog with a high-contrast 3D tactile "Start [Next Course Title]" button. Tapping it enrolls me and transitions the map directly to that next course in 1 tap, while an optional "Browse all courses" secondary button lets me choose a different focus. If I have completed every course available in the app, the dock celebrates that I am all caught up and gives me 1 tap to revisit and review any course in the catalog. The roadmap behind the dock remains fully scrollable so I can replay any past lesson whenever I want.

## User Stories

1. As a learner who just completed a course, I want to see an immediate, clear prompt for my next journey, so that I maintain my momentum without having to hunt through menus.
2. As a learner on a completed journey map, I want the next course to be pre-selected for me based on recommended curriculum order, so that I don't experience decision paralysis.
3. As a learner, I want a single tap on "Start [Next Course]" to automatically enroll me and switch the roadmap to the new journey, so that starting the next chapter is frictionless.
4. As a learner, I want to see a secondary option to "Browse all courses", so that I can explore other tracks if the recommended one does not match my current preference.
5. As a learner who has mastered all available journeys in the app, I want to see an "All Caught Up! 🌟" celebratory state, so that I feel recognized for finishing everything rather than seeing a broken or empty card.
6. As an advanced learner with all courses completed, I want the card to give me a quick shortcut to the course catalog, so that I can easily revisit and practice earlier journeys.
7. As a learner reviewing a completed course, I want the map behind the floating card to remain fully scrollable and interactive, so that I can tap on any previously completed node and redo exercises.
8. As a learner returning to the app days after completing a course, I want the next journey card to still be present on the completed map, so that I am never stuck in a dead-end state upon reopening the app.
9. As a learner with low vision or motor challenges, I want the primary action button to use the app's standard 3D tactile button with large touch targets and distinct rim shadows, so that it is physically easy to identify and tap.
10. As a learner in dark mode, I want the floating dock card to render using appropriate dark surface tokens and legible text contrast, so that the experience is comfortable in low light.
11. As a learner who switches between courses using the top header picker, I want the floating dock to appear only when viewing completed courses, so that active in-progress courses display uninterrupted progression maps.
12. As a learner who tapped "Browse all courses", I want the standard course catalog sheet to slide up smoothly, so that the catalog browsing experience remains familiar and consistent.

## Implementation Decisions

### Modules to Build and Modify
- **Journey Recommendation Selector**: A centralized memoized selector module that accepts the current journey state and active course ID, resolving whether the active course is completed, the next recommended course in sequence, and whether all courses are completed.
- **Next Journey Bridge Dock Component**: A presentational floating card component elevated over the journey map with an eyebrow badge, course title, tactile primary button, and secondary link.
- **Journey Map Integration**: Integration inside the main Journey Map screen view, conditionally rendering the dock when the active course is completed and passing action handlers for starting the next course and opening the catalog.

### Domain Interfaces
- The recommendation state will expose:
  - `isCompleted`: boolean indicating if the active course has all progression nodes completed.
  - `nextCourse`: the Course entity representing the first uncompleted published course in order, or `null` if none exist.
  - `isAllCoursesCompleted`: boolean indicating if every published course in the catalog has been completed.
- The component interface will receive:
  - Course title of the next journey (if available).
  - Next course ID.
  - All-caught-up flag.
  - Callbacks for starting the course and opening the course catalog.

### Interactions and Transitions
- Tapping the primary button dispatches the start course mutation for the resolved next course ID and updates the active course in journey state, causing the journey map to seamlessly transition to the new course.
- Tapping the secondary text button opens the existing course catalog sheet.
- The map view beneath the dock retains its full touch and scroll capabilities, allowing nodes to be tapped for replay per the existing completed-course PRD.

## Testing Decisions

### What Makes a Good Test
- Tests must verify observable user-facing behavior rather than private implementation details or layout styling.
- Tests should verify that given a state with a completed course, the recommendation engine accurately picks the lowest uncompleted course in sequence.
- Tests should verify that when all courses have completed status, the engine transitions to the all-caught-up state.
- Tests should verify that triggering the primary action initiates course enrollment and updates the active course.

### Modules to Test
- The journey recommendation selector module.
- The user flow integration inside the journey controller hook.

### Prior Art
- Existing test patterns in `src/domains/journey/state/journeySelectors.test.ts` and `src/domains/journey/learning/__tests__/`.

## Out of Scope
- Dynamic AI-personalized recommendation algorithms (rule is strictly deterministic sequential order by course order index for MVP).
- Full certificate generation or PDF export screens upon course completion.
- Gamified mastery level decay / cracked skills mechanics on old nodes.
- Changing backend database schema for courses or course progress.

## Further Notes
- This design is completely aligned with `docs/prd-completed-journey-revisit.md`, ensuring completed courses remain first-class replay environments while eliminating dead-ends.
- Visuals must strictly follow the Happy brand guidelines (2px neutral border, Nunito typography scale, 3D tactile button depth).
