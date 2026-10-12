- source_plan: `/Users/samuelprasad/Desktop/happy/journals/_bmad-output/initiative-happy-product-direction/epic-job-led-first-use/story-anonymous-starter-path-reaches-a-reusable-next-action-plan.md`
  summary: Existing metadata, installed skill bundles, and BMAD artifacts remain outside ticket 1.1 runtime scope.
  evidence: The worktree was already dirty before ticket 1.1 implementation; repository rules require preserving those user changes, and the build review diff includes them because it is based on the recorded HEAD revision.

- source_plan: `/Users/samuelprasad/Desktop/happy/journals/_bmad-output/initiative-happy-product-direction/epic-job-led-first-use/story-durable-starter-path-progress-resumes-and-switches-plan.md`
  summary: A second authored StarterPath is required to verify visible multi-path switching end to end.
  evidence: The queue verification explicitly requires paths A and B, but the approved product direction currently defines only `understand_anxious_thoughts`; inventing a second user-facing path would require a product decision.

- source_plan: `/Users/samuelprasad/Desktop/happy/journals/_bmad-output/initiative-happy-product-direction/epic-job-led-first-use/story-activation-and-paywall-boundaries-plan.md`
  summary: Hosted paywall, Supabase environment, iOS 26, and release evidence remain unverified locally.
  evidence: Static route and event checks pass, but the queue explicitly requires released offering, hosted project separation, native target, and final event-name verification that cannot be proven from this worktree alone.

- source_plan: `/Users/samuelprasad/Desktop/happy/journals/_bmad-output/initiative-happy-product-direction/epic-job-led-first-use/story-home-resumes-one-next-action-plan.md`
  summary: The iOS runtime now loads the local Metro bundle over LAN; the specific StarterPath resume interaction still needs a seeded path record.
  evidence: The iPhone 17 simulator connected to `http://192.168.0.9:8081`, loaded Happy, authenticated an anonymous user, and rendered Home with the existing journey continuation card. No seeded second StarterPath was available for path-specific resume verification.

- source_plan: `/Users/samuelprasad/Desktop/happy/journals/_bmad-output/initiative-happy-product-direction/epic-job-led-first-use/story-durable-starter-path-progress-resumes-and-switches-plan.md`
  summary: The linked Supabase project has migration drift and cannot safely receive this migration through a normal push.
  evidence: The remote schema dump confirmed legacy `exercise_entries` exists, while the local migration chain does not define it. Per explicit feature scope, only `20261012120000_starter_path_progress` was executed directly and then recorded as applied; remote verification confirms `user_starter_path_progress`, `active_path_id`, and `complete_starter_path_step` exist. Unrelated historical migrations remain unapplied.

- source_plan: `/Users/samuelprasad/Desktop/happy/journals/_bmad-output/initiative-happy-product-direction/epic-job-led-first-use/story-activation-and-paywall-boundaries-plan.md`
  summary: Ticket 2 identity-link type and alias errors remain outside the ticket 7 telemetry change.
  evidence: The review reproduced the errors in `AuthContext.tsx` and `identity-link-result.ts`; ticket 7 changed only paywall telemetry and does not own that identity-link boundary.

- source_plan: `/Users/samuelprasad/Desktop/happy/journals/_bmad-output/initiative-happy-product-direction/epic-job-led-first-use/story-activation-and-paywall-boundaries-plan.md`
  summary: Starter-path save telemetry still lacks explicit path identifiers at the generic exercise completion boundary.
  evidence: `useExerciseFlowActions` emits generic `exercise_completed` metadata, while adding starter context requires a separate route-contract decision beyond the ticket 7 paywall boundary.

- source_plan: `/Users/samuelprasad/Desktop/happy/journals/_bmad-output/initiative-happy-product-direction/epic-job-led-first-use/story-activation-and-paywall-boundaries-plan.md`
  summary: StarterPath re-entry can still write revision zero and risk stale progress.
  evidence: The revision-aware RPC exists, but the pre-existing lesson re-entry path still uses the ticket 3 local upsert behavior; ticket 7 does not alter persistence.

- source_plan: `/Users/samuelprasad/Desktop/happy/journals/_bmad-output/initiative-happy-product-direction/epic-job-led-first-use/story-activation-and-paywall-boundaries-plan.md`
  summary: Completed Thought Catcher progress does not yet advance the StarterPath completion state shown by Home.
  evidence: The existing ticket 3/5 flow does not mark the durable path completed after the generic exercise save; this is outside the ticket 7 telemetry change.

- source_plan: `/Users/samuelprasad/Desktop/happy/journals/_bmad-output/initiative-happy-product-direction/epic-job-led-first-use/story-activation-and-paywall-boundaries-plan.md`
  summary: StarterPath onboarding completion and active-path pointer writes are not failure-atomic.
  evidence: Existing ticket 1/3 code calls `markCompleted` before `setActiveStarterPath`; ticket 7 does not change that ordering.

- source_plan: `/Users/samuelprasad/Desktop/happy/journals/_bmad-output/initiative-happy-product-direction/epic-job-led-first-use/story-activation-and-paywall-boundaries-plan.md`
  summary: AuthContext size and the StarterPath repository any-cast remain separate cleanup work.
  evidence: Both findings are pre-existing ticket 2/3 implementation state and are not introduced by the ticket 7 event patch.

- source_plan: `/Users/samuelprasad/Desktop/happy/journals/_bmad-output/initiative-happy-product-direction/epic-job-led-first-use/story-activation-and-paywall-boundaries-plan.md`
  summary: The review diff necessarily contains unrelated pre-existing dirty files and generated artifacts.
  evidence: The worktree was already dirty before ticket 7, and the repository instructions require preserving those files without committing or broad cleanup.

- source_plan: `/Users/samuelprasad/Desktop/happy/journals/_bmad-output/initiative-happy-product-direction/epic-job-led-first-use/story-refactor-sweep-closes-first-use-foundation-plan.md`
  summary: Ticket 2 identity-link import and fallback typing errors remain unresolved.
  evidence: Review reproduced the errors in the pre-existing identity-link additions; ticket 8 introduces no identity behavior.

- source_plan: `/Users/samuelprasad/Desktop/happy/journals/_bmad-output/initiative-happy-product-direction/epic-job-led-first-use/story-refactor-sweep-closes-first-use-foundation-plan.md`
  summary: StarterPath completion advancement and revision-zero re-entry remain unresolved.
  evidence: The current ticket 3/5 persistence flow can repeat the practice or overwrite resumed state; a complete fix depends on the unresolved second-path/state-transition decision.

- source_plan: `/Users/samuelprasad/Desktop/happy/journals/_bmad-output/initiative-happy-product-direction/epic-job-led-first-use/story-refactor-sweep-closes-first-use-foundation-plan.md`
  summary: First-use copy is still English-only in the supported locale resources.
  evidence: New onboarding and Home keys are present in English but absent from other locale bundles; this is separate localization work.

- source_plan: `/Users/samuelprasad/Desktop/happy/journals/_bmad-output/initiative-happy-product-direction/epic-job-led-first-use/story-refactor-sweep-closes-first-use-foundation-plan.md`
  summary: The es-MX App Store metadata remains unrelated dirty work.
  evidence: The metadata change predates this refactor review and is preserved without expanding the ticket scope.

- source_plan: `/Users/samuelprasad/Desktop/happy/journals/_bmad-output/initiative-happy-product-direction/epic-job-led-first-use/story-refactor-sweep-closes-first-use-foundation-plan.md`
  summary: StarterPath repository typing and AuthContext file size remain cleanup work.
  evidence: The `any` cast and oversized provider are pre-existing ticket 2/3 implementation state, not caused by ticket 8.
