## Goal Description
Perform a comprehensive UI and behavioral audit of the "When bedtime feels wired" (`PrivateCheckCategoryEngine`) exercise to elevate the psychological safety, cognitive flow, and premium polish, making it a "private self-check" rather than a quiz.

## User Review Required
No breaking changes. This only touches the `PrivateCheckCategoryEngine` component and the `sleep_reset_section_2.sql` seed script.

## Open Questions
None. The audit instructions are clear and provide the exact required interactions.

## Proposed Changes

### Database Seed (supabase/seed/sleep_reset_section_2.sql)
Update the items in the `private_check` exercise for "When bedtime feels wired".
- Change "Work or tomorrow keeps replaying" -> "Work or tomorrow keeps replaying in my mind"
- Change "My heart feels faster" -> "My heart feels like it’s beating faster"
- Change "Instruction" -> "Which of these have you noticed at bedtime?\nSelect any that fit."

### src/components/exercise/PrivateCheckCategoryEngine.tsx
#### [MODIFY] PrivateCheckCategoryEngine.tsx
1. **Add "None of these"**:
   - Manually append "None of these" as a pseudo-item to the list of items parsed from the content.
   - Implement mutually exclusive selection logic: If "None of these" is selected, clear other indexes. If another item is selected, deselect "None of these".
2. **Continue Button Enablement**:
   - Update `onInteraction` call to enforce `isComplete: selectedIndexes.length > 0` (which guarantees the user explicitly selects at least one symptom or "None of these").
   - This ensures the Continue button only lights up after an action.
3. **UI / Styling Improvements**:
   - Change selection marker from a circle (`rounded-full`) to a square checkbox (`rounded-md` or `rounded-[6px]`) to imply multiselect semantics.
   - Remove heavy shadow and shrink vertical padding (`min-h-14` -> `min-h-12`).
   - Use soft sage/green selected colors (`#F2F8EF` fill, `#ABC0A2` border) and neutral unselected colors (`#F9F4ED` fill).
4. **Privacy Reassurance**:
   - Remove the `LockIcon`.
   - Update text to: "Private to you. Not scored."
5. **Post-Selection Reveal (Feedback State)**:
   - Restructure the feedback block completely.
   - Instead of the `feedbackTitle` and `feedback` text, render a summary of what the user chose under a "YOU NOTICED" heading.
   - If "None of these", render: "NONE OF THESE FIT RIGHT NOW. That's okay — these are only examples."
   - If items selected, render the items, then a green block: "These can all happen when your system is leaning toward ALERT." -> "TIRED ≠ SETTLED".

## Verification Plan
### Automated Tests
Run TypeScript compilation to ensure no type errors.

### Manual Verification
1. Run the app in the simulator and navigate to the "When bedtime feels wired" exercise in Section 2 (or load via deep link).
2. Verify checkboxes are square and the layout matches the visual audit.
3. Select multiple items. Ensure "Continue" enables.
4. Select "None of these" and verify it clears previous selections.
5. Tap "Continue" and verify the feedback state reflects the exact selections in a calm, non-judgmental way.
