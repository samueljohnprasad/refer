# Task 1 Report: Shared microlearning foundation

## Status

Implemented and verified the shared Journey microlearning foundation without category seed cutovers, compatibility readers, migrations, automated test files, or package-manager changes.

## Implementation

- Added the public microlearning phase, response, choice, and content-issue types.
- Added saved-response helpers for phase restoration, clamped stage indexes, final-response detection, and removed-choice sanitization.
- Added generic runtime validation for the eleven redesigned categories. Foundation validation requires bounded titles and instructions; later category tasks add strict contracts.
- Added presentation-only primitives for the stable workspace, prompt, choices, compact history, inline feedback, stage progress, comparison, and optional image/audio media.
- Added explicit audio play, pause, and replay controls with a transcript and no autoplay. Optional image/audio failures preserve the text path.
- Updated node routing so `isFooterActionEnabled` means the current footer action is enabled. A matching `phase: "complete"` response advances only when final `Continue` is pressed.
- Suppressed the visible and programmatic route-level skip paths for all eleven microlearning categories.
- Added the five requested fixture modules and a local fixture catalog that remains usable during server loading, error, and empty states. Aggregate arrays intentionally remain empty.
- Added a standalone authoring validator with focused parser/rule modules. It inventories the eleven categories across exercise-schema YAML and every SQL `jsonb_to_recordset` array, including doubled single quotes and tagged/untagged dollar quotes.

## Verification

- Direct response probe: phase fallback/restoration, stage clamping, final-response detection, and removed selection sanitization passed.
- Direct parser probes: doubled single quote, untagged dollar quote, tagged dollar quote, and malformed matched quote passed.
- Generic rule probes: duplicate IDs and invalid counts produced the expected issues.
- SQL parser coverage: 18 matched `jsonb_to_recordset` calls, 18 parsed, 0 silently skipped, 0 issues.
- Content validator: scanned 25 SQL/YAML files; inventoried 37 objects across all eleven categories; 0 issues.
- Full TypeScript: 143 lines / 104 known baseline errors, matching `/tmp/journey-microlearning-tsc-before.log`; 0 touched-path diagnostics and 0 new diagnostic lines.
- File size: no new or touched component/helper exceeds 300 lines; the largest is 300 lines.
- Static checks: no new hex colors, educational timers/autoplay, or future category runtime imports.
- `git diff --check`: passed.
- Package manifests and lockfiles: unchanged.
- Exact staged-scope check: performed before commit; unrelated `.claude/skills/*` deletions and `docs/superpowers/plans/2026-08-12-sleep-reset-section-3-yaml.md` remained unstaged.

## Limitations and concerns

- `graphify` is not installed, so graph/path verification used exact `rg` inspection as directed. `graphify update .` could not be run.
- No category fixtures or aggregate exercises are authored in Task 1 by design; Tasks 2–12 populate them with each clean cutover.
- Existing old seed shapes are inventoried and receive only generic foundation validation until their category task replaces them.
- Simulator, VoiceOver, and Dynamic Type checks are deferred to the category implementations and final accessibility task because Task 1 provides shared primitives and empty fixtures only.

## Fix round 1: Blocking foundation boundaries

### Product fixes

- Completion eligibility now requires both the current exercise format and `phase: "complete"` for all eleven microlearning categories. The router returns before every legacy direct, error-feedback, or success-feedback completion branch for non-final microlearning responses. Unrelated categories retain their existing direct and feedback behavior.
- Standalone inventory now reports every recognized category with missing, null, or non-object `content` / `content_schema` as a complete `file | category | source | path | message` issue instead of silently dropping it.
- `ChoiceTray` now accepts a separate `selectedId`. Radio `selected` semantics derive only from that ID; `supported` and `unsupported` remain feedback appearance and disabled-interaction states.
- Extracted the existing node interaction callback and generic data-error surface into focused helpers so `NodeEngineRouter.tsx` remains exactly 300 lines.

### Focused verification commands and output

Completion boundary probe:

```sh
NODE_NO_WARNINGS=1 node --experimental-strip-types --input-type=module <<'NODE'
import { shouldCompleteOnPrimaryPress } from './src/components/exercise/microlearning/microlearningResponse.ts';
// Probes mismatched complete, matching active/feedback/complete, unrelated direct.
NODE
```

```text
PASS mismatched complete: false
PASS matching active: false
PASS matching feedback: false
PASS matching complete: true
PASS unrelated direct: true
```

Malformed inventory probe:

```sh
node --input-type=module <<'NODE'
import { inventoryYaml } from './scripts/journey-microlearning-validator/inventory.mjs';
// Probes content null, missing content, malformed content_schema, valid object.
NODE
```

```text
PASS content null: content null.yaml | dialogue | yaml | $.items[0].content | Recognized category content must be an object.
PASS missing content: missing content.yaml | dialogue | yaml | $.items[0].content | Recognized category content must be an object.
PASS malformed content_schema: malformed content_schema.yaml | dialogue | dialogue | $.exercises[0].content_schema | Recognized category content must be an object.
PASS valid recognized object: 1 item, 0 issues
```

Choice accessibility evidence:

```sh
rg -n 'const isSelected = choice.id === selectedId|accessibilityState=\{\{ disabled: isDisabled, selected: isSelected \}\}' src/components/exercise/microlearning/ChoiceTray.tsx
rg -n 'isSelected = state|state !== "idle".*selected' src/components/exercise/microlearning/ChoiceTray.tsx
```

```text
30:        const isSelected = choice.id === selectedId;
43:            accessibilityState={{ disabled: isDisabled, selected: isSelected }}
PASS feedback visual state does not derive accessibility selection
```

Repository validation:

```sh
node scripts/validate-journey-microlearning-content.mjs .
```

```text
Scanned 25 SQL/YAML files.
guided_discovery_trail: 2 objects
reframe_builder: 1 objects
teach_back_chain: 2 objects
explorable_model: 1 objects
faded_thought_record: 1 objects
worked_rewrite: 1 objects
layer_zoom: 4 objects
dialogue: 3 objects
what_if_machine: 4 objects
course_checkpoint: 5 objects
recall_warmup: 13 objects
Validation passed for 37 inventoried objects.
```

TypeScript baseline comparison:

```sh
node node_modules/typescript/bin/tsc --noEmit --pretty false > /tmp/journey-microlearning-fix1-tsc-verified.log 2>&1
wc -l /tmp/journey-microlearning-fix1-tsc-verified.log
rg -c 'error TS' /tmp/journey-microlearning-fix1-tsc-verified.log
comm -13 <(sort /tmp/journey-microlearning-tsc-before.log) <(sort /tmp/journey-microlearning-fix1-tsc-verified.log)
```

```text
143 /tmp/journey-microlearning-fix1-tsc-verified.log
104
(no new diagnostic lines; no touched-path diagnostics)
```

File/diff/package checks:

```sh
find scripts/journey-microlearning-validator src/components/exercise/microlearning src/components/node -type f \( -name '*.mjs' -o -name '*.ts' -o -name '*.tsx' \) -print0 | xargs -0 wc -l | awk '$1 > 300 && $2 != "total"'
git diff --check
git status --short -- package.json package-lock.json yarn.lock bun.lock
```

```text
PASS no component/helper over 300 lines
PASS git diff --check
PASS manifests and lockfiles unchanged
```

### Fix-round self-review

- Re-read all three blocking findings against the final diff; each has direct evidence above.
- Confirmed the router guard occurs before every legacy completion branch, while the helper probe preserves unrelated direct completion.
- Confirmed inventory returns exactly one explicit issue for each malformed recognized occurrence and one item for valid content.
- Confirmed selection semantics are independent of feedback visual state.
- Did not address the deferred 2–4 rendering guard or scratch-report hygiene minors.
