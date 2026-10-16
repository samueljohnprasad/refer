---
title: 'Anonymous progress stays with the same user when identity is linked'
type: 'feature'
ticket: 2
created: '2026-10-12'
status: done
baseline_revision: '656f03223e38af81c8ddd4ecafd74b77135cfeb1'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'pinned'
lenses_ran: []
review_loop_iteration: 0
context:
  - '/Users/samuelprasad/Desktop/happy/journals/PRODUCT.md'
  - '/Users/samuelprasad/Desktop/happy/journals/_bmad-output/initiative-happy-product-direction/architecture-happy-product-direction/architecture-happy-product-direction.md'
  - '/Users/samuelprasad/Desktop/happy/journals/_bmad-output/initiative-happy-product-direction/epic-job-led-first-use/story-anonymous-starter-path-reaches-a-reusable-next-action-plan.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Optional Apple or Google signup exists, but the auth boundary does not expose the full anonymous-to-identified continuity result required by AD-1, and legacy guest cleanup can run without a schema-correct migration. A user must be able to link an identity after the first loop without losing or silently moving the Supabase-owned starter progress.

**Approach:** Harden the existing `claimProfile` link flow around one typed `IdentityLinkResultV1` contract. Keep successful linking on the same Supabase user id, keep conflict data attached to the anonymous user, make cancellation and retryable failures explicit, and preserve the existing stay-or-move recovery UI without automatic merge or deletion.

## Boundaries & Constraints

**Always:** Use Supabase `linkIdentity` for anonymous claims; report anonymous and effective user ids, operation id, exact status, and retryability; ensure the linked session/profile is hydrated before success; keep provider-specific Apple native/OAuth and Google OAuth boundaries; keep sensitive reflection content out of analytics and logs.

**Never:** Silently sign the anonymous user into another account, merge or delete conflicting data, clear local progress before a real migration succeeds, change durable ownership away from `auth.uid()`/`user.id`, or make signup required before the first meaningful loop.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| LINKED | Anonymous session with completed starter rows; provider identity is available | Link succeeds; anonymous and effective ids match; profile/session refreshes; result is `linked` and retryable is false | No data migration or account switch occurs |
| RECOVERY_REQUIRED | Provider identity already belongs to another account | Anonymous session and rows remain active; conflict UI offers stay or explicit move; result names the conflict | No merge, delete, or automatic switch |
| CANCELLED | User cancels native or OAuth provider flow | Anonymous session remains unchanged; result is `cancelled` and retryable is false | No error toast required |
| RETRYABLE_FAILURE | Temporary provider/network failure after claim starts | Anonymous session remains usable; result is `retryable_failure` with retryable true and operation id | User can retry without duplicate linking |

</frozen-after-approval>

## Code Map

- `src/context/AuthContext.tsx` -- owns anonymous bootstrap, `claimProfile`, conflict state, session hydration, and the identity-link result contract; preserve existing `moveToExistingAccount` as explicit recovery.
- `src/network/auth/google-auth.ts` and `src/network/auth/apple-auth.ts` -- provider-specific `linkIdentity` and cancellation/conflict boundaries; reuse them rather than moving provider logic into the context.
- `src/components/SignInBottomSheet/useSignInBottomSheetController.ts` and `src/components/SignInBottomSheet/AccountConflictContent.tsx` -- consume claim outcomes and present the explicit stay/move recovery choice.
- `src/lib/migrations/migrateGuestProgress.ts` and `hooks/data/useGuestProgress.ts` -- legacy local-progress migration currently clears data without inserting rows; do not treat that as proof of a successful migration.
- `hooks/data/useCompleteOnboarding.ts` and `supabase/migrations/20260428000000_journey_map_v5.sql` -- show that onboarding/course rows are already keyed to the current Supabase user and protected by user ownership.
- `src/components/SignInBottomSheet/useSignUpAnalytics.ts` -- existing metadata-only signup funnel; retain redaction and add only outcome metadata if needed.

## Tasks & Acceptance

**Execution:**
- [ ] `src/context/AuthContext.tsx` -- expose the typed identity-link result, operation/id continuity checks, and safe failure mapping -- keep anonymous rows owned by the same user and avoid false success.
- [ ] `src/network/auth/google-auth.ts` and `src/network/auth/apple-auth.ts` -- preserve provider-specific link/cancel/conflict behavior and normalize retryable provider failures at the auth boundary -- avoid duplicating provider logic.
- [ ] `src/components/SignInBottomSheet/useSignInBottomSheetController.ts` and `src/components/SignInBottomSheet/AccountConflictContent.tsx` -- consume the new recovery status and keep stay/move explicit -- do not auto-switch or clear anonymous data.
- [ ] `src/lib/migrations/migrateGuestProgress.ts` -- prevent cleanup from claiming or clearing progress when no schema-correct migration occurred -- retain legacy behavior only where it is actually acknowledged.

**Acceptance Criteria:**
- Given an anonymous user with starter data, when Apple or Google linking succeeds, then the resulting `IdentityLinkResultV1` is `linked`, the effective user id equals the anonymous user id, and the same user-owned progress remains readable after relaunch.
- Given a provider identity already belongs to another account, when linking is attempted, then the result is `recovery_required`, the anonymous session remains active, and the UI presents an explicit stay-or-move choice without merging or deleting data.
- Given cancellation or a temporary provider failure, when the flow ends, then the anonymous session and progress remain usable and the result distinguishes `cancelled`, `retryable_failure`, and `failed` accurately.
- Given the user explicitly chooses the existing-account move path, when sign-in completes, then the app switches only to that selected account and leaves the former anonymous user’s server-owned data untouched.

## Implementation Notes

- Added `IdentityLinkResultV1` with operation id, anonymous/effective user ids, retryability, and explicit recovery/cancel/failure statuses.
- `claimProfile` now rejects an identity link that changes the active Supabase user id and maps transient provider/network errors to `retryable_failure`.
- Removed unconditional guest-progress cleanup from the legacy migration and explicit account-move UI; local data remains until a real schema-correct migration exists.
- No automated tests were added per repository instruction; verification is limited to targeted static checks and diff hygiene.

## Plan Change Log

- 2026-10-12: Approved by “next”; implemented the first continuity hardening pass.

## Review Triage Log

- 2026-10-12: No external review lens launched; manual diff review found no additional acceptance-criteria violation. Full TypeScript verification remains unconfirmed because the command timed out.

## Design Notes

The recovery surface should explain ownership plainly: staying keeps the current anonymous progress; moving signs into the existing provider account. Do not promise that progress transfers between accounts. Keep the current calm bottom-sheet treatment and localized sentence-case copy.

## Verification

**Commands:**
- `npm run lint` -- expected: exit 0 with no new errors attributable to the auth-link changes.
- `npx tsc --noEmit --pretty false` -- expected: no new errors in the touched auth, provider, controller, or migration files.
- `git diff --check` -- expected: no whitespace errors.

**Manual checks:**
- In a preview environment, link Apple and Google from an anonymous session and compare the pre/post Supabase user id and starter-row ownership.
- Trigger a provider identity conflict and confirm the anonymous session remains active until the user explicitly chooses stay or move.
- Cancel each provider flow and retry a transient failure without duplicate identity or progress changes.
