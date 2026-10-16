---
title: 'Home resumes one next action without hiding the catalog'
type: 'feature'
ticket: 5
created: '2026-10-12'
status: done
route: 'full'
route_source: 'queue'
review: ''
review_source: ''
lenses_ran: []
review_loop_iteration: 0
context:
  - '/Users/samuelprasad/Desktop/happy/journals/app/tabs/(tabs)/home/index.tsx'
  - '/Users/samuelprasad/Desktop/happy/journals/src/screens/JournalCalendarScreen/JournalCalendarScreen.tsx'
  - '/Users/samuelprasad/Desktop/happy/journals/src/domains/journey/ui/components/StarterPathNextActionCard.tsx'
  - '/Users/samuelprasad/Desktop/happy/journals/src/domains/journey/data/useStarterPathProgress.ts'
---

## Intent

Home should show one durable starter next action after activation while keeping the existing Journeys, Exercises, Journal, Insights, rewards, and settings surfaces reachable.

## Implementation

- Added `StarterPathNextActionCard` to the existing Home learning section.
- The card reads the durable active-path progress and routes the linked practice with the text-only boundary preserved.
- The existing `ContinueJourneyCard` remains below it, so the full Journey catalog remains reachable.
- Added English Home copy for the next-action label, title, description, and accessibility label.

## Acceptance

- Saved active starter progress produces one Home next-action card.
- The card opens the linked Thought Catcher practice without signup or paywall.
- Existing direct Journey navigation remains present.
- Completed or missing starter progress does not create a misleading card.

## Verification

- Targeted Oxlint completed with complexity warnings only.
- `git diff --check` passes.
- Device verification now confirms the iPhone 17 development build loads over LAN, authenticates an anonymous user, and renders Home with the existing Journey continuation surface. A seeded StarterPath record was not available in the hosted schema, so the new durable next-action card itself remains pending hosted-data verification.
