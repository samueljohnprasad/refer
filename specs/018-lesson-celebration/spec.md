# Specification: Lesson Completion Celebration

## Background & Context

The current lesson completion screen uses generic gamification patterns (mascot + confetti + XP + streak stat cards). This combination has become heavily commoditized and often feels like "AI-generated UI slop." For a mental-health learning app, superficial extrinsic rewards (points, confetti) are less effective for long-term retention than building a sense of competence, autonomy, and meaningful progress. We need a premium, crafted celebration sequence that rewards the *skill* practiced rather than the *system* metrics.

## Objective

Redesign the lesson completion experience to eliminate generic gamification tropes. Implement a choreographed, event-based sequence ("The Happy Ripple") that uses physical cause-and-effect, controlled asymmetry, intentional typography, and character-driven moments (the Panda) to create emotional release, meaningful progress, and anticipation for the next node.

## Target Audience

All learners completing exercises and modules within Happy.

## Clarifications

### Session 2026-09-11
- Q: What are the architectural expectations for this implementation? → A: Must be config-driven, follow Separation of Concerns (SRP), DRY, YAGNI, and maintain low cognitive complexity.
- Q: What should happen if a user taps the screen during the initial 1.45-second celebration sequence? → A: Ignore taps: The 1.45s sequence plays fully; taps do nothing until the button appears.
- Q: How should VoiceOver and screen readers announce the completion sequence? → A: Not supported for screen readers right now (Out of Scope).

## User Scenarios & Testing

### Scenario 1: Standard Lesson Completion (Skill Celebration)
- **Given** a user gives the final correct answer in a lesson (e.g., Reframing)
- **When** the lesson concludes
- **Then** the active card dissolves, and the Panda interacts with a physical lesson metaphor (e.g., turning a thought bubble).
- **And** a "Happy Ripple" visually emanates from the interaction, and contextual copy appears ("You caught the thought"), followed by the skill practiced ("Reframing · practiced").
- **And** the "Continue" button appears ~1.45 seconds into the animation sequence.

### Scenario 2: First Daily Completion (Habit Celebration)
- **Given** a user completes their first lesson of the day
- **When** the celebration sequence triggers
- **Then** the Panda animation explicitly acknowledges the daily habit (streak), displaying a slightly stronger environment reaction and a subtle streak indicator seamlessly integrated into the composition (not in a generic card).

### Scenario 3: Journey Map Continuation (Double Dopamine)
- **Given** a user taps "Continue" on the completion screen
- **When** the app transitions back to the Journey Map
- **Then** the camera focuses on the completed node, the node responds, the path visually grows toward the next node, and the next node softly morphs from locked to available over a 400ms duration.

## Functional Requirements

### 1. Choreography and Timing (The 2-Second Experience)
- **1.1** The completion sequence MUST follow a precise timeline to build anticipation:
  - `0ms`: Final interaction completes.
  - `100ms`: Soft success haptic.
  - `180ms`: Exercise content retreats/dissolves.
  - `350ms`: Panda interacts with the lesson metaphor.
  - `700ms`: Metaphor changes state.
  - `850ms`: Happy Ripple begins.
  - `1000ms`: Primary contextual copy appears.
  - `1300ms`: Secondary skill copy appears.
  - `1450ms`: Continue button becomes interactive.
- **1.2** The user MUST NOT be forced to wait through a long, unskippable animation; the CTA must be available by ~1.45 seconds.
- **1.3** During the initial 1.45s sequence, all user screen taps MUST be ignored to ensure the emotional pause is preserved without interruption.

### 2. The Happy Ripple & Physical Cause-and-Effect
- **2.1** Animations MUST follow physical logic: Panda touches an object -> object changes -> ripple originates -> ripple hits progress indicator.
- **2.2** The "Happy Ripple" MUST be the signature visual motif for completion, traveling through the background, Panda, and progress indicators.
- **2.3** Generic confetti or particle explosions MUST NOT be used for standard lesson completions.

### 3. Panda Character Behavior
- **3.1** The Panda MUST react to the specific lesson content (e.g., breathing, relaxing, interacting with a thought bubble) rather than functioning as a static or generically cheering decoration.
- **3.2** The system MUST support an 80/20 predictability ratio: 80% standard lesson reactions, 20% small "easter egg" variations (e.g., catching a leaf, spilling a cup) to provide novel dopamine moments.

### 4. Copy and Typography
- **4.1** The UI MUST use contextual, human-authored copy related to the skill (e.g., "You gave the thought some distance") rather than generic praise ("Great job!", "Amazing!").
- **4.2** The layout MUST employ controlled asymmetry (e.g., Panda slightly off-center) and rely on typography and whitespace for hierarchy, avoiding perfectly centered, auto-layout style vertical stacks.
- **4.3** Generic stat cards (XP, accuracy, duration) MUST be removed from the standard completion view.

### 5. Audio and Haptics
- **5.1** Implement a tiered haptic hierarchy:
  - Level 0 (Exercise step): Micro feedback.
  - Level 1 (Lesson complete): Soft success haptic.
  - Level 2 (First daily lesson): Slightly stronger success.
  - Level 3+ (Unit/Milestones): Success with delayed secondary pulses or rhythms.
- **5.2** Sound design MUST use warm, organic tones (soft tactile clicks, warm rising tones, subtle shimmers) and strictly avoid casino/arcade/coin audio tropes.

### 6. Journey Map Integration
- **6.1** The transition from the completion screen to the journey map MUST anchor on the completed node.
- **6.2** The path to the next node MUST NOT be instantly unlocked upon view; it MUST visually grow (wait ~200ms) and unlock (morph over ~400ms) to create a secondary anticipation/reward moment.

### 7. Architectural Guidelines
- **7.1** The celebration sequence MUST be config-driven, allowing different lesson types to map to specific copy, assets, and colors without hardcoded conditionals in the UI.
- **7.2** The implementation MUST adhere to Separation of Concerns (SRP), ensuring that animation logic, state management, and UI rendering are decoupled.
- **7.3** The code MUST strictly follow DRY and YAGNI principles to minimize cognitive complexity (e.g., avoiding over-engineered state machines if simple hooks suffice).

## Out of Scope

- Designing Level 3 (Unit), Level 4 (Milestone), and Level 5 (Course) milestone asset explosions (this spec focuses on standard and daily completions, though the framework must support scaling up).
- Backend XP economy changes (we are hiding the XP on this screen, but backend calculation remains).
- Accessibility / Screen Reader (VoiceOver) support for the synchronized celebration sequence is currently out of scope.

## Dependencies

- **Design/Assets**: Requires custom Panda animations and lesson metaphor assets. Cannot be implemented purely programmatically with code-based spring/blur/gradients.
- **Motion/Sound**: Requires a coordinated audio and haptic asset library that matches the new organic, warm tone.

## Assumptions

- We assume the existing exercise runner can support a "completion" phase that overlays or transitions to this new screen without unmounting the entire context abruptly.
- We assume we have the animation capabilities (e.g., Lottie, Rive, or Reanimated) to execute the choreographed cause-and-effect sequences.

## Success Criteria

- **SC-001**: Increase Day-1 to Day-14 retention rate by creating a stronger, intrinsic desire to return ("unfinished business" with the next node).
- **SC-002**: Users transition to the next sequential lesson in the journey map at a higher rate within the same session.
- **SC-003**: Qualitative user feedback indicates the app feels "calm", "premium", and "thoughtful", with zero references to it feeling "generic" or "game-like".
