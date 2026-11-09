# Phase 4 — Non-mascot connection systems

Pass: 2
Inputs: docs/research/soul/01-psychology.md (PASS), docs/research/soul/02-teardown.md (PASS), docs/research/soul/03-character.md (Phase 3 running in parallel; Presence rules, Voice and Struggle and absence read twice, at start and at reconciliation), .agents/skills/app-soul-design/SKILL.md, phases/04-connection-systems.md, all four checklists, references/evidence-template.md, src/locales/en/{home,journal,settings,onboarding,exercises,common}.json plus ar/de/zh home.json, src/screens/JournalCalendarScreen/JournalCalendarScreen.tsx, src/components/Streak/StreakDisplay.tsx and StreakCelebrationCopy.tsx, src/hooks/useSoundEffects.ts, src/store/soundStore.ts, haptic call inventory across src/, .agents/skills/rossark-motion-skill/SKILL.md §1 and §7, .agents/skills/microinteractions/SKILL.md, assets/images/panda/MOTION.md

## Summary
Decisions (every system works with Happi absent; Happi is an optional layer on top):
1. One voice, four tone modes with hard caps: everyday and struggling copy ≤12 words per sentence at grade ≤6, instructional copy ≤20 words at grade ≤8; no "!" outside the Day 7/15 modal (F1, F2).
2. Memory recalls only what the user saved on purpose (coping cards, pinned entries, chosen feeling words), for 30 days, always with source and date and a "Why am I seeing this?" link; recall is opt-in (F3, F4).
3. Rituals: an opening of ≤10 s, a closing of ≤20 s, and a 60 s bad-day path that is complete with one word (F5, F6).
4. Progress shows "days practised this month" and total entry days; XP, levels, coins and the rewards shop leave every therapeutic action; the streak modal fires only on total entry day 7 and 15 (F7, F8).
5. Haptics follow a 10-row map; routine saves get one Soft impact, Success is reserved for Day 7/15; sound defaults OFF (F9, F10, F11).
6. Surprise is capped at ≤1 moment per 7 days per user, never in days 1–5 and never on a low-mood day (F12).
7. Empty, error and return states state what is safe and offer one action; no character on errors; return copy names no gap (F13, F14, F15).
8. A crisis path exists on every free-text surface in ≤2 taps, without Happi, sound, haptics or paywall (F16).
9. Personalization runs on a 4-step consent ladder; nothing is inferred from usage time, location or typing (F17).

## System: Voice and tone

### F1. One voice with tone set by the reader's state keeps copy calm under stress
- Claim: Style guides used at scale hold voice constant and change tone with the reader's state, and NHS content caps sentences at 20 words for a reading age of 9 to 11.
- Evidence: [S6] ("Consider the reader's state of mind"; "It's always more important to be clear than entertaining."), [S7] ("short sentences of up to 20 words"; "reading age of 9 to 11 years old")
- Mechanism: A stressed reader has less working memory, so shorter sentences and no jokes lower the cost of understanding; a constant voice keeps the app recognizable when the tone drops.
- So what for Happy: Four tone modes, each with caps (table below). Happi bubbles follow Phase 3 (≤12 words, ≤1 bubble per screen, ≤3 per session) and are a subset of the everyday and struggling modes; app copy carries every instruction. Grade targets are checked, not assumed: mHealth app descriptions sit at grade 11–15 with ~6% at grade 3–7 [S16], so every new string runs through a Flesch-Kincaid check before merge; the 19 phrase-bank "Do" strings measured grade 0.2 overall (max 7.2, "Practice helps many people. Effects differ.") and the crisis line measured 7.2 (script in $TMPDIR, standard FK formula). Translators receive a meaning gloss for idioms ("That's real" = "that counts"; "Pick up" = "continue") so ar and zh do not translate them literally (ED6.2).

| Mode | When | Max words per sentence | Max sentences per block | Grade target (Flesch-Kincaid) | Punctuation |
|---|---|---|---|---|---|
| Everyday | home, check-in, completion | 12 | 2 | ≤6 | no "!" |
| Struggling | after a low feeling word, return after absence, errors | 10 | 2 | ≤5 | no "!", no questions that ask "why" |
| Celebrating | Day 7/15 modal only | 12 | 2 | ≤6 | ≤1 "!" per 7 days (Phase 3 cap) |
| Instructional-clinical | CBT steps, crisis, privacy, delete | 20 | 3 | ≤8 | no "!" |

Banned words (all locales, outside quotes of the user): "amazing", "superstar", "legend", "yay", "awesome", "crush", "rewired", "should", "must", "failed" (about the user), "streak at risk", "don't lose", "unlock" (for the user's own data), "cure", "fix".

### F2. Current copy breaks 9 Phase 1–2 rules in strings shipped today
- Claim: The repo's English strings contain XP on journaling, a level-up emoji modal, should-style pressure and 2 unsupported efficacy claims.
- Evidence: [S17] (`journal.capture.dailyReflectionXP` "Daily Reflection • +10 XP"; `common.xp.levelUp` "Level up! 🎉 … Keep up the great work!"; `common.insights.nudges.consistency` "Consistency is the #1 predictor of progress."; `onboarding.notification.consistency_proof` "Members with reminders are 3x more consistent"; `settings.notifications.streaksDescription` "Get notified when your journal streak is at risk"; `onboarding.pact_text` "I commit to showing up for myself, even on the days I don't feel like it.")
- Mechanism: XP on journaling is an engagement-contingent reward (P1-F6, d = -0.40); "at risk" is loss framing (P1-F12); the "3x" and "#1 predictor" lines are efficacy claims with no cited trial (AE1.7).
- So what for Happy: Each string is replaced by the phrase bank row that names it; the 7 ar, de, es, fr, it, pt, zh files are retranslated from the new English, not patched (ar today reads "بدأت سلسلة جديدة!" with the same "!").

### Phrase bank

| Do | Don't | Why |
|---|---|---|
| "Saved. It's yours." | "Journal saved successfully" | Ownership in 3 words beats a system status (P1-F9). |
| "You wrote: 'I handled it.'" | "Great job!" | Quoting ≤8 of the user's words shows responsiveness (P1-F18, P2-F1). |
| "That sounds hard." then "Want to try one small step, or just save this?" | "Ask if this feeling is serving you." | Validation before redirection; "heavy" dropped as an idiom that does not translate (P1-F11, P2-F7, Phase 3 Voice). |
| "Good to see you." | "We missed you!" | No claimed inner state, no gap (P1-F1, P2-F2). |
| "Pick up wherever you like." | "It has been a few days · ready to pick back up?" | Names no duration (P2-F2). |
| "Seven days of practice. That's real." | "Week Warrior! Maintain a 7-day streak" | Low arousal, counts practice not a chain (P1-F22, P2-F5). |
| "4 days with Happy this month." | "You're on a 5-day streak. A short exercise today keeps the momentum going" | Window count cannot break (P1-F12, P1-F13). |
| "You named the thought and tested it." | "Daily Reflection • +10 XP" | Specific verbal feedback, not points (P1-F6). |
| "A miss just gives you something to revisit." | "Some items are in the wrong position. Try again!" | Already in repo; errors without blame (P1-F15). |
| "Resting counts too." | "Get notified when your journal streak is at risk" | Rest is permitted, no loss frame (P2-F6). |
| "One reminder, at a time you pick. You can change it anytime." | "Members with reminders are 3x more consistent" | Autonomy, no unsupported claim (P1-F-dose8, AE1.7). |
| "Practice helps many people. Effects differ." | "Consistency is the #1 predictor of progress." | Honest claim strength (AE1.7). |
| "You're offline. Your notes are saved on this phone." | "Taking a momentary pause" | Says what is safe, in plain words (F14). |
| "We couldn't save that. Your words are still here." | "Failed to save journal" | No "failed" near the user; data-loss reassurance (F14). |
| "Done. You can turn it back on in Settings." | "Are you sure? You'll lose your progress." | Off-switch with no penalty copy (AE1.4). |
| "Is there someone you could tell about this?" | "I'm always here for you." | Points outward, no exclusivity (P1-F-dose2, AE1.5). |
| "Patterns get clearer with more entries. Here is what 2 show." | "Unlock to see what patterns a therapist would notice" | No gated data, no therapist claim (P2-F13, AE1.3). |
| "First one done." | "That's real dedication to your mental health." | Names the act, no moral grade (AP4.3). |
| "Help is one tap away." | "Sorry to hear that 😢" | Crisis copy is plain, idiom-free, no emoji (F16, ED6.2). |

## System: Memory and continuity

### F3. Overt recall pairs each item with its date and its prompt; covert summaries hide the source
- Claim: 5 Minute Journal and Liven show past entries with date and original prompt label, while Dot shows AI-written "Chronicles" with inferred links and only "Chronicles are updated every night" as provenance.
- Evidence: https://mobbin.com/screens/e2d0c7d5-d70d-4b91-bbd0-340c5fcdabbd (5 Minute Journal "WHAT I WAS GRATEFUL FOR / My family who remembers me", dated SUN 31) | https://mobbin.com/screens/8d10063c-ceff-4668-a314-0714cded6d09 (Liven dated timeline with prompt titles) | https://mobbin.com/screens/6b8f4da6-541b-4d57-b9bf-ce108890032c (Dot inferred summary with underlined entities)
- Mechanism: Covert personalization raises felt vulnerability while overt, user-sourced recall reads as responsiveness (P1-F19, P1-F18).
- So what for Happy: Home recall card shows one item: the quote (≤8 words), "From your note on 12 Oct", and a "Why am I seeing this?" link that opens the source entry with "You saved this as a coping card. Turn off recall." No AI-written summary appears on home. Accessibility: the link has a ≥44×44 pt hit area (AE2.2); the card wraps to AX5 Dynamic Type with no truncation of the quote (AE2.3); VoiceOver reads "You wrote: [quote]. From your note on 12 October." and any Happi art beside it is hidden from VoiceOver (AE2.6).

### F4. Recall must stay inside a 30-day window of items the user chose to keep
- Claim: Recall limited to user-saved items for 30 days avoids resurfacing distress text while still giving a return visit one remembered thing.
- Evidence: [S17] (repo already has `copingCards` and `bookmarks` "Pinned Notes"), inference: P1-F20 says control keeps recall supportive and P1-F21 puts retention collapse inside 30 days, so a 30-day window covers the period where a recall can matter, and saved/pinned items are the only ones the user marked as worth seeing again.
- Mechanism: An item the user saved carries their consent to see it again; a raw entry may be the worst day they wrote down.
- So what for Happy: Recall sources, in order: a non-low feeling word picked in the last 7 days, with its day ("You picked 'calm' on Tuesday."), last coping card, last pinned note, a theme only if the user tagged it ≥3 times. Window 30 days; older items appear only in the journal list. Items tagged with a low feeling word are never recalled on home unless the user saved them as a coping card (Phase 3 absence zone 9). Settings > Memory lists every recallable item with Edit, Forget and "Forget all"; Forget removes it from recall without deleting the entry. Recall never appears in pushes, widgets or lock screen (AE1.6, AP6.2).

## System: Ritual design

### F5. Completion screens that echo the user's words close the loop in one screen
- Claim: Life Reset's completion screen shows the user's own entry text under the completion line, and Finch confirms "Your emotion has been saved in your history.", while 5 Minute Journal's completion adds confetti and "1 day streak" on day 1.
- Evidence: https://mobbin.com/screens/6422bb3f-e3ba-48d1-8b14-5f9d4c166e70 (Life Reset, user text in card) | https://mobbin.com/screens/ad875969-314e-4550-bc76-5ea7d66a1949 (Finch "Your emotion has been saved in your history.") | https://mobbin.com/screens/65a7da91-3768-407f-8570-29875b327710 (5 Minute Journal confetti + "1 day streak")
- Mechanism: Seeing one's own completed work raises its value only when the work is complete (P1-F9); a saved-state line answers "is it safe?" before anything else.
- So what for Happy: Closing ritual ≤20 s: line 1 "Saved. It's yours." (app copy; when Happi is present Happi says it and the app line becomes the date stamp "Today, 9:14", so the words are not duplicated), line 2 the user's quote (≤8 words), one optional next step ("Breathe for 30 s" or "Done"). No confetti, no streak number on routine closes.

### F6. A ritual must be finishable in 60 s with one word on a bad day
- Claim: Rituals regulate emotion through a fixed sequence (P1-F14), and a missed day does not harm habit formation (P1-F13), so the minimum ritual can be a single feeling word.
- Evidence: inference: P1-F14 and P1-F13 together mean repetition matters more than size; Finch sizes goals at "Get out of bed" (P2 Finch 99094ecd) and Calm opens with one instruction (P2 Calm flow 38549b00), so a 1-word check-in fits the evidence and the precedent.
- Mechanism: A ritual that fits the worst day keeps the repetition intact on the days most likely to break it.
- So what for Happy: Opening ≤10 s: time-of-day greeting + "Which word fits right now?" + 12-word grid; "Skip" visible. After the word, the next line reuses it ("Tired. Thanks for naming it.") so the user's choice is reflected within one screen (ED1.1). Bad-day path: word → "Save" → closing line, 3 taps, ≤60 s, counted as a practice day. Daily rhythm: 1 user-picked reminder slot (morning, midday or evening), off until chosen; after 3 ignored reminders in a row, reminders pause and the next open asks "Keep reminders?" with Keep / Turn off (AP2.5, P2-F12). Once per 7 days of use, the closing ritual swaps its optional step for an outward line: "Is there someone you could tell about this?" or "A short walk counts too." (ED2.2, P1-F-dose2).

## System: Progress as growth

### F7. The home mood logger opens the streak modal after every log and the modal adds a review ask
- Claim: `handleEmotionLogged` sets `showStreakModal(true)` on every mood log, and `StreakDisplay` calls `requestReview()` on close at streak 3, 7 and 15.
- Evidence: [S18] (JournalCalendarScreen.tsx lines 110–116; StreakDisplay.tsx `handleClose`)
- Mechanism: A modal after every routine log turns acknowledgement into noise (rossark §7 frequency table [S19]) and the review ask exploits reciprocity at a high (P1-F-dose4, P2-F9).
- So what for Happy: The modal opens only on total entry day 7 and 15, once each, never after a low feeling word; `requestReview` moves to Settings after ≥15 entry days (P2-F9). Routine logs get the closing line only.

### F8. Counts of what the user did read as growth; chains read as debt
- Claim: Stoic's completion shows "79 WORDS" and "00:46 TIME" with no chain, while 5 Minute Journal puts a "1 day streak" counter on day 1.
- Evidence: https://mobbin.com/screens/f872477c-61a4-42cd-93bf-9e85af0e0814 (Stoic "Good job!", words and time) | https://mobbin.com/screens/65a7da91-3768-407f-8570-29875b327710 (5 Minute Journal "1 day streak")
- Mechanism: A logged chain becomes a goal whose break is felt as failure (P1-F12); a count of produced work only grows.
- So what for Happy: Header shows "days practised this month" (leaf icon, not fire); Insights shows total entry days and words written. Rest via "Take a break" (1–14 days, P2-F6). Return after a gap shows the same counter, unchanged, never "0". XP, levels ("Zen Master"), coins and the Rewards Shop are removed from journaling, mood logging and exercises (P1-F6); "Hide counter" sits on the first counter surface (P2-F4).

## System: Micro-interactions, haptics, sound, motion

### F9. Apple asks for consistent, sparing, optional haptics; the app uses Success 40 times
- Claim: Apple's guidance says to use system patterns by their meaning, avoid overuse and make haptics optional, while the repo calls `notificationAsync(Success)` at 40 sites and `impactAsync(Heavy)` at 5.
- Evidence: [S1] ("Avoid overusing haptics."; "Make haptics optional."; "Use haptics consistently"), [S21] (call counts: 169 selection, 40 Success, 38 Medium, 9 Light, 6 Warning, 5 Heavy, 1 Error)
- Mechanism: A pattern heard 40 ways means nothing; a learned cause-effect link needs one meaning per pattern [S1].
- So what for Happy: The haptic map below is the only allowed set; Success appears once (Day 7/15); Heavy and Medium are removed; an in-app "Haptics" toggle sits next to "Sounds" in Settings (AE2.8). Strength is set by style, not by a number: UIKit accepts an intensity from 0.0 to 1.0 [S4], but expo-haptics exposes only the 5 styles [S5], so "Soft" is the quietest available; the system already suppresses haptics in Low Power Mode or when the user turned them off [S5].

### Haptic map

| Event | Generator (expo-haptics) | Style / intensity | Sound default | Motion (ms, curve) | Reduced motion |
|---|---|---|---|---|---|
| Feeling-word chip select | `selectionAsync()` | system selection tick | off | fill 150 ms ease-out cubic; press scale 0.97 for 120 ms | colour + check icon swap, no scale |
| Primary button press | none | — | off | scale 0.97, 120 ms ease-out | pressed colour only |
| Entry or thought catch saved | `impactAsync(Soft)` | Soft (style sets strength; expo has no intensity argument [S5]) | off; if on, page-turn ≤300 ms | quote card rises 8 pt + fades in, 400 ms ease-out cubic | final frame, opacity 200 ms |
| Breath cue phase change (opt-in) | `impactAsync(Soft)` once per 4 s phase | Soft | off; if on, tone ≤200 ms | circle scale 0.9→1.0 over 4000 ms ease-in-out | static circle + "Breathe in / Breathe out" text with 4 s counter |
| Day 7/15 milestone | `notificationAsync(Success)` once | Success | off; if on, chime ≤600 ms | one beat 600–900 ms ease-out, no confetti | final frame |
| Final "Delete all data" confirm | `notificationAsync(Warning)` | Warning | off | sheet 300 ms ease-out | sheet appears without slide |
| Offline, sync or save error | none | — | none | status chip 200 ms ease-out | chip appears without motion |
| Crisis sheet | none | — | none, not configurable | none: appears at once in every mode (Phase 3: no animation on crisis) | same |
| Reminder toggle | system switch only | system | off | system | system |
| Return after absence | none | — | none | greeting fades in 300 ms | text present at load |

### F10. Sound is on by default in code, which the checklists forbid
- Claim: `soundMutedAtom` defaults to `false` and `loadSoundMuted()` returns `false` when nothing is stored, so the celebration chime plays for every new user.
- Evidence: [S20] (soundStore.ts line 20; useSoundEffects.ts `celebrationChime`, keys `chestOpen`, `chestClaim`)
- Mechanism: Unrequested sound in a private, often public-place activity exposes the user and adds arousal (P1-F22); sound must never carry meaning alone (AE2.8).
- So what for Happy: Default muted = true; Settings "Sounds" off by default; sounds never play when iOS silent switch is on; `chestOpen`/`chestClaim` keys are deleted with the chest mechanic (P1-F-dose1).

### F11. Motion should be brief on frequent paths and removable on request
- Claim: Apple says to avoid motion on frequent interactions and make motion optional, WCAG 2.3.3 asks that interaction-triggered motion can be disabled, and React Native exposes `isReduceMotionEnabled()` to read that setting.
- Evidence: [S2] ("generally avoid adding motion to UI interactions that occur frequently"; "Make motion optional."), [S8], [S10], [S19]
- Mechanism: Repeated motion on a path used daily costs attention every time and can cause vestibular discomfort [S8].
- So what for Happy: Durations from the haptic map; entering moves ease-out, never ease-in; no spring overshoot (the streak CTA's `withSpring(mass 0.6, stiffness 280, damping 20)` in StreakCelebrationCopy.tsx [S18] becomes 300 ms ease-out cubic); reduced motion reads `reduceMotionChanged` live and shows final frames. Nothing flashes more than 3 times per second [S9]; seasonal snow or leaf particles drift at ≤1 cycle per 2 s and are off under reduced motion (AE2.5).

## System: Surprise and delight

### F12. Surprise without currency is rare in competitors; Happy caps it at 1 per 7 days
- Claim: Bears Gratitude rewards each entry with artwork and "You did it! ☺️ Every entry is an important step forward.", and Duolingo hooks widget installs to daily variant art, while Phase 2 found no app strong on surprise without a currency except Tolan's single sketch.
- Evidence: https://mobbin.com/screens/c2910a0a-e822-4946-a0e0-e7adf4be9599 (Bears Gratitude) | https://mobbin.com/screens/a238f3ab-2e49-420a-89b6-0c22d6865c31 (Duolingo "unlock new Duos each day") | inference: P2 matrix reading (surprise strong only with currency or variable reward) plus P1-F24 (unpredictable reward sustains seeking) means surprise must be rare and not contingent on an action.
- Mechanism: Rare, non-contingent warmth adds positive affect without teaching the user to open the app for a payout (P1-F24, P1-F-dose1).
- So what for Happy: Catalogue below. Global caps: ≤1 moment per 7 days per user; none in days 1–5 (P1-F3); none on a day the user chose a low feeling word; none in a session that opened the crisis sheet; a type dismissed 2 times is retired for that user.

| # | Moment | Trigger | Cap | Decay plan |
|---|---|---|---|---|
| 1 | Seasonal home scene (leaf colour, snow) | calendar | ≤4 per year, each ≤14 days | same 4 scenes yearly; off with reduced motion |
| 2 | "One month ago you saved:" coping-card recall | 30 days after a card was saved | ≤1 per 30 days | only cards; stops after 6 shown per card set |
| 3 | First coping card turns over to show the user's words | first save | once per lifetime | none needed |
| 4 | Day 7 and Day 15 total-day note | 7th and 15th entry day | once each | none after Day 15 |
| 5 | Later practice notes ("30 days of practice") | 30, 60, 100 entry days | ≤1 per 30 days | ends at 100 |
| 6 | Hand-lettered note on Insights: "Your words, your pace." | 20th entry | once | none |
| 7 | Monthly recap card (words written, feeling words used, no scores) | 1st of month, opt-in | 1 per month | off after 2 unopened |
| 8 | Happi holds a leaf on home (if Happi present) | random day after day 6 | ≤1 per 14 days | 3 variants then stop |

## System: Empty, error, absence/return states

### F13. Calm empty states give one sentence and one action; busy ones add an illustration task
- Claim: Apple Journal ("No Entries / To add an entry, tap the plus button."), Insight Timer ("No entries") and Liven ("Begin where you are") use one line and one action, while QUITTR fills the screen with a 6-object illustration.
- Evidence: https://mobbin.com/screens/edd2d9ad-9dac-4851-a078-f6b1b79abf03 (Journal) | https://mobbin.com/screens/6bc16c51-3854-4127-be0c-e2a2e205ed23 (Insight Timer) | https://mobbin.com/screens/9123635c-e543-4451-a375-4b4b7ded976a (Liven) | https://mobbin.com/screens/ece1ec0d-428f-46f8-ac56-a8b99b26f83b (QUITTR)
- Mechanism: An empty screen is the first test of whether starting is easy; one line and one button cut the decision to one tap.
- So what for Happy: Keep the current `journal.empty.description` "Private by default. Just start where you are."; title "What's on your mind?"; one primary "Write" + secondary "Record"; Happi may sit above (Phase 3 allows empty states) but the copy stands alone without it.

### F14. Offline screens that blame or joke raise stakes; the calm pattern says what is safe
- Claim: CHOPT shows a frowning tomato with "YOU ARE OFFLINE", Fanatics jokes "Where's the internet?", while GoPay and Qantas give a plain line plus "Retry" and Qantas adds an error code.
- Evidence: https://mobbin.com/screens/ebc40138-872c-4dab-b77c-1abed601374e (CHOPT) | https://mobbin.com/screens/211a7715-c3dc-46cc-af99-467d6575c34d (Fanatics) | https://mobbin.com/screens/95483b32-a4d7-4025-b6e7-64220245eff5 (GoPay) | https://mobbin.com/screens/18f77caf-19d5-4199-98b4-a36f34096d23 (Qantas "[IN01]")
- Mechanism: A sad character mirrors distress (P1-F4) and a joke is "forced humor" when the reader is stuck [S6]; stating that data is safe answers the anxious user's first question.
- So what for Happy: Offline chip: "You're offline. Your notes are saved on this phone." Sync failure chip: "Not synced yet. It will sync when you're back online." Local save failure: "We couldn't save that. Your words are still here." with text kept in the field and "Try again". No character, no haptic, no modal; auto-retry every 30 s while foregrounded.

### F15. Return screens split into "missed you" guilt and choice-led restarts
- Claim: Lovi greets returners with a pet name and "You've been missed!", Runna names the gap ("You've been inactive a while") but offers 3 choices, and Lifesum shows a neutral "Welcome back!" while loading.
- Evidence: https://mobbin.com/screens/e5c1876c-e70a-43f7-86c4-ef926523e5e8 (Lovi) | https://mobbin.com/screens/0116015c-bb3b-46fd-a2f6-3194ad72193a (Runna) | https://mobbin.com/screens/a5cb4004-2ddb-46db-b728-10ead9ca5700 (Lifesum) | [S12]
- Mechanism: Temporal landmarks let people "relegate past imperfections to a previous period" [S12]; naming the gap does the opposite and invites self-blame (P1-F12, P1-F15). [S12] is a transfer: its field data are diet searches, gym visits and goal sign-ups, not a clinical sample (RQ3.4), so Happy borrows only the landmark wording, not any claim about mood.
- So what for Happy: 3-day absence: home loads as usual with "Good to see you." and one recall item (if opted in) or, if recall is off, "Last time you practised: Box breathing." (exercise name only, never a feeling word or entry text, ED4.1); no push beyond the user's own reminder. 30-day absence: same greeting, plus two equal buttons "Pick up where you left off" and "Start with a short check-in" (Phase 3), and a text link "Change reminders"; no counts, no "inactive", no re-onboarding quiz. If the return day is a Monday or the 1st, the greeting may add "New week." or "New month." but never the gap length.

### F16. Crisis resources must be correct, local and character-free
- Claim: 6 of 69 suicide-prevention and depression apps (9%) listed an erroneous crisis number, and Bloom on Mobbin still shows the retired 1-800-273-TALK line.
- Evidence: [S13] (Martinengo et al. 2019, 69 apps, systematic assessment) | https://mobbin.com/screens/9a7c29f6-faae-40c9-9a16-bc339fa12e8f (Bloom "1-800-273-TALK") | https://mobbin.com/screens/8594e649-38c0-4705-b9c7-9355952001ff (How We Feel country picker, "Call 988") | https://mobbin.com/screens/aa6b489c-b86c-4492-b477-f3ee9f295810 (Alan "Help is available", "Alan is not suited for crisis situations") | [S14] | [S15]
- Mechanism: A wrong number at the worst moment is the single highest-harm failure an app can ship; a plain list with call buttons removes every step between need and help.
- So what for Happy: No crisis surface exists in the repo today [S17]. Add "Get help now" in the journal menu and Settings (≤2 taps from home). On-device keyword match in any free-text field opens a non-blocking sheet: "If you're thinking about hurting yourself, you deserve support now." + locale hotlines (US: 988 call or text [S14]; elsewhere from Find A Helpline's verified directory [S15]) + "Grounding exercise" + "Keep writing" + scope line "Happy isn't an emergency service. If you might act on these thoughts, call now." (AE1.3; wording shared with Phase 3). The list of keywords per locale is owned by Phase 6. For the rest of that session Happi stays unmounted and no surprise, milestone or review prompt can fire. No Happi, sound, haptic, paywall or analytics event containing text. Numbers re-verified every 90 days with a named owner. [S13] is a 2019 snapshot of 69 apps; the 9% error rate is a floor for risk, not a forecast for Happy.

## System: Personalization that feels like care

### F17. Personalizing from usage patterns breaks the overt-data rule the app needs
- Claim: Settings copy states "We use AI to find the best time to send you notifications based on your usage patterns.", which personalizes from data the user did not knowingly give.
- Evidence: [S17] (`settings.notifications.limit`), [S3] ("You need to get permission before sending any notification."; "Don't use notifications to send marketing or promotional content unless people explicitly agree")
- Mechanism: Covert collection raises felt vulnerability (P1-F19) and AP6.3 forbids inference from data not knowingly given.
- So what for Happy: Consent ladder below; remove usage-time inference; reminders fire only at the slot the user picked.

| Step | What is used | Asked or inferred | Default | Control |
|---|---|---|---|---|
| 0 | entries, chosen words | given by typing | on | delete per entry |
| 1 | name, goal, reminder slot | asked in onboarding, each skippable | off until set | Settings, one tap |
| 2 | recall of saved cards and pins on home | asked after first coping card | off | Settings > Memory, Forget |
| 3 | monthly recap, user-tagged themes | asked on first recap | off | toggle in recap card |

Red lines: no location, contacts, typing speed or time-of-use inference; no mood, feeling word or entry text in notifications, widgets or lock screen; no "we noticed you were sad at 2am"; no AI "Core belief detected" label on home; recall never shown to anyone but the user.

## Harm guards (AE1.1)

| System | Harmful extreme for an anxious or depressed user | Guard |
|---|---|---|
| Voice | cheerful copy on a low day reads as dismissal (AP4.2) | struggling mode triggers on any low feeling word; no "!" and validation first (F1) |
| Memory | recall resurfaces the worst entry or feels watched (AP6.1) | only saved or pinned items, 30-day window, source + date, Forget (F3, F4) |
| Ritual | ritual becomes a standard to fail (P1-F-dose7) | 1-word path counts; Skip with no penalty copy; no ritual counter (F6) |
| Progress | counter becomes a debt (P1-F12) | window count that never shows 0; Hide counter; no XP or coins (F8) |
| Haptics, sound, motion | sensory load during anxiety; exposure in public | Soft only on routine saves; sound OFF; reduced motion honoured live (F9–F11) |
| Surprise | variable reward drives checking (P1-F-dose1) | ≤1 per 7 days, non-contingent, never on low days (F12) |
| Empty, error, return | error or return copy implies blame or data loss | state what is safe; name no gap; no character on errors (F13–F15) |
| Crisis | wrong number, delay, or a mascot on the worst screen | verified locale numbers every 90 days; ≤2 taps; no Happi, sound, haptic, paywall (F16) |
| Personalization | inference feels like surveillance (AP6.3) | 4-step consent ladder; nothing inferred from usage, location or typing (F17) |

Audience: adult users (18+), carried from Phase 1; crisis copy is written for an adult reader in distress, grade ≤8.

## Contradictions
- Apple says to use system haptic patterns by their documented meaning, and Success means a task succeeded [S1], so every save is a Success; yet P1-F-dose9 caps routine acknowledgement at ≤600 ms and low arousal. Decision: routine saves use a generic Soft impact (allowed by [S1]: "use a generic pattern"), Success is kept for Day 7/15 only.
- Pushes raised next-24 h engagement by 3.9% (8.7% on weekends) in a 1,255-user, 89-day micro-randomized trial in a workplace well-being app (a single trial, non-clinical population) [S11], yet P1-F-dose8 and AP2.5 cap system-timed pushes. Decision: one user-scheduled reminder only; the 3.9% lift is small, from a workplace well-being app, and does not justify system-timed nudges for anxious users.
- NHS allows 20 words per sentence [S7], while Phase 3 caps Happi at 12 words. Decision: 12 words for everyday and struggling copy, 20 only for instructional-clinical copy.
- The fresh start effect favours naming time landmarks on return [S12], while P2-F2 forbids naming the duration away. Decision: name the landmark ("New week."), never the gap.
- Phase 3 lists "Saved. It's yours." as a Happi bubble, while this phase needs the same acknowledgement on every save when Happi is hidden by the user's "Show Happi" toggle or by an absence zone. Decision: the line is app copy by default; when Happi is mounted Happi says it and the app line becomes the date stamp, so the user never reads it twice (F5).

## Rejected ideas
- AI-chosen notification timing from usage patterns — rejected because it infers from data not knowingly given (AP6.3, F17).
- "On this day" resurfacing of any past entry — rejected because it can resurface a distress entry unasked; only saved cards recall (F4).
- A sad character on offline or error screens (CHOPT pattern) — rejected because it mirrors distress (P1-F4, F14).
- Keeping XP and the Rewards Shop for exercises only — rejected because points on CBT practice are still engagement-contingent rewards (P1-F6).
- A full-screen crisis modal that blocks writing — rejected because removing the user's words can feel punitive; the sheet is non-blocking with "Keep writing".

## Critique (pass 1)
Spot-checked by reopening in this run: [S1] (HIG JSON re-parsed: "Make haptics optional", "Avoid overusing" and "generic pattern" all present), [S11] (PubMed record: n = 1,255, 89 days, RR 1.039 and weekend 8.7% match F-text), https://mobbin.com/screens/9a7c29f6-faae-40c9-9a16-bc339fa12e8f (image viewed: Bloom "Get help" with "1-800-273-TALK" button, matches F16).
- [FAIL] RQ1.2 [S4], [S9] and [S16] were listed in Sources but never cited in the body.
- [FAIL] RQ3.3 Pass 1 gave no study limits for [S11] (single workplace trial) or [S13] (2019 snapshot of 69 apps).
- [FAIL] RQ3.4 [S12] (diet searches, gym visits) and [S11] (workplace well-being) were applied to mental-health return and reminder design without a transfer flag.
- [FAIL] AE1.1 Harmful extremes were named for memory and surprise only; voice, ritual, progress, sensory channels, errors, crisis and personalization had no harm-and-guard pair.
- [FAIL] AE1.3 The crisis sheet had no scope line saying Happy is not an emergency service.
- [FAIL] AE2.2 The "Why am I seeing this?" link had no touch-target size.
- [FAIL] AE2.3 No Dynamic Type behaviour for the recall card or the quote.
- [FAIL] AE2.5 Seasonal particles were specified with no flash or rate limit.
- [FAIL] AE2.6 No screen-reader reading for the recall quote or for Happi art beside it.
- [FAIL] AE2.9 Grade targets were stated but no string was measured.
- [FAIL] ED1.1 The check-in did not reflect the chosen feeling word back within one screen.
- [FAIL] ED2.2 The outward line existed only as a phrase-bank row with no cadence.
- [FAIL] ED4.1 A user with recall off saw nothing remembered on return.
- [FAIL] ED6.2 "That sounds heavy" and "Hold on" are idioms that Phase 3 found do not translate into ar and zh; no translator gloss was specified.
- [FAIL] AP2.5 No back-off rule after ignored reminders.
- [FAIL] ED5.3 Pass 1 let the crisis sheet slide in (250 ms) and did not keep Happi absent for the rest of a crisis session, which Phase 3's absence zone 2 requires.
- [PASS] RQ1.1 Every Claim has an Evidence line with [S#], a Mobbin URL or inference.
- [PASS] RQ1.4 16 non-internal sources opened in this run (5 tagged peer); 26 new Mobbin screens viewed (empty, error, return, completion, reminder, crisis, recall).
- [PASS] RQ2.2 Every finding has Mechanism and So what for Happy.
- [PASS] RQ5.1 Summary states decisions, no options offered.
- [PASS] AE1.2 Crisis path: plain, non-mascot, non-gamified, locale hotlines, no paywall (F16).
- [PASS] AE1.4 Reminders, recall, personalization, sound and haptics are opt-in or one-tap off with "Done. You can turn it back on in Settings."
- [PASS] AE1.5 Outward pointer and banned exclusivity phrase present.
- [PASS] AE1.6 Recall viewable, editable, forgettable; never in notifications.
- [PASS] AE1.7 "3x more consistent" and "#1 predictor" claims removed; replacement "Effects differ."
- [PASS] AE2.4 Every haptic-map row has a reduced-motion fallback.
- [PASS] AE2.7 Feeling words carry text labels; no colour-only state.
- [PASS] AE2.8 Haptics and sound never carry meaning alone; in-app toggles; system suppression respected [S5].
- [PASS] ED1.2 Validation precedes redirection on low words.
- [PASS] ED1.3 No XP or praise on logging a low feeling (F8).
- [PASS] ED2.1 No grading of feelings; counts are of practice, not mood.
- [PASS] ED2.3 Every reminder, memory and ritual is skippable or adjustable.
- [PASS] ED3.1 Delight caps numeric with decay plans (F12).
- [PASS] ED3.2 Routine completion ≤400 ms motion, Soft haptic, no confetti; milestone 600–900 ms.
- [PASS] ED3.3 Borrowed mechanics stated with dose: streak → window count, surprise → ≤1 per 7 days, milestone motion → one beat.
- [PASS] ED4.2 Return framed as welcome, no loss.
- [PASS] ED5.1 No sad mirroring; errors carry no character.
- [PASS] ED5.2 Happi caps deferred to Phase 3 (≤12 words, ≤3 bubbles per session) and app copy carries instruction.
- [PASS] ED5.4 Motion: ease-out, no spring overshoot, reduced motion = final frame.
- [PASS] ED6.1 Phrase bank passes the read-aloud test; banned cloying markers listed.
- [PASS] AP1.1–AP1.4 No loss framing, paid repair, blame copy or decaying pet in this spec.
- [PASS] AP2.1–AP2.4, AP2.6 No fake urgency, confirmshaming, variable reward on therapy, engagement goals in copy, or paywall on distress.
- [PASS] AP3.1–AP3.4 Mascot not required; absent from crisis and distress text.
- [PASS] AP4.1–AP4.3 Banned words list covers infantilizing, toxic positivity and should-statements.
- [PASS] AP5.1–AP5.3 No confetti on routine; surprises carry decay plans.
- [PASS] AP6.1–AP6.3 Red lines in F17.
- [PASS] AP7.1–AP7.3 CBT steps stay app copy at grade ≤8; no treatment claims.
- [PASS] AP8.1–AP8.4 Targets ≥44 pt, reduced motion, no colour-only meaning; contrast ratios belong to Phase 5.
- [N/A] AE2.1 No colour pairings are set in Phase 4; contrast ratios are Phase 5's.
- [N/A] AE1.8 Age is not decided here; the 18+ assumption is carried from Phase 1 and stated under Harm guards.

## Revisions
- Pass 2, RQ1.2: cited [S4] (UIKit intensity 0.0–1.0 vs expo styles) in F9, [S9] (flash limit) in F11, [S16] (app copy grade 11–15) in F1.
- Pass 2, RQ3.3: added single-trial and population limits to [S11] (Contradictions) and the 2019, 69-app scope to [S13] (F16).
- Pass 2, RQ3.4: flagged [S12] as a diet/gym/goal transfer in F15 and [S11] as a workplace well-being transfer in Contradictions; both are dosed to wording and one reminder only.
- Pass 2, AE1.1: added the Harm guards table covering all 9 systems.
- Pass 2, AE1.3: crisis sheet now carries "Happy isn't an emergency service. If you might act on these thoughts, call now." (shared with Phase 3).
- Pass 2, AE2.2, AE2.3, AE2.6: F3 now sets a ≥44×44 pt link, AX5 wrapping without quote truncation, and the VoiceOver reading with Happi art hidden.
- Pass 2, AE2.5: F11 adds the 3-flashes-per-second limit and ≤1 cycle per 2 s for particles.
- Pass 2, AE2.9: measured every phrase-bank "Do" string and the crisis line with a Flesch-Kincaid script; results recorded in F1 (overall 0.2, max 7.2).
- Pass 2, ED1.1: F6 adds "Tired. Thanks for naming it." after the word is picked.
- Pass 2, ED2.2: F6 adds the outward line once per 7 days of use in the closing ritual.
- Pass 2, ED4.1: F15 adds "Last time you practised: Box breathing." for users with recall off.
- Pass 2, ED6.2: replaced "heavy" with "hard" and "Hold on." with "Help is one tap away."; F1 adds translator glosses for remaining idioms.
- Pass 2, AP2.5: F6 adds the pause after 3 ignored reminders and the "Keep reminders?" ask.
- Pass 2, ED5.3 (Phase 3 reconciliation): read 03-character.md `## Presence rules`, `## Voice` and `## Struggle and absence`; crisis sheet now appears with no animation and Happi stays unmounted for the rest of that session; no surprise, milestone or review prompt can fire in that session; home recall skips low-tagged items (absence zone 9); Settings > Memory has no Happi (zone 8); phrase bank aligned to Phase 3 lines ("Saved. It's yours.", "Resting counts too.", "That sounds hard."); Celebrating "!" cap set to ≤1 per 7 days; 30-day return uses Phase 3's two equal buttons; Phase 3 word caps (≤12 words, ≤1 bubble per screen, ≤3 per session) are cited in F1; the shared-line conflict is recorded in Contradictions.

## Self-critique
- Weakest part: haptic and sound choices rest on platform guidance [S1], [S5] and inference, not on any study of haptics with anxious users; the Soft-on-save and Success-at-milestone split is a reasoned default that no source tests. The crisis keyword path is specified only at the behaviour level; false-positive rates of an on-device keyword list are unknown and the list itself is deferred to Phase 6.
- A further pass should: test the 19 phrase-bank lines with 2 native readers each in ar and zh (not only the FK proxy, which is English-only); find a peer-reviewed source on reminder back-off in a clinical population; re-read 03-character.md once Phase 3 reaches PASS, because its Presence rules were still changing during this run (it moved from pass 1 to a longer draft between my two reads).

## Sources
- [S1] Apple — Human Interface Guidelines: Playing haptics. https://developer.apple.com/design/human-interface-guidelines/playing-haptics (opened 2026-11-03 via the HIG JSON endpoint; "Avoid overusing haptics."; "Make haptics optional.")
- [S2] Apple — Human Interface Guidelines: Motion. https://developer.apple.com/design/human-interface-guidelines/motion (opened 2026-11-03; "Make motion optional."; avoid motion on frequent interactions)
- [S3] Apple — Human Interface Guidelines: Managing notifications. https://developer.apple.com/design/human-interface-guidelines/managing-notifications (opened 2026-11-03; permission before any notification; no marketing without explicit agreement)
- [S4] Apple — UIKit: UIImpactFeedbackGenerator and impactOccurred(intensity:). https://developer.apple.com/documentation/uikit/uiimpactfeedbackgenerator (opened 2026-11-03; intensity-capable native API)
- [S5] Expo — Haptics SDK reference. https://docs.expo.dev/versions/latest/sdk/haptics/ (opened via Context7 2026-11-03; styles Light, Medium, Heavy, Rigid, Soft; no intensity argument; no effect in Low Power Mode)
- [S6] Mailchimp — Content Style Guide: Voice and tone. https://styleguide.mailchimp.com/voice-and-tone/ (opened 2026-11-03)
- [S7] NHS — Digital service manual: How we write. https://service-manual.nhs.uk/content/how-we-write (opened 2026-11-03; ≤20-word sentences; reading age 9 to 11)
- [S8] W3C — Understanding WCAG 2.2 SC 2.3.3 Animation from Interactions (AAA). https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html (opened 2026-11-03)
- [S9] W3C — Understanding WCAG 2.2 SC 2.3.1 Three Flashes or Below Threshold (A). https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html (opened 2026-11-03)
- [S10] React Native — AccessibilityInfo. https://reactnative.dev/docs/accessibilityinfo (opened 2026-11-03; isReduceMotionEnabled, reduceMotionChanged)
- [S11] Bidargaddi, N., et al. (2018). To prompt or not to prompt? A microrandomized trial of time-varying push notifications to increase proximal engagement with a mobile health app. JMIR mHealth and uHealth, 6(11), e10123. https://pubmed.ncbi.nlm.nih.gov/30497999/ (opened 2026-11-03; n = 1,255, 89 days) (peer)
- [S12] Dai, H., Milkman, K. L., & Riis, J. (2014). The fresh start effect: Temporal landmarks motivate aspirational behavior. Management Science, 60(10), 2563–2582. https://doi.org/10.1287/mnsc.2014.1901 (Crossref abstract opened 2026-11-03) (peer)
- [S13] Martinengo, L., Van Galen, L., Lum, E., Kowalski, M., Subramaniam, M., & Car, J. (2019). Suicide prevention and depression apps' suicide risk assessment and management: a systematic assessment of adherence to clinical guidelines. BMC Medicine, 17, 231. https://doi.org/10.1186/s12916-019-1461-z (Crossref abstract opened 2026-11-03) (peer)
- [S14] 988 Suicide & Crisis Lifeline. https://988lifeline.org/ (opened 2026-11-03; call, text or chat; "available 24/7/365"; "free and confidential")
- [S15] Find A Helpline (ThroughLine). https://findahelpline.com/ (opened 2026-11-03; verified helplines in "175+ countries", updated daily)
- [S16] Su, W.-C., et al. (2021). Assessing the readability of app descriptions and investigating its role in the choice of mHealth apps. AMIA Annual Symposium Proceedings. https://pmc.ncbi.nlm.nih.gov/articles/PMC8861750 (opened 2026-11-03; descriptions at grade 11–15; ~6% at grade 3–7) (peer)
- [S17] internal: src/locales/en/{home,journal,settings,onboarding,exercises,common}.json and ar/de/zh home.json
- [S18] internal: src/screens/JournalCalendarScreen/JournalCalendarScreen.tsx, src/components/Streak/StreakDisplay.tsx, StreakCelebrationCopy.tsx
- [S19] internal: .agents/skills/rossark-motion-skill/SKILL.md §1, §7
- [S20] internal: src/store/soundStore.ts, src/hooks/useSoundEffects.ts
- [S21] internal: expo-haptics call inventory across src/ (grep, 2026-11-03)
