HAPPY APP — UI / VISUAL POLISH AUDIT + IMPLEMENTATION PROMPT

You are acting as a senior consumer-mobile product designer and iOS UI engineer.

Your task is to study the EXISTING Happy screen, understand the existing Happy design system, and polish the screen so it feels:

- premium
- intentionally designed
- calm
- emotionally safe
- highly readable
- tactile
- cohesive with the rest of Happy
- crafted by experienced product designers
- not generic
- not AI-generated-looking
- not over-designed

This is primarily a VISUAL POLISH task.

Do not redesign the feature unless an existing visual decision is clearly harming usability.

==================================================

1. # FIRST: STUDY THE EXISTING HAPPY DESIGN SYSTEM

Before changing anything, inspect the existing project and identify the actual reusable design tokens/components for:

- page background
- primary dark text / forest text
- secondary text
- brand green
- pale sage surfaces
- warm cream surfaces
- neutral borders
- error colors
- success colors
- selected states
- disabled states
- card radii
- button radii
- shadows
- tactile button depth
- spacing tokens
- typography styles
- progress bar
- top navigation
- primary CTA
- secondary CTA
- answer buttons
- informational cards
- exercise cards

Do not invent a new visual language for one screen.

The screen should unmistakably look like it belongs inside Happy.

================================================== 2. CORE HAPPY VISUAL PRINCIPLE
==================================================

Happy should feel:

CALM + WARM + TACTILE + PREMIUM + RESTRAINED

Not:

clinical
corporate
childish
cartoonishly gamified
overly pastel
overly green
AI-generated
template-like
dashboard-like
dense
busy

================================================== 3. CLICKABLE VS INFORMATIONAL
==================================================

Use this rule consistently:

CLICKABLE = TACTILE
INFORMATIONAL = FLAT

Clickable elements may use the existing Happy tactile treatment:

- physical bottom edge / depth
- pressed state
- clear border
- appropriate selection state

Examples:

- answer options
- reveal controls
- primary buttons
- choice cards

Informational elements should NOT look clickable.

Examples:

- explanations
- takeaways
- feedback
- causal diagrams
- summaries
- learned concepts

Do not give every card button-like depth.

================================================== 4. GREEN MUST BE SCARCE
==================================================

Do not make the screen green simply because Happy's brand color is green.

Green should communicate importance or state.

Good uses:

- primary CTA
- selected/correct state
- active state
- progress
- small accents
- current reveal
- important learning takeaway

Bad uses:

- every card background
- every border
- every label
- every heading
- every piece of body text
- every decorative element

Think:

GREEN = SOMETHING IMPORTANT

not:

GREEN = HAPPY

Approximate visual balance:

70–80% white / neutral / warm-neutral
10–15% dark text
5–10% cream / pale sage surfaces
small amount of stronger brand green

================================================== 5. TYPOGRAPHY HIERARCHY
==================================================

Use existing Happy typography tokens.

Do not introduce arbitrary font sizes or weights.

The hierarchy should normally be:

1. Exercise/screen title
2. Short instruction
3. Main learning object/question
4. Interactive choices
5. Feedback/explanation
6. Supporting metadata
7. Primary CTA

Dark forest/near-black should carry most important text.

Secondary explanatory text should usually use a neutral gray.

Do not make all text green.

Avoid having 5–6 different text weights on one screen.

Avoid excessive ALL CAPS.

ALL CAPS should be limited to small metadata labels such as:

THE IDEA
THE PATTERN
REMEMBER
WHY IT WORKS

Never use uppercase simply to make ordinary text feel important.

================================================== 6. VISUAL HIERARCHY
==================================================

When looking at the screen for the first 2 seconds, the eye should clearly see:

TITLE
↓
WHAT I NEED TO DO
↓
INTERACTION
↓
RESULT / INSIGHT
↓
CONTINUE

There should not be several objects competing for first priority.

Ask for every element:

"What should the user's eye see before this?"

If the answer is unclear, fix the hierarchy.

================================================== 7. SPACING
==================================================

Audit every vertical gap.

Spacing should feel systematic rather than arbitrary.

Maintain a clear rhythm between:

title → instruction
instruction → content
content → interaction
interaction → feedback
feedback → CTA

Avoid:

- huge accidental blank spaces
- cards nearly touching each other
- inconsistent left margins
- inconsistent card padding
- text floating too far from its related control
- CTA floating disconnected from the content
- content hidden behind a sticky CTA

Related elements should feel grouped.

Different sections should have visibly larger separation.

================================================== 8. CARD SYSTEM
==================================================

Do not solve every UI problem by adding another card.

Cards should only exist when grouping creates meaning.

Avoid:

card
inside card
inside another card
inside another bordered section

Prefer flatter composition when grouping is already obvious.

Use existing Happy radius tokens.

Do not invent slightly different radii for every component.

Use borders/shadows intentionally.

Avoid:

- thick outlines everywhere
- strong shadows everywhere
- simultaneous border + fill + shadow + bottom-edge on informational cards

That makes the UI heavy and artificial.

================================================== 9. TACTILE BUTTONS
==================================================

Happy uses tactile buttons inspired by the satisfying physicality seen in products like Duolingo.

Preserve this.

Primary clickable controls should feel pressable.

However:

DO NOT make every surface tactile.

Tactility should indicate ACTION.

For primary CTA:

- existing brand green
- white text
- tactile bottom edge
- comfortable height
- strong but not oversized
- clear pressed state

For selectable answers:

neutral initial state
→ tactile selected state
→ semantic feedback state if appropriate

Do not use shadows purely for decoration.

================================================== 10. PRIMARY CTA HIERARCHY
==================================================

Only ONE action should normally own the strongest filled-green treatment.

Examples:

Continue
Check
Reveal answer
Try it yourself
Finish

Secondary actions should be visually quieter.

Do not show a disabled giant CTA when no action is currently possible unless it genuinely helps the user understand what comes next.

If the user must interact with content above first, prefer making that interaction itself obvious instead of relying on:

[ DISABLED CHECK ]

================================================== 11. REMOVE VISUAL REDUNDANCY
==================================================

Audit the screen for information repeated in multiple forms.

Examples:

Selected answer

- "Correct"
- check icon
- green card
- green border
- success message

This is often excessive.

Use the minimum visual signals necessary to communicate state.

One strong signal is more premium than four weak signals.

================================================== 12. COGNITIVE LOAD
==================================================

Reduce the amount the learner needs to process simultaneously.

Do not show:

- future explanation before interaction
- final takeaway before discovery
- all hidden information simultaneously
- unnecessary helper copy
- repeated instructions
- decorative labels that add no meaning

Prefer progressive disclosure:

ACTION
→ REVEAL
→ CONNECTION
→ NEXT ACTION
→ INSIGHT

================================================== 13. INTERACTIVE REVEAL RULE
==================================================

For Happy learning exercises:

Interaction should control what the learner is allowed to know next.

Do not merely make static content tappable.

Correct pattern:

DO
↓
REVEAL
↓
UNDERSTAND
↓
DO
↓
REVEAL
↓
UPDATE MENTAL MODEL

Future content should not visually exist before it is earned.

Do not:

- render future sections at low opacity
- show disabled future buttons unnecessarily
- reveal the conclusion early
- show Continue before the learning loop is finished

================================================== 14. COLOR SEMANTICS
==================================================

Keep semantic roles consistent across Happy.

Brand green:
primary action / active learning state

Pale sage:
quiet positive/reveal/learning surface

Cream:
scenario / neutral learning content

Neutral white:
default surfaces

Gray:
secondary/de-emphasized information

Error/red:
actual incorrect/problematic state only

Do NOT use brand green, selected green, correct green and success green interchangeably unless the existing design system intentionally maps them together.

================================================== 15. SELECTION ≠ CORRECTNESS
==================================================

Never communicate:

"I selected this"

as:

"This is correct."

Selected state and correct state are separate concepts.

Before evaluation:
selected = selected treatment

After evaluation:
correct = success treatment
incorrect = error/recovery treatment

This is especially important in exercises.

================================================== 16. PREMIUM FEEL
==================================================

A premium Happy screen should feel restrained.

Premium comes from:

- excellent spacing
- typography
- alignment
- proportion
- rhythm
- consistent components
- thoughtful reveal motion
- strong copy hierarchy
- reduction of unnecessary UI
- subtle tactile feedback

Premium does NOT come from:

- more gradients
- more glow
- more shadows
- more cards
- more icons
- random illustrations
- glass effects
- excessive animation
- excessive green
- excessive decoration

================================================== 17. AVOID "AI SLOP" UI
==================================================

Explicitly look for patterns that make the interface feel AI-generated:

- every concept inside a rounded card
- every card having an icon
- random pastel backgrounds
- excessive badges/pills
- generic motivational copy
- too many section labels
- repeated explanatory text
- excessive gradients
- arbitrary shadows
- oversized radii everywhere
- different visual treatment for every section
- decorative iconography with no function
- excessive bold text
- "perfect" symmetrical layouts with no natural hierarchy

Remove these where they do not serve a purpose.

================================================== 18. ICONOGRAPHY
==================================================

Do not add icons simply to fill empty space.

Every icon must answer:

"What information or action does this icon communicate that text alone does not?"

If there is no good answer, remove it.

Use the existing icon family/style.

Avoid mixing:
outline
filled
emoji
illustration
SF Symbol-like icons

without an intentional reason.

================================================== 19. MASCOT
==================================================

Mochi/panda is a personality asset, not decoration to put everywhere.

Use the mascot when it adds:

- encouragement
- celebration
- emotional warmth
- guidance
- reward
- personality

Do not put Mochi on every screen simply because empty space exists.

Learning content should remain the hero.

================================================== 20. EMPTY SPACE
==================================================

Do not automatically "fill" empty space.

Whitespace can make Happy feel calm and premium.

But distinguish:

INTENTIONAL WHITESPACE

from:

BROKEN / UNBALANCED EMPTY SPACE.

Good whitespace creates focus.

Bad whitespace makes content appear accidentally pushed to one side of the screen.

Rebalance composition rather than adding decoration.

================================================== 21. MOBILE COMPOSITION
==================================================

Audit the entire viewport.

Check:

- safe area
- Dynamic Island clearance
- top progress placement
- horizontal margins
- bottom safe area
- sticky CTA
- scroll behavior
- content behind CTA
- keyboard states if applicable
- small iPhone layouts
- larger iPhone layouts

The CTA must never obscure educational content.

================================================== 22. PROGRESS HEADER
==================================================

Keep the existing Happy lesson header consistent:

X/back control
progress bar
step count

Do not redesign it per exercise.

It should remain visually quiet.

The exercise content should dominate attention.

================================================== 23. MICRO-ANIMATIONS
==================================================

Use restrained motion.

Recommended feel:

press
~80–120ms

reveal/expand
~180–250ms

feedback
~150–220ms

Motion should explain state changes.

Avoid:

- bouncing everything
- excessive springs
- long animations
- decorative motion during reading

Celebration is a separate system and can be more expressive.

================================================== 24. COPY DENSITY
==================================================

Reduce copy where visual structure already communicates the idea.

Prefer:

short title
short instruction
one focused interaction
one concise explanation

Avoid multiple paragraphs unless genuinely required for learning.

If a sentence can be removed without changing understanding, strongly consider removing it.

================================================== 25. ACCESSIBILITY
==================================================

Do not sacrifice accessibility for polish.

Check:

- sufficient text contrast
- readable body sizes
- touch targets
- Dynamic Type behavior where supported
- selected state not communicated only by color
- disabled state still readable
- controls visually distinguishable from content

Do not use extremely low-opacity gray just to make secondary content look "premium."

================================================== 26. EXERCISE COMPLETION STATE
==================================================

Completion should visually simplify the screen.

Do not end with:

every option
every old interaction
every feedback state
every explanation

- Continue

Compress or de-emphasize previous interaction states when appropriate.

The final state should emphasize:

WHAT I JUST LEARNED
↓
WHAT I DO NEXT

================================================== 27. DO NOT OVER-REDESIGN
==================================================

Before replacing any component ask:

"Can this become excellent through spacing, hierarchy, typography, state, and color adjustments?"

Prefer polishing the existing component.

Do not rebuild working components just to make the screen look different.

================================================== 28. PRESERVE PRODUCT BEHAVIOR
==================================================

This task is visual polish unless explicitly required otherwise.

Do NOT:

- change exercise logic
- change scoring
- change navigation
- change data models
- change lesson structure
- introduce new dependencies
- replace native components unnecessarily
- change unrelated screens
- perform broad refactors

If interaction behavior clearly causes visual/usability problems, explain the issue before changing architecture.

================================================== 29. SCREEN-SPECIFIC AUDIT
==================================================

For the screen I give you, identify every meaningful polish issue.

Number them sequentially:

1.
2.
3.
4. ...

For each issue explain briefly:

ISSUE:
What currently feels wrong.

WHY:
Why it harms hierarchy, usability, cognitive load, consistency, or premium feel.

FIX:
Exactly what should change.

Do not give me multiple design choices.

You are the senior designer.

Decide the strongest solution and recommend ONE solution.

================================================== 30. PRIORITIZE HIGH-IMPACT CHANGES
==================================================

Do not create 30 meaningless micro-adjustments just because this prompt contains many principles.

Prioritize changes that materially improve:

1. visual hierarchy
2. cognitive load
3. design-system consistency
4. interaction clarity
5. premium feel
6. typography
7. spacing
8. color usage
9. component consistency
10. polish

================================================== 31. IMPLEMENTATION BEHAVIOR
==================================================

Before editing:

- inspect the screen implementation
- inspect reusable Happy components
- inspect theme/design tokens
- understand existing interaction states
- reuse current components where possible

Then implement the approved visual direction using the existing design system.

Do not hardcode arbitrary one-off values when reusable tokens already exist.

================================================== 32. FINAL SELF-AUDIT
==================================================

After implementation, inspect every screen state:

initial
selected
correct
incorrect
revealed
completed
disabled
scrolling
small screen

Then ask:

Does this look like the same Happy app?

Is the eye immediately drawn to the right thing?

Is anything unnecessarily green?

Is anything unnecessarily inside a card?

Does anything look AI-generated?

Does every shadow have a reason?

Does every border have a reason?

Does every icon have a reason?

Does every label have a reason?

Does every piece of text earn its space?

Are clickable things tactile?

Are informational things visually quieter?

Is the screen cognitively lighter than before?

Does the screen feel calm?

Does it feel premium?

Does it feel crafted rather than generated?

================================================== 33. FINAL STANDARD
==================================================

The target is NOT:

"Looks cleaner than before."

The target is:

"This could ship in a polished paid consumer iOS app."

The interface should feel as if experienced designers repeatedly removed, refined, aligned, and simplified elements until nothing feels accidental.

OUTPUT FORMAT

Give recommendations as ONE sequential numbered audit.

No multiple alternatives.
No A/B/C options.
No generic design theory.
No acceptance checkboxes unless requested.

Make the recommendation specific enough that an agentic coding system can implement it directly.

When the implementation is complete, summarize:

WHAT CHANGED
WHY IT IS BETTER
ANYTHING STILL VISUALLY WEAK

Keep that summary short.
