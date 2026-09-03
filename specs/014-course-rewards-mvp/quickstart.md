# Quickstart Validation Guide: Course Rewards MVP

**Feature:** `specs/014-course-rewards-mvp`
**Branch:** `014-course-rewards-mvp`

---

## Prerequisites

- iOS dev build running (`npm run ios`)
- A test account enrolled in the Sleep Reset course with at least one unit partially in progress
- The `014-course-rewards-mvp` branch checked out
- Supabase local or staging environment connected

---

## Setup Commands

```bash
# Start the dev server
npm run ios

# After any changes to rewardsConfig.ts, restart Metro
# (no native rebuild needed — JS-only change)
```

---

## Validation Scenario 1: Lesson Completion Surface

**What to verify:** FR-1.1 – FR-1.6, SC-1

**Steps:**
1. Navigate to any non-completed lesson node in the Sleep Reset course.
2. Complete the exercise (submit final answer).
3. ✅ A sheet appears immediately with the lesson takeaway text from `rewardsConfig.lessonTakeaways[nodeId]`.
4. ✅ Sheet contains "Back to path" CTA — no XP count, speed metric, or rank.
5. ✅ Dismiss; return to map — no new sheet appears.
6. ✅ Re-enter the same lesson and complete it again → no celebration sheet appears.

**Failure indicators:**
- Generic "You completed this lesson." text appearing instead of authored takeaway → check `rewardsConfig.lessonTakeaways` for that `nodeId`.
- Sheet appears on replay → check `pendingCelebration` is only set on first-time completion.

---

## Validation Scenario 2: Insight Chest — Claim and Revisit

**What to verify:** FR-2.1 – FR-2.12, SC-2, SC-3, SC-4

**Steps:**
1. Progress to the node immediately before the chest in any eligible unit (≥ 4 nodes).
2. Complete that node.
3. ✅ Journey map shows chest in "Available" state: gold glow pulse, `🎁`, tappable.
4. Tap the chest.
5. ✅ Chest enters "Opening" transient animation (~800ms shake).
6. ✅ Insight card sheet appears with authored `title` and `body` from `rewardsConfig.unitRewards[unitId].insightCard`.
7. ✅ "Back to path" CTA visible. Tap it.
8. ✅ Chest now renders as "Claimed": flat gold, no glow, still tappable.
9. Tap the claimed chest again.
10. ✅ Insight card reopens — same content, no re-claim button.
11. Force-close the app and reopen.
12. ✅ Chest still shows as "Claimed" (status comes from server on progress refetch).

**Double-tap test:**
- Rapidly double-tap the chest during the opening animation.
- ✅ Only one claim request fires (button disabled during `isClaiming`).

**Failure indicators:**
- Generic "Treasure Chest!" copy shown → `rewardsConfig` lookup not wired into `ChestRewardModal`.
- Chest reverts to "Available" after app close → `completeNode` not being called or result not persisted.

---

## Validation Scenario 3: Unit Trophy — First and Subsequent Views

**What to verify:** FR-3.1 – FR-3.8, SC-3

**Steps:**
1. Complete the final required node of a unit.
2. ✅ `UnitCompleteSheet` appears (NOT the lesson sheet AND NOT both).
3. ✅ Sheet shows: "Unit complete", unit title, `capabilityStatement` from `rewardsConfig.unitRewards[unitId]`.
4. ✅ No XP speed or accuracy values shown.
5. Dismiss; return to map.
6. ✅ Unit divider shows a trophy icon (permanent).
7. Force-close and reopen.
8. ✅ Trophy still visible.
9. Tap the unit divider / trophy.
10. ✅ Capability message reopens — no new trophy granted.

**Failure indicators:**
- Both lesson sheet AND unit sheet appear sequentially → orchestrator priority not applied.
- "You can now…" text missing → `rewardsConfig.unitRewards[unitId]?.capabilityStatement` not set; check for warning log.

---

## Validation Scenario 4: Course Finale — First View and Revisit

**What to verify:** FR-4.1 – FR-4.8, SC-5, SC-6, SC-7, SC-8

**Steps:**
1. Complete the very last required node of the final unit of a course.
2. ✅ Only the `CourseFinaleScreen` appears — NOT the lesson or unit sheets.
3. ✅ Screen is full-screen (not a bottom sheet) — visually distinct.
4. ✅ Content includes: course title, acknowledgement text, 3–5 capability summary bullets.
5. ✅ No language about "conquered", "healed", "cured", "perfect", or symptom scores.
6. Dismiss.
7. ✅ Navigate back to course → map shows stable completed state (not the finale).
8. Force-close before step 6, reopen and navigate to that course's journey map.
9. ✅ Finale is restored (shown again) since `markCourseFinaleSeen` was not dispatched.
10. Dismiss finale.
11. ✅ Subsequent navigations to the course map do NOT replay the finale.

---

## Validation Scenario 5: Accessibility — Reduce Motion

**Steps:**
1. Enable "Reduce Motion" in iOS Settings → Accessibility.
2. Repeat Scenarios 1–4.
3. ✅ All surfaces appear without large springs, particle effects, or motion-based reveals.
4. ✅ Transitions use opacity fades only.
5. ✅ All information remains readable — nothing conveyed only through animation.
6. Enable a screen reader (VoiceOver).
7. Navigate through each celebration surface.
8. ✅ All surfaces have `accessibilityRole="dialog"` and readable labels.
9. ✅ "Back to path" / "Continue" CTAs are reachable by swipe navigation.

---

## Validation Scenario 6: Reliability — Network Interruption During Claim

**Steps:**
1. Open the insight chest, triggering the Opening animation.
2. Disable network before tapping "Claim".
3. ✅ Error state shown (toast or inline message); chest remains in "Available" state.
4. Re-enable network; tap again.
5. ✅ Claim succeeds; chest moves to "Claimed".

---

## Key Config Lookup Reference

```typescript
// rewardsConfig.ts — verify these for the test course/unit/nodes:
REWARDS_CONFIG.lessonTakeaways['<nodeId>'].takeaway
REWARDS_CONFIG.unitRewards['<unitId>'].capabilityStatement
REWARDS_CONFIG.unitRewards['<unitId>'].insightCard.title
REWARDS_CONFIG.unitRewards['<unitId>'].insightCard.body
REWARDS_CONFIG.courseRewards['<courseId>'].acknowledgement
REWARDS_CONFIG.courseRewards['<courseId>'].capabilitySummary
```

---

## Console Warnings to Monitor

| Warning | Cause | Fix |
|---------|-------|-----|
| `[rewards] missing takeaway for node <id>` | No takeaway authored for this node | Add to `rewardsConfig.lessonTakeaways` |
| `[rewards] missing insightCard for unit <id>` | Chest disabled silently | Add `insightCard` to `rewardsConfig.unitRewards` |
| `[rewards] missing capabilityStatement for unit <id>` | Trophy shown with unit title fallback | Add `capabilityStatement` |
| `[rewards] missing courseRewards for course <id>` | Generic finale shown | Add to `rewardsConfig.courseRewards` |
| `[rewards] invalid chestPositionOverride for unit <id>` | Chest omitted | Fix override index in config |
