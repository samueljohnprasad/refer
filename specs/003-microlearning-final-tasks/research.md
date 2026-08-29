# Phase 0: Research & Clarifications

## Needs Clarification Resolutions

**Unknown**: Target for `MicrolearningTelemetryEvent` emission (where do these events go?)
- **Decision**: Introduce a generic analytics interface in `src/components/exercise/microlearning/microlearningAnalytics.ts` that uses the existing `AppLogger` (with a specific `microlearning:analytics` namespace) as its target for now, but provides a strongly typed surface to easily swap to a third-party analytics SDK (like PostHog, Mixpanel, or Amplitude) later without modifying the engines.
- **Rationale**: The specification demands strict privacy bounds (preventing text payloads). Enforcing these bounds through TypeScript interfaces in a central analytics dispatcher file is safer than sprinkling direct logger calls everywhere.
- **Alternatives considered**: Directly wiring `useOnboardingAnalytics`, which was rejected because microlearning sits in a different domain than onboarding.

## Best Practices

**Unknown**: Audit Strategy for 11 Categories (Task 13)
- **Decision**: Provide a Python-based standalone CLI script `scripts/audit_microlearning_content.py` that parses `fixtures/`, `assets/`, and `.sql` seed files. It will run through the strict TypeScript validators by executing them via Node (or equivalent static JSON schema validation).
- **Rationale**: Python or bash is better suited for global string grepping and directory crawling. But actually, creating a temporary test file in TS that imports all content and runs them through `microlearningContentValidation.ts` is the most foolproof method since the rules are already coded in TS!
- **Revised Decision**: Create a TS script/test `scripts/auditMicrolearningContent.ts` that loads all seed files, parses them as JSON, and runs `validateLearningItem(item)`. This guarantees 100% adherence to the production schema.

**Unknown**: Preventing Replay on Hydration (Task 14)
- **Decision**: Add a transient `hasTrackedView` or `hasTrackedStart` property in the React component layer (via `useRef` or local state) rather than persisting it in the Redux store.
- **Rationale**: Hydration restores the Redux store from disk. If the tracking flag is in Redux, it would be serialized. But we specifically want to know when a UI component renders *freshly* in the current session.
