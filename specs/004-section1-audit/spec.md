# Feature Specification: Section 1 Content Audit and Refactor

**Feature Branch**: `[###-feature-name]`

**Created**: 2026-08-26

**Status**: Draft

**Input**: User description: "mh-app-instructional-design audit on the congnitive load, content, for the whole section 1 and"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Streamlined Unit 2 Lesson Progression (Priority: P1)

As a learner experiencing insomnia or anxiety, I want to learn about sleep disruptors (caffeine, alcohol, light) in punchy, 2-to-3-screen lessons rather than 5-to-7-screen marathons, so that I don't feel overwhelmed by the cognitive burden of the app.

**Why this priority**: Section 1 currently suffers from severe over-segmentation (up to 7 screens per lesson) which violates the new microlearning constraints and risks user churn due to high cognitive load.

**Independent Test**: Can be tested by launching the app, starting Unit 2 Lesson 4 (Light/Stress), and verifying it concludes successfully after a maximum of 3 distinct, meaningful interactions.

**Acceptance Scenarios**:

1. **Given** a user starts any lesson in Unit 2, **When** they complete the primary learning interactions, **Then** the lesson finishes without forcing them into redundant recall quizzes or repetitive "if/then" plans.
2. **Given** a lesson teaches a concept, **When** the concept is presented, **Then** the user is not immediately forced to take a fill-in-the-blank quiz on that exact concept.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The seed data for Section 1 (`supabase/seed/sleep_reset_section_1.sql`) MUST be updated to remove redundant `fill_blank`, `toolkit_shelf`, and `lever_match` exercises that merely test recall of just-presented information.
- **FR-002**: Lessons currently exceeding 3 screens MUST be pruned to a maximum of 2-3 high-value screens (e.g., Recognize -> Explain -> Apply).
- **FR-003**: Mandatory personal application exercises (`private_check`, `if_then_plan`) MUST be removed from intermediate lessons and consolidated into a single culminating experiment/checkpoint (e.g., Unit 2 Lesson 6).
- **FR-004**: The content and options across Section 1 MUST be audited and rewritten to remove catastrophic/shaming distractors and replace them with plausible misconceptions.
- **FR-005**: All terminology front-loading MUST be rewritten into plain language.
- **FR-006**: Existing database rows for removed nodes MUST be explicitly deleted using `DELETE` SQL commands at the end of the seed script to prevent orphans.

### Key Entities

- **Course Exercises (Seed Data)**: The JSON definitions inside `supabase/seed/sleep_reset_section_1.sql` that dictate the sequence, content, and interactivity of each lesson in Section 1.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Average screens-per-lesson in Section 1 (excluding Checkpoints) is reduced from 5.4 to ≤ 3.0.
- **SC-002**: 100% of forced immediate-recall quizzes (`fill_blank`, `lever_match`) are eliminated from the teaching flows.
- **SC-003**: The updated SQL script executes cleanly without foreign key violations or duplicate order_index conflicts.

## Assumptions

- The underlying React Native UI components (e.g., `learn_cards`, `lever_scenario`, `intuition_check`) are fully stable and do not require code changes, only JSON payload changes.
- The target audience includes individuals with sleep anxiety, requiring strict adherence to the "Cognitive Load and Bite-Sized Content Reference".

### Edge Cases
- What happens if a user is currently halfway through a lesson that gets trimmed? (The `NodeEngineRouter` must safely fall back or restart if a cached `order_index` no longer exists).
