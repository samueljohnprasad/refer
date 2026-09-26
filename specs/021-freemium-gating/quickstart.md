# Quickstart & End-to-End Validation Guide: Freemium Gating (Model A)

This guide documents runnable validation scenarios to prove that app-wide freemium gating operates correctly end-to-end under **Model A** without leaking restricted access or disrupting free users.

---

## Prerequisites

1. Active development client or TestFlight build running on an iOS device.
2. A free (non-subscriber) account or clean anonymous user state.
3. Access to sandbox in-app purchases or RevenueCat dashboard for subscription toggle testing.

---

## Scenario 1: Journey Progression & Unit 2 Lock Verification

### Objective
Verify that Unit 1 is completely free and Unit 2+ is visually locked and triggers the paywall.

### Steps
1. Navigate to the **Journeys** tab (`/tabs/(tabs)/home` or course map).
2. Tap on the first lesson in **Unit 1**.
   - **Expected Result**: Lesson launches directly into the interactive learning flow.
3. Complete or inspect lessons within Unit 1.
4. Scroll down to the divider separating Unit 1 and Unit 2.
   - **Expected Result**: Unit 2 divider renders with a gold **PRO** pill next to the title.
5. Inspect the nodes in Unit 2.
   - **Expected Result**: All nodes display the locked padlock visual state.
6. Tap the first lesson node in Unit 2.
   - **Expected Result**: Warning haptic vibrates; lesson flow does NOT launch; RevenueCat native Paywall sheet appears immediately.

---

## Scenario 2: CBT Exercise Catalog PRO Badges & Press Interception

### Objective
Verify that foundational exercises remain free while specialized exercises show a PRO chip and prompt the paywall.

### Steps
1. Navigate to the **Exercises** tab (`/tabs/(tabs)/exercises`).
2. Locate the **Featured Hero** card:
   - If the featured exercise is foundational (`thought_reframing`, `thought_catcher`, etc.):
     - **Expected Result**: No PRO badge; tap triggers circular reveal into the exercise.
3. Scroll through the exercise list:
   - **Foundational Pack** (`thought_catcher`, `thought_reframing`, `gratitude_reframe`, `box_breathing`, `mindful_breathing_1min`):
     - **Expected Result**: Clean card with no PRO badge; tap launches exercise.
   - **Specialized Pack** (`decatastrophizing`, `worry_decision_tree`, `grounding_54321`, `body_scan_pmr`, `detached_mindfulness`, `attention_training`, `abc_analysis`, `breathing_478`):
     - **Expected Result**: Displays gold **PRO** pill chip on top-right of shelf card and list row.
4. Tap any specialized exercise (e.g. `decatastrophizing`).
   - **Expected Result**: Circular reveal transition is suppressed; warning haptic fires; Paywall modal opens.

---

## Scenario 3: Daily Habit Tracker 3-Item Capacity Limit

### Objective
Verify that free users can track up to 3 active habits and are gated upon attempting a 4th.

### Steps
1. Navigate to the **Habits** section on Home.
2. If fewer than 3 habits exist, tap "+ Add Habit" and create habits until 3 active habits are listed.
3. With 3 active habits present, tap "+ Add Habit" again.
   - **Expected Result**: `AddHabitModal` does NOT open; RevenueCat Paywall sheet is presented.
4. Dismiss the paywall. Delete or archive 1 habit (reducing active count to 2).
5. Tap "+ Add Habit".
   - **Expected Result**: `AddHabitModal` opens normally, allowing a new habit to be added.

---

## Scenario 4: Coping Cards 5-Item Capacity Limit

### Objective
Verify that free users can save up to 5 coping cards in their pocket deck and are gated upon saving a 6th.

### Steps
1. Navigate to Coping Cards screen (`/tabs/screens/coping-cards`).
2. Verify total active cards count. Ensure there are 5 active cards.
3. Launch a free exercise (e.g., `thought_reframing`) and complete all steps to reach the summary screen.
4. Tap **"Save as coping card"**.
   - **Expected Result**: Mutation detects 5 active cards; warning haptic fires; Paywall modal appears; current summary step inputs remain safe and un-cleared.
5. Navigate to Coping Cards screen and archive 1 card (reducing active cards to 4).
6. Repeat saving a coping card.
   - **Expected Result**: Card is successfully created and added to the pocket deck.

---

## Scenario 5: Voice Journaling Weekly Free Limit

### Objective
Verify that free users are limited to 3 voice journal recordings per rolling 7 days.

### Steps
1. Navigate to the voice recording prompt.
2. Record 3 voice journals on consecutive days or sessions.
3. Attempt to start a 4th voice recording.
   - **Expected Result**: Voice recorder is blocked; Paywall is presented with a notification explaining the weekly quota has been reached.

---

## Scenario 6: Pro Unlock & Immediate Access

### Objective
Verify that purchasing or restoring Pro immediately unlocks all gates across the entire application without restarting.

### Steps
1. From any paywall modal, purchase or restore a sandbox Pro subscription.
2. Verify customer entitlement changes (`hasPro = true`).
3. Tap on a Unit 2 lesson:
   - **Expected Result**: Opens lesson flow immediately.
4. Tap on a specialized exercise:
   - **Expected Result**: PRO badges disappear or reflect unlocked status; exercise launches with circular reveal.
5. Create a 4th habit and 6th coping card:
   - **Expected Result**: Both save successfully with zero restrictions.
