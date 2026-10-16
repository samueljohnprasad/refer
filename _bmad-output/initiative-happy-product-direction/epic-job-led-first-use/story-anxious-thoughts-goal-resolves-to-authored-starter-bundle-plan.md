---
title: 'Anxious-thoughts goal resolves to the authored starter bundle'
type: 'feature'
ticket: 4
created: '2026-10-12'
status: done
route: 'full'
route_source: 'queue-evidence'
review: 'quick'
review_source: 'manual'
lenses_ran: []
review_loop_iteration: 0
context:
  - '/Users/samuelprasad/Desktop/happy/journals/src/domains/journey/model/starterPath.ts'
  - '/Users/samuelprasad/Desktop/happy/journals/src/screens/OnboardingScreen/utils/courseResolver.ts'
  - '/Users/samuelprasad/Desktop/happy/journals/src/data/exerciseLinkingMap.ts'
  - '/Users/samuelprasad/Desktop/happy/journals/supabase/seed/anxiety_section_1_unit_1.sql'
---

## Intent

Use stable identifiers for the first plain-language goal, authored lesson, reusable Thought Catcher practice, guided reflection prompt, and next action. Do not duplicate display labels or exercise logic.

## Evidence

- `ANXIOUS_THOUGHTS_STARTER_PATH` defines `understand_anxious_thoughts`, course `anxiety`, lesson `anxiety-s1-u1-n1-anxiety-has-a-job`, practice `thought_catcher`, reflection `notice_the_anxiety_alarm`, and the versioned next action.
- `courseResolver.ts` resolves the existing anxiety motivation to the published course catalog rather than inventing a second course identifier.
- `exerciseLinkingMap.ts` and `thoughtCatcher/config.ts` provide the existing reusable exercise identifier.
- The anxiety seed contains the canonical authored lesson node identifier.

## Acceptance

- The starter bundle is typed and versioned.
- The lesson and practice identifiers resolve to existing authored/runtime records.
- No display-label lookup or duplicate exercise implementation was added.

## Verification

- Static identifier search across source and seed data completed on 2026-10-12.
- Targeted Oxlint and `git diff --check` pass for the touched implementation surface.
- No additional code change was required because ticket 1 already delivered this bundle.
