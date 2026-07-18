---
target: src/exercises/thoughtReframing/customSteps.tsx
total_score: 30
p0_count: 0
p1_count: 2
timestamp: 2026-07-17T16-38-12Z
slug: src-exercises-thoughtreframing-customsteps-tsx
---
Method: dual-agent (A: 019f70ec-64ee-7142-bde4-660e992ef819 · B: 019f70ec-8eea-77f1-befe-ccd68b3f4e34)

**Design Health Score**

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Progress and disabled state are visible, but the reason for being blocked is detached from the CTA. |
| 2 | Match System / Real World | 4 | "Write the sentence your mind said" and "Do not make it fair yet" are clear, CBT-appropriate, human phrases. |
| 3 | User Control and Freedom | 3 | Close, Back, input editing, and collapsible examples exist; footer obstruction weakens control. |
| 4 | Consistency and Standards | 3 | The screen fits the sage/editorial system, but the suggestion tray feels mechanically appended. |
| 5 | Error Prevention | 3 | Empty advance is prevented, but "a few words" does not explain the actual valid/invalid threshold. |
| 6 | Recognition Rather Than Recall | 4 | Placeholder, hint, and examples help users who freeze. |
| 7 | Flexibility and Efficiency | 3 | Typing and example selection are available; voice support exists in the input component but is disabled here. |
| 8 | Aesthetic and Minimalist Design | 2 | Calm upper half, but expanded examples crowd the writing task and are clipped by the fixed footer. |
| 9 | Error Recovery | 2 | Disabled CTA gives no immediate recovery action beyond reading a separate requirement note. |
| 10 | Help and Documentation | 3 | Inline guidance is useful; reassurance could be more direct at the raw-thought capture moment. |
| **Total** | | **30/40** | **Good foundation, blocked by layout and emotional-state polish.** |

**Anti-Patterns Verdict**

**LLM assessment**: This does not immediately read as AI-generated. The restrained sage palette, editorial title, quiet input, and plain CBT copy fit the product. The weak spots are subtler product-UI tells: a too-passive disabled CTA, gray helper text that feels default rather than intentional, and an expanded suggestion section that looks inserted below the main task instead of designed around it.

**Deterministic scan**: `node .agents/skills/impeccable/scripts/detect.mjs --json src/exercises/thoughtReframing/customSteps.tsx` returned `[]` with exit status `0`. No rule findings, no ignored findings, and no false positives.

**Visual overlays**: No reliable browser overlay is available. This target is a native Expo/iOS screenshot, not a DOM page with a mutable injection path. The evidence pass used the screenshot plus local source inspection instead.

**Overall Impression**

The top half is strong: it is calm, specific, and appropriately unadorned for a vulnerable CBT step. The biggest opportunity is to make the bottom half behave with the same care. Right now, optional examples and the fixed footer compete with the user’s own thought, and the clipped second example makes the screen feel unfinished.

**What's Working**

- The title and helper sentence are excellent: `Automatic thought` plus `Write the sentence your mind said.` gets to the point without clinical heaviness.
- The hint `Do not make it fair yet. We will check it next.` is exactly the right containment for this step.
- The writing surface is visually primary and brand-aligned: large, quiet, white, and bordered in sage.

**Priority Issues**

**[P1] Expanded examples are competing with the user's own thought**

**Why it matters**: This step asks for the user's raw sentence. When examples are expanded, they occupy the lower half of the screen and pull attention away from the empty input before the user has written anything.

**Fix**: Keep examples collapsed by default, or show one short example preview with a separate expansion path. If two examples remain visible, make the example area shorter, less text-heavy, and footer-safe.

**Suggested command**: `$impeccable layout`

**[P1] The footer visibly clips suggestion content**

**Why it matters**: The second example is cut off behind the fixed Continue/Back footer. That is a concrete polish break and creates a tap/scroll risk for the lower row.

**Fix**: Increase bottom content padding to match the actual footer height in this state, or make the footer participate in layout instead of overlaying scroll content. Verify with the examples expanded and with keyboard open.

**Suggested command**: `$impeccable adapt`

**[P2] Disabled Continue does not explain the blocked action**

**Why it matters**: A stressed user sees a pale inactive button and has to connect it to `Write a few words to continue.` Higher-friction therapeutic steps should not feel like silent failure.

**Fix**: Change the disabled label to `Add a few words` until valid, move the requirement closer to the CTA, or add a brief inline validation state directly under the input: `A rough sentence is enough.`

**Suggested command**: `$impeccable clarify`

**[P2] Example copy may over-prime self-critical thoughts**

**Why it matters**: Long examples like `I'm not doing enough to get this done...` can intensify anxious framing before the user has authored their own thought.

**Fix**: Use shorter, less loaded examples: `I can't handle this.` or `They are upset with me.` Keep `Use only if it matches. Edit the words after.`

**Suggested command**: `$impeccable clarify`

**[P3] Progress is visually calm but low-information**

**Why it matters**: The bar indicates some progress, but users may not know how much of the exercise remains.

**Fix**: Add accessible progress metadata and consider a quiet visual step count if it does not clutter the header.

**Suggested command**: `$impeccable audit`

**Persona Red Flags**

**Anxious First-Timer**: The disabled `Continue` plus separate `Write a few words to continue.` can read as a failure state. This user needs the screen to say that a rough, imperfect thought is acceptable.

**Overwhelmed User**: With examples expanded, the user sees close, input, collapse, two `Use` actions, disabled Continue, and Back. That is too many visible choices around a vulnerable writing task.

**Privacy-Sensitive User**: The input is clear, but the first raw-thought capture has no visible trust cue. A quiet `You can edit this before anything is saved` style reassurance may reduce hesitation.

**Minor Observations**

- `The thought that showed up` is gentle, but slightly abstract. `What your mind said` may connect better to the subtitle.
- The edit icon beside the hint works; it avoids sparkle/AI assistant vibes.
- `SuggestionCards` uses a 48px minimum row height, but the screenshot state still makes the lower action visually unsafe because of footer occlusion.
- The shared `Button` disabled colors are likely contrast-safe enough for a disabled control, but the state is too quiet emotionally.

**Questions to Consider**

- Should examples live on the same plane as the private thought, or one layer deeper?
- What should the footer say when the user is blocked: `Continue`, or the next concrete action?
- Would this step feel calmer if the empty state ended with reassurance instead of optional examples?
