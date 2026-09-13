# Research & Decisions: Next Journey Bridge

## 1. Recommendation Algorithm & Data Sources

**Decision**: Implement a pure Redux selector (`selectNextCourseRecommendation`) that inspects loaded `courses` and `user_course_progress` maps.
**Rationale**:
- Deterministic, zero additional network round-trips when landing on the completed map.
- The catalog is already fetched by `journeyApi` queries (`useGetCourseCatalogQuery`, `useGetEnrolledCoursesQuery`).
- Courses are ordered by `order_index`. The selector finds the lowest `order_index` published course where `user_course_progress.status !== 'completed'`.
**Alternatives considered**:
- Backend Edge Function recommendation endpoint: Rejected as overengineered (YAGNI). The catalog size is <20 courses; filtering in selector is sub-millisecond and runs entirely offline/optimistically.
- AI-based recommendation: Rejected for MVP. Sequential curriculum provides the strongest therapeutic scaffolding.

## 2. Floating Dock UI & Ergonomics

**Decision**: Render a floating card (`NextJourneyBridgeDock`) fixed above the tab bar using `absolute bottom-6 left-4 right-4 z-40`.
**Rationale**:
- Placing the CTA in the thumb zone (lower third of the screen) delivers the highest conversion and lowest friction on mobile devices.
- Keeping the map scrollable behind the dock satisfies `docs/prd-completed-journey-revisit.md`, allowing the learner to review any section or replay completed nodes without blocking navigation.
- Uses standard brand tokens (`bg-brand-surface`, 2px border, rounded-2xl) and the app's standard 3D tactile `Button`.
**Alternatives considered**:
- End-of-path node at the bottom of the FlashList: Rejected because the user would have to scroll all the way to the bottom to see it, leaving the viewport empty if the camera resets to top or active section.
- Auto-opening modal/sheet on every map visit: Rejected as disruptive. Users reopening completed journeys to replay a specific technique would find an auto-modal annoying.

## 3. Enrollment & Course Switching Mechanics

**Decision**: Connect the primary CTA directly to `useStartCourseMutation()` and Redux `setActiveCourseId`.
**Rationale**:
- Existing journey controller already manages active course selection through `setActiveCourseId` and handles enrollment through `journeyApi.useStartCourseMutation()`.
- Reusing these existing primitives eliminates code duplication and ensures cache invalidation triggers smoothly across Redux slices.
**Alternatives considered**:
- Navigating to course overview screen first: Rejected per grilling alignment. The user explicitly chose a 1-tap start to eliminate hesitation, providing "Browse all courses" as the secondary route for deeper evaluation.

## 4. "All Caught Up" Edge Case

**Decision**: When all published courses in `courses` have `status === 'completed'`, the dock switches to an "All Caught Up! 🌟" celebratory state with a 1-tap "Browse Course Catalog" button.
**Rationale**:
- Prevents UI dead-ends or empty state crashes when a power user completes the full curriculum.
- Celebrates total mastery while providing a direct doorway back to any course.
