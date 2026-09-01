# Specification: Clear Space Guided Discovery

**Status**: Draft
**Version**: 1.0.0

## Feature Description

Refactor the "Four valid ways to clear space" learning interaction to use progressive disclosure (Guided Discovery). The current implementation displays both the 4 strategies (as a top carousel) and the 4 moments simultaneously, causing cognitive overload and confusing interaction zones. The refactored version will hide the strategies initially, prompting the user to pick a moment first, and then reveal the fitting strategy in-place as a non-interactive information block.

## Target Audience

Learners seeking tools to clear their mental space before sleep or relaxation, who need simple, focused choices rather than overwhelming taxonomies.

## Value Proposition

By separating the "situation" (moment) from the "tool" (strategy), the interaction teaches that context determines the right tool, rather than suggesting a universally correct technique. Progressive disclosure drastically reduces cognitive load, making the interaction feel simpler, calmer, and more premium.

## User Stories & Testing *(mandatory)*

### US1: Choose Context (State 1)

**Goal**: As a learner, I want to see only the moment options first, so I can focus on identifying my current situation without being distracted by the answers.

**Independent Test**: Can be tested by verifying that the screen displays the 4 moment cards and NO strategy cards before any selection is made.

**Acceptance Scenarios**:

1. **Given** the user lands on the interaction, **When** the screen renders, **Then** the title is "Four valid ways to clear space", the subtitle is "Different moments can call for different responses.", and only the 4 moment cards are visible.
2. **Given** the user is viewing State 1, **When** they look at the controls, **Then** there is no horizontal scrollbar or strategy carousel visible anywhere on the screen.

### US2: Reveal Fit (State 2)

**Goal**: As a learner, after choosing a moment, I want to see the specific strategy that fits my situation and a brief reason why, so I clearly understand the connection between my state and the tool.

**Independent Test**: Can be tested by selecting a moment and verifying that the UI updates in-place to highlight the chosen moment and reveal the corresponding strategy as a readable block.

**Acceptance Scenarios**:

1. **Given** the user is in State 1, **When** they tap a moment card, **Then** the UI transitions in-place to State 2, keeping the selected moment visible and highlighted in the brand "selected" style (soft sage).
2. **Given** the user has transitioned to State 2, **When** the fitting strategy is revealed, **Then** it appears as a non-interactive information block (soft sage surface, no prominent border) rather than a selectable card.
3. **Given** the user is viewing the revealed strategy, **When** they read the text, **Then** only a single, concise explanatory sentence is shown (overlapping/duplicate lessons are removed).
4. **Given** the user is in State 2, **When** the screen is fully rendered, **Then** a "Continue" button is available to proceed.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST implement a staged disclosure architecture (State 1: Context Selection, State 2: Strategy Reveal).
- **FR-002**: The system MUST NOT display the strategy taxonomy (the top carousel of 4 strategies) during State 1.
- **FR-003**: The system MUST render exactly four selectable moment cards in State 1.
- **FR-004**: The system MUST transition to State 2 immediately upon the selection of a moment card.
- **FR-005**: In State 2, the system MUST style the selected moment using the brand selected state (soft sage surface, brand border) and MUST NOT use duplicate highlight signals (e.g., green success states or redundant top-card highlights).
- **FR-006**: In State 2, the system MUST render the revealed strategy mapping as an information block (e.g., quiet soft sage surface without a prominent border) to distinguish it visually from interactive controls.
- **FR-007**: The system MUST display a concise explanation in the revealed strategy block, explicitly stripping out secondary generalized lessons (e.g., removing the "No tool has to make you sleepy..." paragraph).
- **FR-008**: The system MUST provide a primary "Continue" CTA only after a moment has been selected (State 2).

### Edge Cases

- Rapid tapping of moment cards before State 2 fully transitions.
- The curriculum wording for the "Quiet reading" moment mapping must be verified so it implies "quiet, familiar reading" rather than stimulating reading.

### Key Entities

- **Moment**: The contextual situation the user is experiencing (e.g., "Any extra exercise feels like pressure tonight.").
- **Strategy**: The tool that fits the moment (e.g., "No writing").

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The number of visible controls on initial load is reduced from 8 to 4 (a 50% reduction in cognitive load choices).
- **SC-002**: The strategy answers are completely hidden (0% visibility) until a moment selection is made.
- **SC-003**: Vertical scrolling is eliminated or significantly reduced on standard device heights due to the removal of the top carousel and duplicate explanation paragraphs.

## Assumptions

- Assumes the underlying engine can be configured for staged progressive disclosure (similar to GuidedDiscovery).
- Assumes the existing curriculum/content schema maps 1:1 between moments and strategies.
