---
name: mh-microlearning-authoring
description: Authoring guidelines and audit gates for mental-health microlearning content. Use when designing, writing, or auditing brief, approachable learning experiences.
---

# Authoring Mental-Health Microlearning

When tasked with designing, writing, or auditing mental-health microlearning content, you MUST adhere to the following framework, constraints, and audit rubrics.

## Purpose
Create brief, approachable learning experiences that give the learner the right information, in the smallest amount they can comfortably understand and remember. Bite-sized understanding without oversimplifying. Teach through participation when it improves learning, but use clear explanations when interaction would be distracting.

## Mandatory Cognitive Load and Bite-Sized Content Reference
Every content-generation and audit task MUST use this reference. Mental-health learners may already be anxious, tired or distracted, so content needs a lower entry burden.
*   **One piece at a time:** One manageable piece of thinking at a time.
*   **Useful, not just interesting:** Correct and useful information—not merely interesting facts.
*   **Language:** Plain language before psychological terminology.
*   **Pacing:** Progressive introduction of difficult concepts.
*   **Memory:** Minimal working-memory requirements. Related information remains visible when comparison is required.
*   **Scenarios:** No long scenarios containing irrelevant details.
*   **Instructions:** No multiple instructions or decisions on one screen.
*   **No redundancy:** No repeating the same explanation across cards, questions and feedback.
*   **No clutter:** No unnecessary terminology, metaphors or competing frameworks.
*   **No over-segmentation:** Five tiny cards can be harder than one clear visual.
*   **Scaffolding:** Worked examples before independent attempts when a task is complex.
*   **Scientific integrity:** Simplification must never make the information scientifically incorrect.

## Start With the Learner Change
Before authoring, state:
*   **Learner:** Who is this for, in ordinary language?
*   **Moment:** When would this matter in real life?
*   **Change:** What should the learner notice, decide, or do afterward?
*   **One takeaway:** What single sentence should remain tomorrow?
*   **Classification:** Identify what is Essential, Helpful, or Enrichment content.

If the lesson needs more than one takeaway, split it.

## Content Budget
Maintain flexible course, section, unit, lesson, and exercise structures. There are **no standard counts or duration quotas**, but use these defaults as a baseline unless the component genuinely requires otherwise:

| Scope | Default limit |
| :--- | :--- |
| Lesson duration | 2–5 minutes |
| New concepts | 1 |
| Meaningful interactions | 2–4 |
| Passive teaching before first action | 0–1 screen |
| Cards in one teaching sequence | 1–3 |
| Words on a teaching card | 10–35 |
| Answer choices | 2–4 |
| Feedback | 1–2 short sentences |
| Required free-text responses | 0 |

Do not pad a lesson to reach a duration or exercise count. A lesson ends when the learner has made one useful mental move.

## Shape the Experience
There is **no mandatory personal application** and **no forced quiz, scenario, reflection, journaling or mood-check pattern.** A lesson can simply:
*   Explain one useful idea clearly.
*   Help the learner understand a relationship.
*   Correct one misconception.
*   Introduce terminology.
*   Show an example.
*   Retrieve earlier knowledge.
*   Compare two ideas.
*   Practise, reflect or assess when appropriate.

When designing interactive lessons, you may adapt this rhythm:
1.  **Recognize:** Begin with a familiar moment, feeling, choice, or prediction.
2.  **Discover:** Let the learner reveal the principle through an action or consequence.
3.  **Apply:** Use the principle in one realistic, slightly different situation.

Do not create separate screens merely to satisfy every stage. One strong interaction may perform two stages.

Use taps, sorting, matching, building, prediction, comparison, progressive reveal, dialogue, simulation, guided rewriting, or scenario decisions. Use passive cards and clear explanations when interaction would distort the idea or distract the learner.

## Write for General People
*   Use conversational language and concrete situations.
*   Put the human experience before the psychological term.
*   Introduce terminology only when it helps the learner recognize or communicate something.
*   Explain a term when it becomes useful; do not front-load definitions.
*   Use short sentences and one instruction at a time.
*   Prefer “You may notice…” over “The individual experiences…”
*   Preserve nuance without sounding clinical.
*   Never speak down to the learner or use childish praise.
*   Avoid lecture openings, chapter summaries, definition dumps, repeated paraphrases, obvious recall questions, essay prompts, weak distractors, and screens that only say “continue.”

## Make Every Interaction Earn Its Place
Interaction should be used ONLY when it improves learning. For each exercise, ask:
*   What new mental action does the learner perform?
*   Does it teach, apply, retrieve, or personalize something not already completed?
*   Would removing it reduce learning? *(Remove the exercise if the answer is no)*

Do not tell an answer and immediately ask the learner to repeat it. Do not retest the same fact with different wording. A later exercise must add transfer, contrast, consequence, or retrieval after meaningful spacing.

Use plausible options that reveal different interpretations. Never use shame, catastrophe, or an obviously ridiculous belief solely as an easy wrong answer. When a distressed interpretation appears, acknowledge the feeling before gently correcting the conclusion.

## Feedback
*   Respond immediately and non-punitively.
*   Correct the idea, not the person.
*   Explain why the chosen interpretation fits or does not fit.
*   Add one useful distinction; do not repeat the full lesson.
*   On an incorrect answer, preserve momentum and allow retry or continuation.
*   Do not use “Obviously,” “Wrong,” “You failed,” or forced enthusiasm.

## Reflection, Tracking, and Scoring
*   Prefer a tap-based personal connection over required writing.
*   Make free text optional unless expressing or constructing the answer is the skill itself.
*   Do not append a mood check to every lesson. Collect it only when the result benefits the learner or measures a meaningful before/after change.
*   Reward completion, effort, recovery, and practice. Do not turn small introductory lessons into high-stakes accuracy tests.
*   Track mastery across repeated encounters, not a percentage based on one or two questions.

## Mental-Health Safety and Accuracy
*   Ensure evidence quality and scientific accuracy.
*   Teach patterns and possibilities; do not diagnose the learner.
*   Do not infer a disorder, cause, brain state, trauma, or treatment need from a short scenario.
*   Avoid absolute promises such as “This proves,” “This will cure,” or “Your brain is working exactly as it should.”
*   Distinguish education from medical advice.
*   Include escalation guidance only when relevant; do not add alarming warnings to ordinary content.
*   Represent setbacks as normal information, not failure.
*   Use inclusive scenarios and avoid assuming culture, family structure, gender, resources, or access to care. Respect privacy and accessibility.
*   Verify medical, psychological, and neuroscience claims against current authoritative primary or clinical sources before presenting them as fact. Mark uncertainty honestly.

## Authoring Workflow
1.  Inspect the surrounding unit, prior lesson, next lesson, supported components, and content schema.
2.  Write the learner change and one takeaway.
3.  Select the smallest interaction that can teach the idea accurately.
4.  Draft within the content budget and Cognitive Load Reference.
5.  Remove repeated explanation and duplicate testing.
6.  Check scientific accuracy, emotional safety, reading load, accessibility, and restoration requirements.
7.  Validate the final YAML, SQL, or structured object against the repository schema.
8.  When editing structured content, preserve exact field names and supported component shapes. Do not invent schema fields. Content rules do not override runtime validation.

## Audit Gate
Score each item 0 = fails, 1 = partial, 2 = strong:

| Criterion | Question |
| :--- | :--- |
| **Focus** | Does the lesson produce one clear learner change? |
| **Cognitive Load** | Is working memory minimized and are instructions simple? |
| **Participation** | Does the learner act before being heavily taught (if interactive)? |
| **Progression** | Does each exercise add a new mental move? |
| **Transfer** | Does the learner use the idea in a realistic new situation (when appropriate)? |
| **Brevity** | Can anything be removed without reducing learning? |
| **Humanity** | Does it sound supportive and adult, not academic or childish? |
| **Safety** | Are claims nuanced, non-diagnostic, and non-shaming? |
| **Accuracy** | Are factual claims precise, scientifically correct, and appropriately qualified? |
| **Accessibility** | Are instructions short and interactions understandable without relying only on color, sound, timing, or motion? |

*Require at least 16/20, with no zero in Safety, Accuracy, or Cognitive Load.* When auditing, report the three highest-impact problems first, explain why they matter, and propose a smaller lesson shape rather than merely rewriting sentences.

## Final Quality Test
**Reject** the lesson if it resembles:
> Explain → quiz the explanation → repeat it in a scenario → demand reflection → collect a rating.

**Approve** it when it feels like:
> Notice something familiar → make a small choice → discover a useful pattern. *(No forced "try it once in life" application required).*
