---
name: refer-microlearning-redesign
description: Use when continuing, fixing, reviewing, or publishing microlearning exercise-component redesign work in the samueljohnprasad/refer repository on the journals branch.
---

# Refer Microlearning Redesign

Complete exactly one approved exercise-category task as a coherent product unit. Runtime parsing, canonical restoration, transitions, renderer behavior, authored YAML/SQL, accessibility, verification, review, commits, and remote history must agree before moving on.

## Start Here

1. Read repository instructions, the approved design/plan, and the relevant existing category implementation.
2. Read [current-status.md](references/current-status.md), then verify every time-sensitive claim against local and remote Git state. Git is authoritative.
3. Read [repository-workflow.md](references/repository-workflow.md) for scope, inventory, strict cutover, and one-task sequencing.
4. Read [interaction-state-contract.md](references/interaction-state-contract.md) before changing readers, responses, restoration, transitions, renderers, footer actions, haptics, or announcements.
5. Read the target category in [exercise-patterns.md](references/exercise-patterns.md). The approved plan and current authored content override a generic pattern when they are more specific.
6. Read [verification-publishing.md](references/verification-publishing.md) before implementation so evidence is captured from the unchanged base, not reconstructed afterward.

If an earlier task has an unreviewed or unpublished commit, finish that boundary first. Do not start the next exercise.

## Binding Rules

- Work on one named exercise category only. Stop after its final review and remote-head verification.
- Do not add backward compatibility. Migrate every runtime fixture, YAML object, and SQL seed object for the category in the same cutover.
- Establish a failing behavior probe before production changes. A schema validator alone is not a behavior probe.
- Store authored IDs and progression state, not free-form therapeutic text, scenario copy, feedback copy, or computed prose.
- Canonicalize untrusted saved responses before rendering or checking completion. Only an already-canonical, fully completed response may fall through to course routing.
- Internal actions update the current exercise in place. Only the final `Continue` advances the route.
- In the shared footer contract, `ready` means the visible action is enabled. Test the `ready` value for every phase and label.
- Preserve user-owned uncommitted files. Stage explicit paths; never stage the whole worktree by convenience.
- Compare verification against the exact pre-task baseline command and output. An unexpectedly cleaner command is suspicious until proven equivalent.
- Commit implementation and verified review fixes separately. Push and verify each commit sequentially; never squash or force-update reviewed history to work around publishing trouble.

## One-Task Execution Loop

1. **Reconcile:** confirm branch, local/remote heads, dirty files, pending commits, target category, approved behavior, and every authored occurrence.
2. **Baseline:** capture the exact compiler output, category inventory, validator result, relevant tests/probes, package hashes, and applicable file-size/static scans.
3. **RED:** prove the missing or broken reader/state/transition/restore/accessibility behavior with focused executable probes.
4. **GREEN:** implement the smallest strict end-to-end cutover across runtime, authoring validation, fixture/YAML, and SQL when inventory is non-zero.
5. **Verify:** run the target matrix plus the unchanged whole-repository baseline comparison. Inspect the diff and staged paths.
6. **Review:** perform semantic review of integration boundaries, not only the component diff. Fix each verified finding in a separate focused commit and rerun affected gates.
7. **Publish:** fast-forward one commit at a time, confirming the expected remote parent and resulting remote tree after each update.
8. **Stop:** report behavior, evidence, commit links/SHAs, untouched files, and the next unstarted task.

## Stop Conditions

Stop without starting another category when credentials, connector limits, stale branch advertisements, remote divergence, missing dependencies, unavailable Apple QA tooling, or ambiguous authored inventory prevents a required gate. Report exact local/remote state and the smallest safe resume action. Never reinterpret a blocker as permission to batch, squash, force-push, or skip evidence.
