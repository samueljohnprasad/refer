# CBT exercises: shared direction

Four single-file prototypes share one shell: `thought-reframing.html`, `fear-ladder.html`, `behavioral-activation.html`, `abc-analysis.html`.
Design system: Happy (Nunito, sage on white, rim buttons, tactility only on primary controls). The weather cloud is the soul: heavy and raining when a thought or fear feels true, sun and a smile as it eases. `--heat-f` on `#app` drives it live.

## Concept: a chat with the cloud

Brief from the user (2026-10-17): the flows read like a syllabus and a form. Make them friendly, engaging, interactive, familiar.

The cloud asks, you answer. Every screen is one turn of a conversation, not a field on a form.

| Element | Was | Now |
|---|---|---|
| Intro | Big title, lead, duration, numbered list of steps | Exercise name and duration as a small line, the cloud, one speech bubble inviting you in |
| Question | `h1` plus grey subtitle | `.ask`: a small live cloud beside a tinted bubble holding the question |
| Earlier answer | "What happened" label with the quoted text | `.me`: your own bubble, ink on the right, like a sent message |
| Free text | Bordered textarea, four rows | `.paper`: no box, large bold type on a hairline, the caret is the invitation |
| Examples | "Need an example?" accordion with scenario labels | `.qrs`: quick-reply bubbles in a horizontal row, tap to send |
| Test the belief (ABC) | Three stacked questions with pill answers | One question at a time, two big cards, three dots, auto-advance after a tap |
| Summary | "Your ABC", "Thought reframed" headings | The cloud says the outcome in a bubble, then the record |

The hub (`exercises.html`, see `EXERCISES.md`) is the same turn: the cloud asks what is weighing on you, four quick replies in feeling words route to one exercise, the full list sits beneath.

Signature: on every selection or quick reply the cloud nods (one 500 ms spring bob) and the phone buzzes once. Haptics only on selection, never on typing.
When a larger illustration already owns the screen (the gauge sky, the balance, the ladder, the before and after pair) the bubble stands alone without the avatar, so there is never two clouds.

## Mobbin research (iOS)

| Pattern | Seen in | Used for |
|---|---|---|
| Guided exercise as a chat: bot bubble, user bubble, quick-reply chips | Wysa, Liven, Pi, WhatsApp AI chats | The whole layer: `.ask`, `.me`, `.qr` |
| A character carries the feeling and reacts | Finch, Wysa, Ahead, Tolan, Headway | The cloud as the one asking, the nod on selection |
| One question, two big tappable answers | Noom, Me+, Deepstash, How We Feel | ABC test-the-belief cards |
| Big question, bare writing surface | pillowtalk, Pi, Paired | `.paper` text entry |
| Warm completion in the character's voice, with a small weather illustration | Noom breathing, stoic, Insight Timer | Summary bubble over the before and after pair |

## Not verified

No render in this sandbox. Unchecked: avatar cloud at 84 px (face legibility), bubble widths at 390 px, quick-reply row overflow, `.paper` focus state on iOS, dots row, dark mode.
