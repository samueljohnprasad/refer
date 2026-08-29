# Interaction and State Contract

## Product Interaction

- Present one active decision at a time.
- Keep the main visual/workspace stable while its contents update in place.
- Collapse completed work into short summaries; do not stack full completed screens.
- Replace choices with feedback instead of showing both simultaneously.
- Prefer 2–3 visible choices and minimal typing.
- Use immediate, non-punitive feedback. A wrong answer stays at the current decision with useful support.
- Keep optional exploration after the core learning outcome; it must not block final progress.
- Give interactive targets at least 48 points and meaningful accessibility roles, labels, hints, state, and reading order.

## Response Boundary

Responses are opaque progression records. Prefer:

```ts
type ExerciseResponse = {
  phase: "active" | "feedback" | "complete";
  stepIndex: number;
  selectedIds: string[];
  retryCount?: number;
};
```

Store only values needed to resume deterministically:

- authored option/step/control IDs;
- bounded indices or phase tags;
- retry/clue state when it changes the next interaction;
- settled authored numeric values when required by an explorable model.

Do not store scenario copy, learner-visible feedback, answer prose, reconstructed sentences, chart descriptions, or reflective/therapeutic free text. Derive display copy from the current authored content and stored IDs.

## Canonical Restoration

Treat persisted state as untrusted even when the current app normally writes valid responses. It can be stale, partial, forged, interrupted, or created by an earlier build.

Canonicalization must:

- reject unknown IDs and invalid types;
- accept only the longest valid contiguous progression prefix;
- clamp/snap numeric controls to the authored domain and reachable step grid;
- normalize phase to the state actually earned;
- preserve valid feedback/clue/retry state when deterministic;
- move a full unfinished prefix to its required final feedback stage rather than skipping it;
- prevent partial progress labeled `complete` from advancing;
- produce a stable canonical value so repeated sanitation is idempotent.

Use the canonical value synchronously for render and transition decisions. Persist repair separately and only when raw and canonical values differ semantically. Do not rely on a mount effect to make a raw route decision safe.

## Transition Contract

Every phase declares:

- visible footer label;
- `ready`/enabled state;
- internal action or route fallthrough;
- next canonical response;
- whether a user-triggered haptic or announcement occurs.

`ready` is the shared footer's enabled contract, not a vague statement that the exercise is finished. Examples:

| Phase | Label | Enabled when | Result |
|---|---|---|---|
| Active deterministic move | `Apply move`, `Next clue`, `Reveal layer` | Usually immediately | Update same exercise |
| Active choice | `Check`, `Choose` | A valid choice is selected | Update same exercise |
| Unsupported feedback | `Try again` | Immediately | Return to same decision |
| Supported feedback | Category-specific next label | Immediately | Reveal/activate next stage |
| Final earned state | `Continue` | Immediately | Allow shared route advance |

Test every returned `ready` value through the actual shared footer consumer. A correct label with `ready: false` is an unreachable action.

The category transition must repair non-canonical raw state before completion. Prefer an explicit exhaustive result such as `internal`, `repair`, or `advance`; never depend on `undefined` plus a later raw `phase === "complete"` check. Match `complete` explicitly after strict canonicalization—never interpret an `else`, `default`, unknown phase, or unhandled union member as completion.

## Side Effects

- Fire haptics only for intentional user-triggered moments.
- Do not use punitive error haptics for learning mistakes.
- Do not replay haptics, analytics, focus moves, or announcements on mount, hydration, canonical repair, or same-stage rerender.
- Sliders may update visual draft state continuously, but persist only settled values unless the contract explicitly requires streaming.
- Completion restore must not replay celebration or progress side effects.

## Accessibility Announcements

`accessibilityLiveRegion="polite"` is not a cross-platform VoiceOver solution; it is Android-specific in React Native. For iOS, use an explicit announcement or focus strategy supported by the installed React Native version.

Announcements must be tied to genuine user-driven stage changes:

- no announcement on first render;
- no announcement during hydration or repair;
- no repeat for the same stage;
- announce useful outcome text, not a generic control name;
- queue at low priority when the installed API supports it so current speech is not unnecessarily interrupted.

Keep visible textual equivalents for chart deltas and non-textual model changes.
