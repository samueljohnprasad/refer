# Repository Workflow

## Project Boundary

- Repository: `samueljohnprasad/refer`
- Working branch: `journals`
- Product: React Native/Expo mental-health microlearning curriculum.
- Current policy: pre-launch strict cutover; no production migration or backward-compatibility layer unless the user explicitly changes this policy.
- User preference: complete one task, verify it, commit it, push it, review it, then stop.

Do not assume a restored workspace is synchronized. Inspect:

```bash
git branch --show-current
git status --short
git rev-parse HEAD
git rev-parse origin/journals
git log --oneline --decorate -n 20
```

If branch-name fetch data looks stale, compare exact known commit objects and the connected GitHub repository state before changing local history. Never discard user changes to make synchronization easier.

## Scope Reconstruction

Before editing, locate all category-owned surfaces using `rg`/`rg --files`:

| Surface | What to inventory |
|---|---|
| Runtime reader | Strict content types, parse/validation functions, deprecated keys |
| Response/state | Stored response type, canonical sanitizer, equality, restore rules |
| Transition | Every phase, label, `ready`, internal action, completion fallthrough |
| Renderer | Active workspace, prior summaries, feedback, accessibility, haptics |
| Registry/router | Category dispatch and shared footer/route integration |
| Authoring validator | Standalone YAML/SQL contract and precise errors |
| Fixture/YAML | Every manual example and curriculum object |
| SQL seed | Every category object, including minified or embedded JSON |
| Tests/probes | Existing executable behavior contracts and gaps |

Record the exact count and locations before editing. A zero SQL count is a valid result only after an inventory proves it; do not create a SQL change merely for symmetry.

## Strict Atomic Cutover

The category lands in one readable schema state:

- Remove legacy reader branches and deprecated keys.
- Migrate every discovered authored object in the same task.
- Update runtime and standalone authoring validators together.
- Keep YAML and SQL semantically equivalent when they represent the same exercise.
- Prove mechanical changes to minified seed files affect only intended objects and neighboring bytes remain untouched.
- Do not defer known legacy objects to the final audit.

If the content contract is unclear, stop and reconcile it with the approved plan. Do not invent a permissive union to keep old data rendering.

## File and Change Discipline

- Preserve unrelated deletions, untracked plans, and user work.
- Use explicit staging paths and inspect `git diff --cached --name-status`.
- Keep focused helpers under the repository's 300-line hard cap. Split by responsibility rather than compressing formatting.
- Do not change dependencies, package manifests, lockfiles, migrations, or generated artifacts unless the target category requires them and the approved plan covers them.
- Do not add analytics or production compatibility during an exercise redesign; those are separate planned tasks.

## Review Boundary

Review the full behavior path:

```text
authored object -> strict reader -> canonical response -> transition
-> shared footer -> renderer -> persisted response -> route completion
```

A category can look correct in isolation and still fail at the shared footer, router, hydration, accessibility, or seed boundary. Inspect those consumers directly.

## Completion Boundary

The task is complete only when:

- all category objects are strict and valid;
- restoration and transition probes pass;
- shared footer actions are reachable;
- only final `Continue` routes;
- accessibility behavior is correct on both platforms by contract;
- full compiler output matches or improves the exact captured baseline with an explained diff;
- semantic review has no unresolved finding;
- every task commit is remote in order and its tree is verified;
- unrelated working-tree state is unchanged.

