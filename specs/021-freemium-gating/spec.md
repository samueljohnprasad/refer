# Feature Specification: App-Wide Freemium Gating (Model A)

**Feature Branch**: `021-freemium-gating`

**Created**: 2026-09-26

**Status**: Draft

**Input**: User description: "planning for the fremium gating, for other features in the app also, we need to do the gating, find where we require gating"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Free Journey Experience & Progressive Unit Gating (Priority: P1)

A new or free learner explores their chosen learning course. To establish trust, build a daily mental health habit, and demonstrate the tangible value of cognitive-behavioral microlearning, Unit 1 of every journey is 100% free and open. The learner can freely progress through every lesson, checkpoint, and milestone within Unit 1.

When the learner reaches Unit 2 (or any subsequent unit in the journey), these advanced units are clearly designated as Premium. Unit dividers display a prominent "PRO" label, and the nodes are rendered in a distinct locked visual state with lock iconography. When a learner taps any lesson node in Unit 2+, the application presents a subscription upgrade invitation explaining what is included in the full course.

**Why this priority**: Core habit-building and conversion engine. Allowing users to complete an entire initial unit proves the method's efficacy before asking for financial commitment, mirroring proven learning platforms like Duolingo and Headspace.

**Independent Test**: Complete all lessons in Unit 1 of any journey as a free user. Verify uninhibited progression through Unit 1. Then tap on the first node of Unit 2; verify that the exercise does not launch and the subscription paywall is displayed.

**Acceptance Scenarios**:

1. **Given** a free learner navigating any course journey, **When** they tap any lesson node in Unit 1, **Then** the lesson begins immediately without any paywall interference.
2. **Given** a free learner viewing the journey path, **When** they scroll to Unit 2 or beyond, **Then** the unit divider displays a PRO indicator and all nodes in that unit are shown in a locked visual state.
3. **Given** a free learner viewing a locked Unit 2+ node, **When** they tap the node, **Then** tactile feedback is provided and the subscription paywall is presented.
4. **Given** an active Pro subscriber, **When** they access Unit 2 or beyond, **Then** all nodes display standard progression states and launch their respective lessons without paywall interruption.

---

### User Story 2 - Core Foundational CBT Exercises vs. Specialized Pro Library (Priority: P1)

A learner opens the exercise discovery catalog looking for mental wellness exercises. Free learners receive unlimited, ongoing access to the 5 essential foundational exercises:
- Thought Catcher (Capturing automatic thoughts)
- Thought Reframing (Balanced cognitive reappraisal)
- Gratitude Reframe (Positive mindset shift)
- Box Breathing (Calming physiological nervous system regulator)
- 1-Minute Mindful Breathing (Quick centering reset)

All specialized, somatic, and advanced cognitive therapy exercises (such as Decatastrophizing, Worry Decision Tree, 5-4-3-2-1 Sensory Grounding, Progressive Muscle Relaxation, Detached Mindfulness, Attention Training Technique, ABC Cognitive Analysis, and 4-7-8 Sleep Breathing) are designated as Pro exercises with an amber "PRO" badge on their catalog cards.

Tapping a Pro-designated exercise gently triggers the subscription paywall modal rather than launching the exercise flow.

**Why this priority**: Balances immediate clinical utility with commercial sustainability. Essential emergency and daily tools remain free forever, while specialized multi-step therapy exercises drive subscription conversion.

**Independent Test**: As a free user, tap "Thought Catcher" and verify it starts normally. Then tap "Decatastrophizing"; verify that it displays a "PRO" badge and tapping it opens the subscription paywall without starting the exercise.

**Acceptance Scenarios**:

1. **Given** a free learner in the exercise catalog, **When** they tap any of the 5 foundational exercises, **Then** the exercise launches directly with standard interactive transitions.
2. **Given** a free learner in the exercise catalog, **When** they view the catalog cards, **Then** all 8 specialized exercises display a visible "PRO" badge chip.
3. **Given** a free learner, **When** they tap any specialized Pro exercise, **Then** the transition to the exercise is suppressed and the subscription paywall is presented.
4. **Given** an active Pro subscriber, **When** they tap any specialized exercise, **Then** the exercise launches immediately with full functionality.

---

### User Story 3 - Voice Journaling Fair-Use Quota (Priority: P2)

A user turns to voice journaling to speak their mind freely. Free users are allocated a quota of 3 voice journal recordings per rolling 7-day period (with a standard recording duration limit of 90 seconds). This allows free users to experience the intimacy and ease of audio reflection.

Subscribers enjoy unlimited voice recordings and extended recording length (up to 10 minutes). When a free user has recorded 3 voice entries in the last 7 days and attempts to start another voice recording, the system notifies them that their weekly free quota has been reached and presents the upgrade sheet.

**Why this priority**: Voice processing and transcription involve real backend compute costs. A fair-use quota protects operational margins while providing sufficient utility for habit testing.

**Independent Test**: Record 3 voice journal entries on a free account. Attempt to open the voice recorder for a 4th entry; verify the application displays a friendly notification stating the weekly free quota has been reached and opens the paywall.

**Acceptance Scenarios**:

1. **Given** a free user who has recorded fewer than 3 voice journals in the past 7 days, **When** they initiate voice recording, **Then** the recorder opens and functions normally.
2. **Given** a free user who has recorded 3 voice journals in the past 7 days, **When** they attempt to initiate a new voice recording, **Then** the recorder is blocked and the subscription paywall is displayed.
3. **Given** an active Pro subscriber, **When** they record voice journals, **Then** no weekly quota is enforced and recordings can extend up to the maximum recording duration.

---

### User Story 4 - Coping Cards Deck Capacity Limit (Priority: P2)

Upon completing a cognitive restructuring or mindfulness exercise, learners are encouraged to save their core takeaway or balanced thought into their personal pocket deck of "Coping Cards".

Free learners can store up to 5 active coping cards in their pocket deck. When a free learner already has 5 active cards and attempts to save another card, the system prompts them to upgrade to Pro for an unlimited pocket deck. If the learner does not wish to upgrade, they can archive older cards to free up capacity. Archived cards do not count toward the active 5-card capacity limit.

**Why this priority**: High personal emotional investment. Learners who generate 5 valuable insights have experienced undeniable personal breakthroughs and have the highest propensity to subscribe.

**Independent Test**: Populate the pocket deck with 5 active cards. Complete a Thought Reframing exercise and tap "Save as Coping Card"; verify that the paywall prompt is presented and the card is not saved until unlocked or capacity is cleared.

**Acceptance Scenarios**:

1. **Given** a free learner with fewer than 5 active coping cards, **When** they save a new card from an exercise summary, **Then** the card is successfully added to their pocket deck.
2. **Given** a free learner with 5 active coping cards, **When** they attempt to save a new coping card, **Then** the paywall prompt is displayed.
3. **Given** a free learner with 5 cards who archives 1 card (reducing active cards to 4), **When** they save a new card, **Then** the card is successfully saved.
4. **Given** an active Pro subscriber, **When** they save coping cards, **Then** they can save an unlimited number of cards.

---

### User Story 5 - Daily Habit Tracking Capacity (Priority: P3)

Learners use the daily habit tracker to reinforce behavioral activations and wellness routines (e.g., morning hydration, evening wind-down, daily walk).

Free users can actively track up to 3 daily habits simultaneously. When a free learner has 3 active habits and taps "+ Add Habit", the application displays an upgrade prompt explaining that Happy Pro unlocks unlimited simultaneous habits and custom reminders.

**Why this priority**: Fosters deliberate focus (tracking too many habits simultaneously leads to cognitive overload) while offering a natural expansion path for power users.

**Independent Test**: Create 3 active habits on a free account. Tap "+ Add Habit"; verify that the creation modal does not open and the paywall sheet is presented.

**Acceptance Scenarios**:

1. **Given** a free user with fewer than 3 active habits, **When** they tap "+ Add Habit", **Then** the habit creation interface opens normally.
2. **Given** a free user with 3 active habits, **When** they tap "+ Add Habit", **Then** the subscription paywall is displayed with an explanation that Pro allows unlimited habits.
3. **Given** a Pro subscriber, **When** they tap "+ Add Habit", **Then** they can create additional habits without restriction.

---

### User Story 6 - Advanced Timeline Analytics & Therapist Reports (Priority: P3)

Learners review their emotional growth over time in the Timeline tab. Free users can view their basic 7-day mood history, streak counter, and chronological exercise history.

Deep psychological analytics—specifically the Belief Decay trend chart, Cognitive Distortion Pattern Analyzer, and automated Therapist Clinical Notebook—are presented in a blurred or locked preview state. Tapping any locked analytics card triggers the subscription paywall with a preview of the report's insights.

**Why this priority**: Highlights advanced AI and clinical synthesis capabilities without withholding foundational historical records.

**Independent Test**: Open the Timeline screen on a free account. Verify basic mood history is visible while the Belief Decay and Therapist Notebook cards display lock overlays. Tap a locked card and verify paywall appears.

**Acceptance Scenarios**:

1. **Given** a free learner, **When** viewing the Timeline screen, **Then** 7-day mood history and completed exercise logs are visible and readable.
2. **Given** a free learner, **When** viewing advanced analytics cards (Belief Decay, Therapist Notebook, Distortion Trends), **Then** each card displays a locked preview card with an "Unlock with Pro" action.
3. **Given** an active Pro subscriber, **When** viewing the Timeline screen, **Then** all analytics cards display fully rendered, interactive data visualizations.

---

### Edge Cases

- **Offline Gating Verification**: When a device is offline, previously verified subscriber entitlements must be cached locally so valid subscribers are never erroneously locked out of Pro content while traveling or without internet.
- **Graceful Restoration**: If an existing subscriber logs in on a new device or re-installs the app, restoring purchases immediately unlocks all Unit 2+ lessons, specialized exercises, and unlimited capacities without requiring restart.
- **Mid-Session Expiration**: If a subscription lapses while a user is inside an exercise, the current exercise session must be permitted to complete without jarring disruption; gating applies on the next exercise or unit launch.
- **Archiving vs Deleting**: Archiving a habit or coping card must immediately release that slot from the free quota count, allowing the user to create a new one without forcing permanent deletion of past insights.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST grant all users full, unrestricted access to Unit 1 across all courses and learning paths.
- **FR-002**: System MUST restrict Unit 2 and all subsequent journey units to active Pro subscribers.
- **FR-003**: System MUST display a clear "PRO" badge on all Unit 2+ section dividers and render locked node visuals for non-subscribers.
- **FR-004**: System MUST intercept user taps on locked Unit 2+ nodes, provide tactile feedback, and present the subscription paywall.
- **FR-005**: System MUST provide unrestricted free access to the 5 foundational CBT exercises (`thought_catcher`, `thought_reframing`, `gratitude_reframe`, `box_breathing`, `mindful_breathing_1min`).
- **FR-006**: System MUST mark all specialized exercises with a prominent "PRO" badge in all catalog views (hero cards, horizontal shelves, and list rows).
- **FR-007**: System MUST intercept taps on Pro-marked exercises from non-subscribers and present the subscription paywall.
- **FR-008**: System MUST enforce a maximum quota of 3 voice journal entries per rolling 7 days for free users.
- **FR-009**: System MUST prevent voice recording initiation and present the paywall once the 3-entry weekly limit is reached.
- **FR-010**: System MUST enforce a maximum capacity of 5 active Coping Cards for free users.
- **FR-011**: System MUST prevent saving additional coping cards and present the paywall when a free user has 5 active cards.
- **FR-012**: System MUST exclude archived coping cards from the 5-card active quota calculation.
- **FR-013**: System MUST enforce a maximum limit of 3 simultaneous active habits for free users.
- **FR-014**: System MUST display advanced analytics (Belief Decay, Therapist Notebook, Cognitive Distortion Patterns) in a locked state with an upgrade action for free users.
- **FR-015**: System MUST provide immediate, seamless access to all gated features upon successful subscription purchase or restoration.

### Key Entities

- **Learner Entitlement**: Represents the user's subscription tier (`Free` or `Pro`), active status, expiration timestamp, and entitlement validation source.
- **Gated Feature**: A designated capability or content item subject to tier checks (Course Unit, Exercise, Habit Slot, Coping Card Slot, Voice Recording Quota, Advanced Analytics Card).
- **Feature Quota**: Numerical threshold defining free-tier usage limits (3 habits, 5 coping cards, 3 voice entries/week, Unit 1 free).
- **Paywall Prompt**: User-facing modal or bottom sheet presenting subscription tiers, pricing, benefit bullet points, and purchase action.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of free learners can complete Unit 1 of their enrolled course without encountering a paywall.
- **SC-002**: 100% of access attempts to Unit 2+ or Pro exercises by free users consistently present the subscription paywall without application failure or unhandled navigation.
- **SC-003**: Paywall presentation response time is under 300 milliseconds from user tap on any locked feature.
- **SC-004**: Subscription purchase or restoration unlocks all gated features across all tabs instantaneously without requiring application restart.
- **SC-005**: Zero data loss occurs when a free user reaches a quota limit (e.g. coping card inputs remain intact if the user cancels or dismisses the paywall).

---

## Assumptions

- **Existing Subscription Infrastructure**: A secure native in-app purchase and entitlement management system is present and provides reliable entitlement status.
- **Single Source of Truth**: Entitlement state is centralized so that all feature gates query a unified authorization contract.
- **Non-Punitive Tone**: Paywall presentation language is positive, supportive, and therapeutic rather than aggressive or restrictive.
- **Core CBT Access**: Foundational CBT tools remain free perpetually to fulfill the application's ethical mission of accessible daily mental health support.
