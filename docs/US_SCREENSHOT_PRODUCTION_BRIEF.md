# Happy US Screenshot Production Brief

## Scope

This brief supersedes the **first-three screenshot order** for the US default product page. It does not replace the broader 10-slot localization plan.

The job is simple: in the first three images, show what Happy helps someone do, how it works, and why it matters in an anxious moment. Each image sells one idea and uses real Happy UI only.

## Narrative

| Slot | Job | Recommended headline | In-app proof |
| --- | --- | --- | --- |
| 1 | Make Happy understandable in one second. | **CBT that fits**<br>**real life** | A guided journey map with a clear next lesson. |
| 2 | Show the core CBT mechanism. | **Break the**<br>**thought loop** | A thought-reframing exercise with a believable example. |
| 3 | Show immediate value in a hard moment. | **A tool for**<br>**right now** | A calming exercise such as box breathing or grounding. |

The primary deck deliberately leads with journeys, thought reframing, and a coping tool. Voice journaling and insights remain strong later slides or dedicated Custom Product Pages, but they should not compete with the core promise on the default page.

## Copy Options

Use the recommended option unless testing a variant. Keep text to two lines, make one word green, and do not add a subtitle unless the screenshot needs essential context.

| Slot | Paint a moment | State an outcome | Kill a pain | Recommended |
| --- | --- | --- | --- | --- |
| 1 | Start with one small step | CBT that fits real life | Not another worksheet | CBT that fits real life |
| 2 | Name the thought loop | Make room for a kinder thought | Break the thought loop | Break the thought loop |
| 3 | One tool. Right now. | Find your next calm step | When your mind gets loud | A tool for right now |

## Capture Direction

### 1. Guided CBT Journey

**Real surface:** [`Journey map route`](/Users/samuelprasad/Desktop/happy/journals/app/tabs/screens/(journey)/journey-map.tsx) or the Journeys tab with an active, unlocked course.

**Capture state:** Show one active lesson, a visible path forward, and earned progress. Use representative test data only; no real reflection, name, or health data.

**Composition:**

- Sage canvas with Happy wordmark near the top.
- Headline occupies the upper third: `CBT that fits` in green, `real life` in deep ink.
- Center an upright real app capture; do not redraw or regenerate app UI.
- A small, flat-vector panda may sit beside the lower phone edge, waving toward the next lesson.
- Do not place a rating, award, testimonial, or price on this slide unless it is verified and approved.

### 2. Thought Reframing

**Real surface:** The existing exercise flow configured for a Thought Reframing step.

**Capture state:** A short, ordinary thought and a balanced alternative. Example content must be fictional and non-diagnostic:

> “I made one mistake, so I’ll fail.”

> “One mistake is difficult, but it does not define the whole outcome.”

**Composition:**

- Use a quiet sage-tint surface so the exercise response is the visual focus.
- Headline: `Break the` in green, `thought loop` in deep ink.
- Present the real exercise screen large enough to read at thumbnail size.
- Use a small flat panda only if it clarifies the before-to-after moment; it must not cover the input or answer.
- Never call the content “therapy,” “treatment,” or a guaranteed anxiety cure in the image.

### 3. Coping Tool

**Real surface:** A real guided breathing or grounding exercise from the Exercises tab. Do not use an empty Coping Cards list as the hero screen.

**Capture state:** A concrete exercise in progress, such as a breath pacer or 5-4-3-2-1 prompt. The screen should make the next action obvious.

**Composition:**

- Headline: `A tool for` in green, `right now` in deep ink.
- Use a contrasting blue or lavender accent behind the phone only if it supports the active calming tool; keep the rest of the canvas sage.
- Panda pose: a quiet, seated companion. No sparkles, leaves, gradient haze, or faux clinical badges.
- The finished image should promise an available practice, not immediate relief or a clinical result.

## Design System

| Element | Direction |
| --- | --- |
| Canvas | Sage `#F6F8F4` to `#EDF2EB`; solid or gently tonal, never a generic gradient. |
| Headline | Nunito ExtraBold, two intentional lines, green `#4CAF50` plus ink `#182418`. |
| Device | Real iPhone capture in a restrained dark or silver frame; vary angle only after the first three. |
| Mascot | Flat 2D panda with crisp black outline and solid fills. Never use rendered, furry, glossy, or generated UI. |
| Spacing | Keep headline below the status-bar safe area and phone controls above the home-indicator safe area. |

## Thumbnail QA

Review each image at about 160 px wide before export.

- The headline is readable without zoom.
- A viewer can name the benefit in one second.
- The phone surface is real Happy UI, not mock, generated, or cropped confusingly.
- No image has more than one promise.
- The three screenshots work independently and as a sequence.

## Export and Review

- Export the source composition at `1284 × 2778` PNG for the 6.5-inch iPhone slot; produce the additional required App Store size from the same composition.
- Use a dedicated internal test account and seeded demo content for every capture.
- Check copy, claims, and the actual shipped feature against the release candidate before upload.
- Keep all source captures and exported assets in a clearly named US production folder before submitting to App Store Connect.

## Campaign Alignment

| Screenshot | Default product page | Dedicated campaign page |
| --- | --- | --- |
| 1 | Yes | CBT Journeys |
| 2 | Yes | CBT Journeys |
| 3 | Yes | Anxiety Tools |
| Voice journaling | Later in the default deck | Voice Journal |
| Personal insights | Later in the default deck | CBT Journeys or a future Insights page |
