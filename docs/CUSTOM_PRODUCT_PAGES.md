# Happy — Custom Product Pages

US launch package for three App Store Custom Product Pages. These pages share the default app name, subtitle, description, icon, price, and in-app purchase configuration; only promotional text, screenshots, and preview videos vary.

## Launch decision

| CPP | Audience intent | Existing US screenshots | New work | Primary source |
| --- | --- | --- | --- | --- |
| CBT Journeys | CBT exercises, thought reframing, guided courses | Reuse | None | Apple Search Ads CBT ad groups |
| Anxiety Tools | anxiety tools, coping cards, grounding, breathing | Reuse | None for v1 | Apple Search Ads anxiety ad groups + creator links |
| Voice Journal | voice journal, talk through feelings, spoken reflection | Partial reuse | Two dedicated voice slides | Apple Search Ads voice-journal ad groups + creator links |

The existing exports are valid for the two required iPhone families:

- 6.7-inch: `screenshots/en-US/APP_IPHONE_67/*-1320x2868.png`
- 6.5-inch: `screenshots/en-US/APP_IPHONE_65/*-1284x2778.png`

## CPP 1 — CBT Journeys

**Internal name:** `cpp-cbt-journeys`

**Promo text:**

> Turn anxious thoughts into practical next steps with guided CBT journeys, short exercises, and a practice you can return to.

**Screenshot order:**

1. `happy-app-store-screen-03` — Explore guided CBT journeys
2. `happy-app-store-screen-01` — One lesson at a time on a visible journey map
3. `happy-app-store-screen-05` — Capture the thought that is looping
4. `happy-app-store-screen-04` — Review a completed thought exercise
5. `happy-app-store-screen-07` — Keep a coping card ready
6. `happy-app-store-screen-10` — Return to the next small practice

**Hypothesis:** Matching CBT-intent traffic to the journey map and reframing flow will improve product-page-to-install conversion over the broad default page.

## CPP 2 — Anxiety Tools

**Internal name:** `cpp-anxiety-tools`

**Promo text:**

> When your mind feels loud, open a practical CBT tool: coping cards, thought reframing, breathing, and guided exercises for the moment.

**Screenshot order:**

1. `happy-app-store-screen-07` — A coping toolkit ready when needed
2. `happy-app-store-screen-04` — Browse short guided exercises
3. `happy-app-store-screen-05` — Name the thought in the moment
4. `happy-app-store-screen-01` — Follow a guided journey step by step
5. `happy-app-store-screen-03` — Choose a course that fits the need
6. `happy-app-store-screen-10` — Start a small reflection

**Hypothesis:** A concrete tool-first page will qualify anxiety-intent traffic better than leading with analytics or general journaling.

**Follow-up:** When a final breathing or grounding composition is captured at full size, replace slot 2 or 3 with it. Do not use the current 402×874 raw breathing image as an App Store upload.

## CPP 3 — Voice Journal

**Internal name:** `cpp-voice-journal`

**Promo text:**

> When writing feels hard, speak your thoughts aloud and turn a voice reflection into a private journal practice.

**Screenshot order for v1:**

1. New composition — `Speak your mind freely` with the real voice-recording surface
2. New composition — `Keep a voice note ready to reflect on` with the real paused voice-recording state
3. `happy-app-store-screen-09` — Private reflection entry point with `Record Voice`
4. `happy-app-store-screen-10` — Home reflection entry point
5. `happy-app-store-screen-02` — Notice patterns over time
6. `happy-app-store-screen-01` — Keep the practice moving one lesson at a time

**Hypothesis:** Voice-journal traffic needs to see the microphone action and a controllable voice-note state before download; the existing privacy slide is useful as proof but is not a sufficient hero.

**Final assets:** `store/custom-product-pages/en-US/voice-journal/`

## Voice slides to capture

Use a seeded demo account and fictional content only. Export both 6.7-inch and 6.5-inch versions using the same compositions as the existing US deck.

### Slide V1 — Speak your mind freely

- Headline: `Speak your mind freely`
- Supporting line: `Voice notes turned into clear reflections`
- Capture: Journal tab with the `Record Voice` action visible, then the active recording state with a readable waveform.
- Keep the real Happy UI and microphone affordance prominent. Do not show a generic waveform or generated app surface.

### Slide V2 — Keep a voice note ready to reflect on

- Headline: `Keep a voice note ready to reflect on`
- Supporting line: `Talk it out at your own pace`
- Capture: the real paused voice-recorder state, with the waveform, elapsed time, and resume/finish controls visible.
- A completed transcription/reflection state can replace this later after a deliberate test recording is approved for persistence and processing.

## App Store Connect setup

1. Create the three CPPs under App Store Connect → App Store → Custom Product Pages.
2. Add the matching promotional text and screenshot order from this document.
3. Submit all three for review with the release version whose UI was captured.
4. After approval, assign each generated CPP URL to its matching ASA ad group or social/creator destination.
5. Record the URL in the campaign tracker; Apple generates the final CPP identifier and URL.

## Measurement

Use the default US product page as the baseline. Wait for at least 1,000 product-page views per CPP before making a conversion decision, and also check onboarding completion, first exercise completion, trial start, purchase, and Day-7 return by campaign source. A CPP is successful only if it improves qualified conversion without degrading activation or paid retention.
