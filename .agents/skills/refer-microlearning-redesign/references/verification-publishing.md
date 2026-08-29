# Verification and Publishing

## Capture the Unchanged Baseline

Before edits, record:

- exact local compiler executable, arguments, exit code, full output, line count, and hash;
- category inventory across runtime, YAML, SQL, fixtures, validators, and registries;
- content validator command and exercise/file counts;
- package manifest and lockfile hashes;
- Git branch, local head, remote head, status, and user-owned dirty paths;
- file-size and applicable deprecated-key/raw-color/timer/privacy scans.

Use the same compiler executable and configuration after the task. If `npx tsc` unexpectedly reports zero while the captured direct compiler has known diagnostics, treat the `npx` result as non-authoritative until executable, version, config, and output are proven identical.

## Required Behavior Evidence

Create focused fail-first executable probes or repository tests for:

1. strict reader accepts the new shape and rejects every relevant malformed/legacy shape;
2. authoring validator enforces the same contract;
3. canonical restoration retains only valid deterministic progress;
4. raw-versus-canonical repair occurs before route completion;
5. every phase returns the correct label, `ready`, action, and response;
6. only canonical full completion falls through to shared route advancement;
7. restore does not replay haptics, announcements, analytics, or celebration;
8. accessibility announcements occur once per genuine user-driven stage change;
9. optional sandbox/edit/reset behavior cannot corrupt required progress;
10. privacy scan shows responses contain only allowed opaque state.

Record counts only after inspecting what each assertion covers. A high assertion count cannot replace a missing integration boundary.

## Full Verification Gate

- Target behavior probes pass.
- Standalone content validator reports every authored object and zero issues.
- YAML/SQL inventory matches the pre-task count and no legacy keys remain.
- Full compiler output is byte-identical to the captured baseline, or every difference is explained and approved.
- Touched helpers meet the 300-line cap.
- No timers, raw colors, punitive error haptics, per-frame persistence, passive goals/stories, or sensitive response copy remain when forbidden by the category contract.
- Package/lock hashes are unchanged unless explicitly in scope.
- `git diff` contains only the task.
- Staged paths exclude every user-owned unrelated file.
- Manual simulator, VoiceOver, Dynamic Type, and Reduce Motion checks are performed when tooling is available; otherwise report them as unavailable, not passed.

## Semantic Review

Review both specification compliance and code quality. Trace the whole integration path and concentrate on known miss zones:

- active footer label exists but is disabled by `ready`;
- renderer sanitizes after shared routing already read raw completion;
- valid prefix restoration skips a required feedback stage;
- forged completion advances;
- slider endpoint is off its authored step grid;
- a live-region prop is assumed to cover iOS;
- announcement fires on mount/hydration or interrupts current speech;
- response includes scenario/feedback/free text;
- minified SQL rewrite changes neighboring objects;
- a helper crosses 300 lines;
- a cleaner TypeScript command is not the captured command.

Each verified review fix gets a focused commit. Invalidate verification/review evidence that overlapped an amend or later fix; rerun against the stable final tree.

## Commit and Publish Protocol

1. Stage explicit task paths and inspect the staged diff.
2. Commit the coherent implementation cutover.
3. Commit each post-review correction separately.
4. Before each push, confirm remote `journals` equals the expected parent.
5. Fast-forward exactly one commit.
6. Confirm remote head and remote tree match that local commit.
7. Repeat for the next task commit.
8. Synchronize the tracking ref and verify local/remote alignment.

Do not squash, rebase published commits, force-push, or advance the branch with several prepared commits in a single ref update when the user requested commit-by-commit publication.

If HTTPS credentials disappear, use only an already-authorized repository write path. Do not request pasted credentials. If a connector blocks or reaches a usage limit, stop before the next exercise and report:

- last verified remote SHA;
- local pending SHA and its parent;
- whether the pending tree is reviewed and verified;
- unrelated dirty files preserved;
- exact non-force retry needed.

