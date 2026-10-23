# Digest 1 — Gamified Mobile Onboarding Teardowns: Duolingo & Finch

**Dimension:** Gamified Onboarding Architectures, Micro-Wins & Emotional Bonding  
**Sources:** Mobbin iOS Flows, Growth.Design, UserOnboard, Lenny's Newsletter (Jorge Mazal), Deconstructor of Fun, Adapty.

---

## Duolingo Step-by-Step Sequence & Timing

### Exact Screen Sequence (App Open to First Lesson)
1. **Splash Screen (0–2s):** Solid lime background (`#58CC02`), Duo eyes animate, logotype.
2. **Welcome Value Prop (2–5s):** Mascot Duo waves. *"Learn a language for free. Forever."* Primary 3D button *"GET STARTED"*, secondary *"I ALREADY HAVE AN ACCOUNT"*.
3. **Language Selection (5–12s):** *"What would you like to learn?"* High-contrast cards with flags.
4. **Attribution / Social Channel (12–18s):** Duo with clipboard: *"How did you hear about Duolingo?"* Progress bar introduced.
5. **Proficiency Assessment (18–25s):** *"How much Spanish do you know?"* 4 tiered cards.
6. **Motivation Discovery (25–35s):** *"Why are you learning Spanish?"* Single-select cards with encouraging Duo dialogue.
7. **Social Proof & Expectation Setting (35–45s):** *"Here's what you can achieve together!"* Milestone goals.
8. **Daily Commitment / Habit Goal (45–55s):** *"What's your daily learning goal?"* Casual (3m), Regular (10m), Serious (15m), Intense (20m).
9. **Branching Point / Starting Point (55–65s):** *"Learning for first time"* vs *"Already know some"*.
10. **System Hook / Widget (65–75s):** Duo with pencil: *"I'll cheer you on from your home screen!"* Previews streak widget.
11. **Instant Handoff to Unit 1, Lesson 1 (75s):** NO account creation screen. Instant drop into interactive exercise.

### Commitment Question Placement vs Interactive Exercises
- **Commitment First:** Steps 4–8 occur *before* educational content. Cialdini's **Commitment & Consistency Bias** locks intent before cognitive exertion.

### Permission, Account Creation & Paywall Timing
- **Notifications:** Contextual pre-permission primer placed right after commitment goal or immediately following Lesson 1.
- **Account Creation ("Lazy Registration"):** Deferred until *after* Lesson 1 finishes. When user earns +10 XP and unlocks Day 1 Streak, modal prompts: *"Create a profile to save your progress"* with *"LATER"* button.
- **Paywall (Super Duolingo):** Trial pitch shown after account registration, or triggered contextually upon losing hearts / hitting 7-day streak.

---

## Duolingo Micro-Win & Friction Prevention Mechanics

### First Lesson Architecture (Unit 1, Lesson 1)
- **Length:** 10–12 questions. Duration: 120–180 seconds.
- **Cognitive Ramp ($i + 1$ Input Hypothesis):**
  - **Q1–Q3 (Instant Dopamine):** Direct picture-to-word matching with obvious visual cognates (photo of coffee $\rightarrow$ *"el café"*). Error rate $< 2\%$. Teaches tap-and-check mechanic.
  - **Q4–Q7 (Implicit Grammar):** Slight variation (*el* vs *la*). Pattern recognition, audio playback, no grammar theory.
  - **Q8–Q10 (Sentence Assembly):** Word-bank tiles. Users tap words in order. Bypasses keyboard typing friction.
  - **Q11–Q12 (Synthesis & Error Dynamic Recycling):** Any question missed earlier is re-queued at end so user always finishes on a success state.
- **Micro-Win Design:** Bottom drawer snaps up with bright green banner (`#58CC02`), bold checkmark, *"Nicely done!"*, ascending audio chime, medium haptic feedback (`impactAsync(Medium)`). At Q5, Duo pops in: *"5 in a row!"*.
- **Lesson End Screen:** XP burst (+10 XP), accuracy percentage (94%), Day 1 Streak flame ignited.

---

## Finch Emotional Bonding & Companion Introduction Pattern

### Companion Introduction & Hatching Sequence
1. **Brand Intro & Value Prop:** Soft pastel UI, *"Meet your new self-care best friend!"*
2. **The Egg Selection:** Low-effort choice of egg color. Establishes psychological ownership (IKEA effect).
3. **Account Hook with Skip:** *"Create an account to hatch your Finch and save progress"* with prominent *"Skip"* button top-right.
4. **The Hatch (~45s in):** Egg cracking animation $\rightarrow$ *"You hatched a birb!"* Baby bird emerges in nest.
5. **Pet Naming:** Pre-filled with randomized name (*"Lee"*, *"Noodle"*) with *"Shuffle"* and *"Next"*.
6. **Reciprocal Social Bonding:** Pet speaks in speech bubble: *"If my name is Lee, what's your name?"* Transitions intake into friendship.
7. **Pet Trait Attribution:** User chooses focus trait (*Curiosity*, *Resilience*, *Compassion*).

### First Tasks Given to User (Low-Energy Baseline)
Finch targets baseline functioning for users suffering from depression/burnout/ADHD:
- **Baseline Micro-Tasks:**
  - *"Survive the day"* (5⚡ energy)
  - *"Get out of bed"* (5⚡ energy)
  - *"Brush teeth"* (5⚡ energy)
  - *"Take 3 deep breaths"* (5⚡ energy)
  - *"Drink water"* (5⚡ energy)
- **First Adventure Loop:** The baby bird requires **15 Energy (⚡)** to embark on its Day 1 exploration. Completing 3 basic tasks fills `0/15` progress bar. Pet leaves nest on adventure, triggering instant emotional reward.

### Emotional Bonding BEFORE Permissions & Monetization
- **Externalized Self-Care (Tamagotchi Effect):** User cares for pet when unable to care for self (*"Help Baby Lee gain energy so she can explore!"*).
- **Notification Permission:** Pet holds a note: *"Get reminders from Lee: Remember to drink water!"*.
- **No Early Paywall:** Finch Plus subscription screen is deferred until after the first daily routine is generated and pet has launched on adventure.

---

## Quantifiable Conversion / Drop-off Data

| Metric | Duolingo | Finch (Self-Care Pet) | Health & Fitness Benchmark |
|---|---|---|---|
| **Day 1 (D1) Retention** | **~51% – 54%** | **~54%** | 20% – 25% |
| **Day 7 (D7) Retention** | **~35%** | **~37%** | 8% – 12% |
| **Free-to-Paid Conversion** | **~8.6% – 9.0%** | **~4% – 6%** | 1.5% – 2.5% |
| **Lazy Registration Impact** | **+20% D1 retention** jump upon delaying signup | **Skip button** on screen 3 prevents ~30% bounce | N/A |
| **Widget Re-engagement** | **~18% DAU lift** via home screen streak widget | **4x higher habit adherence** for widget users | N/A |

---

## Key Design Takeaways for Happy

1. **"Play First, Profile Second" (Lazy Registration):** Delay signup until *after* the first interactive lesson/exercise is completed and XP is awarded.
2. **Anchor Emotional Bond via Mascot Early:** Meet Happi the Panda early, let Happi react with warmth (*"Happi is glad you showed up today"*).
3. **Extreme Low Cognitive Load First Exercise:** Word chips and binary emotion/thought sorting, 0% failure rate, no open keyboard text box.
4. **Low-Energy Baseline ("Survive the Day"):** 1-tap validation tasks (*"Took a deep breath"*, *"Showed up"*) to ensure immediate win.
5. **Contextual Permissions Post-Win:** Notification prompt framed as Happi checking in, presented *after* Lesson 1.
