# Quickstart & Verification: Next Journey Bridge

This guide details the scenarios to manually verify the Next Journey Bridge on device or simulator.

## Prerequisites
- App running with an enrolled user or guest session.
- At least 2 published courses seeded in the database (e.g. `anxiety_v5` and `sleep_reset_v5`).

---

## Scenario 1: Course Completion Next Journey Dock
1. Complete all nodes in `anxiety_v5` (or navigate to a completed course in the catalog).
2. Dismiss the course celebration overlay.
3. **Verify**:
   - The roadmap remains scrollable and displays all completed/gold nodes.
   - At the bottom of the screen (above the tab bar), a floating card appears with:
     - Eyebrow: `COURSE COMPLETED 🏆`
     - Title: `Next Journey: The Sleep Reset` (or next course title).
     - 3D tactile button: `Start The Sleep Reset`.
     - Secondary link: `Browse all courses`.
4. Tap `Start The Sleep Reset`.
5. **Verify**:
   - The button shows tactile press animation and light haptic feedback.
   - The roadmap transitions immediately to `The Sleep Reset` at Section 1, Unit 1.

---

## Scenario 2: Browse Catalog Secondary Action
1. On the completed course map with the dock visible, tap `Browse all courses`.
2. **Verify**:
   - The `CourseCatalogSheet` slides up from the bottom.
   - User can select any listed course to preview or switch.

---

## Scenario 3: All Courses Completed
1. Set all published courses to `completed` in user progress.
2. Open the journey map.
3. **Verify**:
   - Floating dock displays `All Caught Up! 🌟`.
   - Primary button displays `Browse Course Catalog`.
   - Tapping the button opens the `CourseCatalogSheet`.

---

## Scenario 4: Completed Node Replay with Dock Visible
1. While the floating dock is visible, scroll up on the completed roadmap.
2. Tap any previously completed exercise node.
3. **Verify**:
   - The node opens normally to allow replaying the exercise.
   - Returning from the exercise keeps the course in `completed` status and returns to the roadmap.
