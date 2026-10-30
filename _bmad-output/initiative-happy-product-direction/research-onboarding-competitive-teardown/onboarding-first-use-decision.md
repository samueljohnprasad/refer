---
type: decision-record
status: accepted
created: 2026-10-30
research_basis: research-onboarding-competitive-teardown.md
decision: Audit and specify a progressive hybrid first-use value chain before implementation
---

# Onboarding first-use value-chain decision

## Decision

Happy will not treat Thought Catcher as the entire aha or conversion mechanism.

Before implementation, audit the complete path from goal selection through Home and the paywall. Then specify a progressive hybrid:

1. Route anonymously from one plain-language goal.
2. Teach with one short worked Thought Catcher example.
3. Offer three equally legitimate paths:
   - **Try with something from today**
   - **Use another example**
   - **Continue**
4. Help personal-practice users form one credible alternative interpretation without forced positivity.
5. Save the completed artifact privately.
6. Reach Home and connect the artifact to the next lesson or practice.
7. Offer signup only when it provides a real save or sync benefit.
8. Offer an optional user-chosen if-then plan and contextual reminder.
9. Present a transparent continuation paywall after the useful loop.

The worked-example-only path is the built-in safe fallback. No personal disclosure is required.

## Reframed problem

The original question combined three outcomes: learning the CBT skill, completing onboarding, and purchasing Premium. Thought Catcher cannot responsibly carry all three.

The working question is:

> What is the smallest first-use sequence that proves Happy can teach the user a personally useful skill, while earning enough trust to make continued learning worth paying for?

The responsibilities are separate:

| Component | Responsibility |
|---|---|
| Thought Catcher | Teach one understandable cognitive move. |
| Saved artifact and Home | Demonstrate ownership, continuity, and the next useful step. |
| Paywall | Explain why continuing the guided system is worth paying for. |

## First-principles value chain

| Stage | User must believe | Product proof |
|---|---|---|
| Orient | “This is for the problem I have.” | One plain-language goal choice |
| Understand | “I see what this skill does.” | Short worked example |
| Participate | “I can do the move myself.” | Optional constrained personal practice |
| Recognize | “I can see another credible interpretation.” | Specific feedback without forced positivity |
| Own | “This work belongs to me.” | Privately saved artifact |
| Continue | “There is a guided path from here.” | Home showing the linked next lesson |
| Preserve | “An account has a purpose.” | Signup framed around a real save or sync benefit |
| Remember | “A reminder supports my plan.” | Optional cue-based reminder |
| Purchase | “Premium continues something valuable.” | Transparent continuation paywall |

Home continuity is part of the complete aha:

> “I learned one move, used it, saved something useful, and can see how Happy will help me practice it.”

Trial start and purchase are downstream outcomes, not proof that the aha occurred.

## Accepted comparison

Scores below are decision heuristics, not measured outcomes. Scale: 1 poor, 5 strong.

| Option | Skill comprehension | Relevance | Safety and autonomy | Core-loop fit | Premium story | Decision |
|---|---:|---:|---:|---:|---:|---|
| Current canned interaction only | 3 | 1 | 4 | 2 | 1 | Retain only as worked example |
| Blank personal thought first | 2 | 5 | 1 | 4 | 3 | Reject for first action |
| Worked example → optional personal practice | 5 | 4 | 5 | 5 | 5 | **Selected** |
| Passive lesson | 2 | 1 | 4 | 2 | 1 | Reject |
| Worked example only → Home | 4 | 1 | 5 | 3 | 2 | Safe fallback inside selected path |

## Assumptions requiring validation

| Assumption | Confidence | Impact if wrong |
|---|---:|---:|
| Users understand the current interaction | Low | High |
| Optional personal practice creates additional value | Medium-low | High |
| Users will disclose even a low-stakes thought during first use | Low | High |
| Another interpretation produces a recognizable aha | Medium | High |
| A saved artifact makes Home feel valuable | Medium | High |
| Home is the correct monetization boundary | Low | High |
| The paywall currently communicates continuation | Low | High |
| Existing funnel analytics are reliable enough for optimization | Unknown | High |
| The problem is primarily screen design rather than routing, state, content, or instrumentation | Low | High |

Every future specification decision must carry one label:

- observed;
- research-supported;
- product inference;
- requires testing.

## Safety and scope constraints

- Worked example target: under 60 seconds.
- Optional personal practice target: under 90 seconds.
- No mandatory personal disclosure.
- No forced positive reframe.
- No diagnosis, clinical judgment, or promised symptom improvement.
- An unchanged believability or emotion rating is valid.
- Preserve the completed artifact when the paywall is dismissed.
- No raw thoughts or reflection text in analytics.
- No mandatory signup, pledge, reminder, or paywall before useful-loop completion.
- Reminder refusal is neutral and does not threaten progress.
- Rewards acknowledge effort or demonstrated skill, not mental-health improvement.
- Hold paywall copy, price, signup, reminders, and commercial placement constant during the first practice-branch experiment.

## Validation sequence

### 1. Current-state audit

Inspect screens, copy, branches, state transitions, persistence, analytics events and payloads, privacy boundaries, and paywall context. Do not redesign from screenshots or funnel percentages alone.

### 2. Moderated comprehension check

Compare the current canned interaction with the progressive hybrid using 5–8 target users. Check whether users can explain:

- what cognitive move they learned;
- whether they felt pressured to disclose or feel better;
- what was saved;
- what Happy would help them do next;
- why Premium might be useful.

### 3. Smallest product experiment

- **Control:** worked example only.
- **Treatment:** worked example plus optional personal-practice branch.
- Keep commercial variables constant.

Primary outcome: completion of the useful loop—lesson, practice or intentional skip, saved artifact, and Home arrival.

Secondary outcomes: comprehension, perceived control, time to value, branch choice and completion, second practice, signup, paywall dismissal, trial start, trial-to-paid, first renewal, refunds, and complaints.

Report counts and uncertainty. Do not build percentage narratives from a tiny sample.

## Rollback conditions

Rollback or ship the worked-example-only fallback when the progressive branch produces any of these without compensating downstream value:

- lower Home arrival;
- substantial personal-practice abandonment;
- poor skill comprehension;
- increased distress, privacy concerns, or support complaints;
- belief that Happy made a clinical judgment;
- loss of trust around the paywall;
- sensitive content appearing in analytics.

## Required next artifact

Produce a current-state first-use audit before any implementation. The audit must map each existing screen and transition to the belief it is intended to establish, identify screens that establish none, verify analytics and privacy behavior, and locate the actual paywall value boundary.

## Research basis

See [Happy onboarding: Thought Catcher and the first useful loop](./research-onboarding-competitive-teardown.md). That report contains the verified evidence, citations, corrections, and staleness map. This decision record contains accepted product judgments derived from that evidence.
