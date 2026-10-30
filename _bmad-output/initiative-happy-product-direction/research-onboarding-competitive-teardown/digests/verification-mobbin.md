# Independent Mobbin verification

**Verification date:** 2026-10-30  
**Scope:** Targeted re-search of the named iOS flows in Mobbin and visual inspection of the returned flow-preview images. Metadata alone was not treated as evidence.

## Verdicts

| Load-bearing claim | Verdict | Independent observation |
|---|---|---|
| Duolingo routes setup toward a learning path and offers deferrable profile creation | **Verified** | The onboarding previews visibly ask what language the user wants to learn, current proficiency, a daily goal, and whether to start from scratch or find a level. The flow then arrives at a lesson path. The separate profile flow visibly says “Don’t lose your progress! Let’s create a profile.” and offers **Later** before account fields. |
| Finch turns onboarding answers into a concrete starter plan and contextual reminder | **Verified** | Finch visibly asks which areas the user wants support with, then renders a named starter plan with specific actions such as getting out of bed, brushing teeth, drinking water, stretching, and breathing. The onboarding/home previews connect those actions to energy for the bird’s adventure. Notification prompts are framed as reminders from the named bird, include a concrete example (“Remember to drink water”), and expose **Maybe later** or **Not now**. |
| Captured Headspace, Calm, and stoic. variants place trial/paywall before a completed first practice | **Verified for the captured variants** | Headspace’s captured onboarding places account creation and a trial wall before the recommended Basic session/player. Calm’s onboarding places its plan/paywall before the home surface containing a one-minute meditation; no completed practice is visible before the wall. stoic. places goal/demographic setup, three reflection times, notification permission, and a preparation screen before the free-trial wall; morning/evening reflections appear only after it. |
| Ahead and Liven use long assessment or commitment theatre before later real lesson/practice | **Verified observation; “theatre” is interpretive** | Ahead has a short flow built around drawing a checkmark/promise and a long flow with signup, ten-question assessment, matched journeys, time/payment questions, and “Analyzing your answers”; a separate later journey visibly contains a quiz, feedback, action planning, a reminder, and progress. Liven visibly runs a broad goal, many self-report questions/interstitials, authority logos, a signed contract, and account creation before its later personalized-course flow, which contains a lesson, self-discovery question, completion action, and level-up. Calling the earlier steps “theatre” is a product-design judgment, not a Mobbin-measurable fact. |
| Reminder prompts are stronger when tied to an actual completed or scheduled action | **Unverified as a strength/outcome claim** | Mobbin does verify the underlying placement pattern: a Headspace course capture shows a session player before reminder setup; Ahead asks to remember a just-created plan; Finch ties reminders to named starter goals and its reward object. Mobbin does not provide conversion, opt-in, retention, comprehension, or preference data, so it cannot establish that these prompts are *stronger* than prompts shown earlier. The defensible claim is only that they are more contextually tied to an observed action or plan. |

## Direct Mobbin evidence

### Duolingo

- [Onboarding, 20 screens](https://mobbin.com/flows/b0b4f93f-5637-46ec-9d77-49ecda6b991d): language choice and setup oriented toward starting learning.
- [Alternate onboarding, 20 screens](https://mobbin.com/flows/ac9d2f58-868d-4fd3-a79c-9655ce6b1522): proficiency, daily learning goal, and start-from-scratch/find-my-level routing.
- [Creating a profile, 16 screens](https://mobbin.com/flows/4511e153-c7d5-4b70-b37e-09cc798e49d9): progress-preservation framing, visible **Later**, account fields, and lesson-path arrival.

### Finch

- [Onboarding, 21 screens](https://mobbin.com/flows/80ef83ef-f872-4825-b18d-6b193d60a9aa): hatched bird, reminder framing, Day 1 energy/adventure framing, and checkable goals on home.
- [Setting up goals, 6 screens](https://mobbin.com/flows/19212698-61fe-43ca-9144-60c9e73bbcd2): support-area answers become a concrete seven-item starter plan.
- [Turning on notifications, 2 screens](https://mobbin.com/flows/e42398a2-8533-456c-ae25-eccac28f5de3): self-care reminder is tied to an existing egg/action and offers **Not now**.

### Headspace, Calm, and stoic.

- [Headspace onboarding with subscription, 21 screens](https://mobbin.com/flows/31b21791-dec6-448a-8253-648f5ebbba3e): breathing opening, account creation, intent selection, then commercial onboarding; no completed session is visible first.
- [Headspace alternate onboarding, 18 screens](https://mobbin.com/flows/7cdc08c0-3bcb-4882-90dd-5cf92019616f): account and trial explanation precede the Basic recommendation and Session 1 player; reminder configuration follows the session in the capture.
- [Headspace starting a course, 25 screens](https://mobbin.com/flows/7d991d93-45b1-4ec9-bb5a-e89fd324d89a): course activity precedes reminder/habit-support configuration in the sampled sequence.
- [Calm onboarding, 10 screens](https://mobbin.com/flows/38549b00-2fe8-4fd1-914b-13c4905db245): plan/paywall and renewal-reminder toggle precede home; the home preview exposes a one-minute meditation, but no completed practice is shown before the wall.
- [stoic. onboarding with scheduling, 13 screens](https://mobbin.com/flows/0c54c507-3659-4b57-a758-adaa44ec3aeb): three daily journal times and notification permission are configured before practice.
- [stoic. alternate onboarding, 14 screens](https://mobbin.com/flows/948a7285-9f2f-46d1-8d82-32da2d4ce828): goal selection, scheduling, preparation screen, trial wall, then reflection home.

### Ahead and Liven

- [Ahead short onboarding, 6 screens](https://mobbin.com/flows/97103053-f137-4dcd-85af-31f82e7c1e66): breathing pause and drawn checkmark/promise without a visible lesson or practice.
- [Ahead long onboarding, 36 screens](https://mobbin.com/flows/57e41d19-30db-4443-ab36-b19c8c20dfe4): signup, ten-question assessment, journey matching, commitment/payment questions, and analysis before journey arrival.
- [Ahead starting a journey, 25 screens](https://mobbin.com/flows/4298160c-5dac-4a5a-a687-248472e86d30): later quiz, correctness feedback, self-assessment, plan-linked reminder, and visible map progress.
- [Liven onboarding, 20 screens](https://mobbin.com/flows/ba9958ef-dd21-4a03-9ba1-2e5a3f5b51e3): broad goal and demographic setup before the later program.
- [Liven personalized-program setup, 23 screens](https://mobbin.com/flows/5695ec7e-a531-4d04-8381-746e3591db36): long assessment, reassurance/authority interstitials, signed contract, and account creation before program entry.
- [Liven completing a personalized course, 13 screens](https://mobbin.com/flows/4dba6e5b-b0b8-4644-a6e5-312f4f18d094): real lesson, self-discovery question, completion, and level-up occur later.

## Uncertainty and evidence boundary

- Mobbin returned multiple historical variants for several apps. The search results did not expose capture dates, so this verifies only the linked captured variants available on the access date—not the current live default for every user.
- Preview images are sampled from longer flows. They support the visible coarse ordering above but cannot prove that every intermediate screen or experimental branch was inspected.
- Locale, acquisition channel, account state, subscription eligibility, and experiments may change the branch a user sees.
- Mobbin establishes observed screens and sequence only. It cannot establish conversion, retention, reminder opt-in performance, wellbeing outcomes, user preference, or causal superiority.
- No targeted preview contradicted the four screen-order claims. The reminder “stronger” claim remains unverified because it exceeds Mobbin’s observational evidence.
