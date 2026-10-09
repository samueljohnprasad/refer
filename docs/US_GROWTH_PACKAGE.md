# Happy US Growth Package

## Goal

Increase qualified App Store installs and sustainable Premium subscriptions without promising clinical outcomes or pressuring people in vulnerable moments.

## Positioning

**Core promise:** Practical CBT tools for anxious thoughts, in a daily practice that feels easier to keep.

**Audience:** Adults and young adults who feel stuck in overthinking, stress, or anxious thought loops and want a private, approachable way to reflect and practice useful skills.

**Why Happy:** It combines guided CBT journeys, short exercises, journaling, voice reflection, personal insights, and gentle gamification in one calm product.

**Do not lead with:** AI, long feature lists, outcomes, or comparisons to therapy. These are either supporting proof points or require evidence that is not stored in this repository.

## App Store Metadata

### Primary package

| Field | Copy | Count |
| --- | --- | ---: |
| Title | Happy: CBT Journal & Courses | 28/30 |
| Subtitle | Anxiety Tools & Mood Insights | 29/30 |
| Keywords | therapy,relief,stress,overthinking,breathing,mindfulness,diary,voice,panic,sleep,habit,selfcare,calm | 100/100 |
| Promotional text | Build practical CBT skills in 5 minutes a day. Journal your thoughts, use guided tools when stress rises, and notice patterns over time. | 136/170 |

The title is retained because it communicates brand, CBT, journaling, and courses. The subtitle replaces generic category language with a clearer benefit and keeps every keyword distinct from the title. The keyword field excludes all words already used in the title and subtitle.

### Product-page opening

> Happy makes CBT journaling easier to return to. Work with anxious thoughts through short guided journeys, practical exercises, and private reflection.

This opening is used in the staged `1.5.3` metadata file. It leads with the job a user hires Happy for, then the mechanisms that make it distinct.

## Custom Product Pages

Use one message per paid campaign. Each page should direct a user to the most relevant in-app destination only if a verified deep link is available.

| Page | Audience intent | Hero copy | First three screenshots | Campaign use |
| --- | --- | --- | --- | --- |
| CBT Journeys | “CBT exercises”, “thought reframing” | Learn skills for the thoughts that keep looping. | Journey map; thought reframing; first small win. | Apple Search Ads exact and discovery campaigns for CBT intent. |
| Anxiety Tools | “anxiety relief”, “breathing exercise”, “grounding” | A small tool for the moment your mind feels loud. | Coping tool; breathing or grounding; personal practice history. | Apple Search Ads and short-form creator content. |
| Voice Journal | “voice journal”, “talk through feelings” | When writing feels hard, talk it out. | Voice capture; reflection; private journal timeline. | Apple Search Ads and creator demonstrations. |

Do not use an App Store Custom Product Page until its screenshots, localization, and deep link have been reviewed in App Store Connect.

## Screenshot Sequence

The default page should make one promise at a time.

1. **CBT Made Simple & Playful** — guided journey is the differentiator.
2. **Break Thinking Traps** — show a real, understandable reframe.
3. **A Tool for Anxious Moments** — show a coping exercise in context.
4. **Speak Your Mind Freely** — introduce voice journaling.
5. **See Your Patterns Over Time** — show insights only after the user understands the practice.
6. **Build a Habit, Gently** — use streaks as encouragement, not pressure.

The remaining slots can cover handwriting capture, deeper insights, privacy information that is verified, and a calm invitation to start. The first three screenshots are the conversion-critical set.

See [US Screenshot Production Brief](./US_SCREENSHOT_PRODUCTION_BRIEF.md) for the approved first-three sequence, capture states, and creative QA.

## Subscription Message

### Paywall hierarchy

1. **Headline:** Keep building tools for the moments that feel hard.
2. **Value:** Continue your guided journey, unlock the full CBT toolkit, and get more from your reflections.
3. **Proof:** Show the next locked lesson or insight the person has already earned context for.
4. **Offer:** State trial length, full renewal price, and billing cadence exactly as configured in the active offering.
5. **Control:** Keep restore and free-path actions visible.

### Approved value language

- Continue your guided journey
- Unlock more CBT exercises
- Get more from your reflections
- Keep your practice moving at your own pace

### Language to hold until verified

- “App of the Day”
- “3 in 4 sleep better”
- “Designed by mental health experts”
- “100% private and protected”
- “30-day full refund”
- Specific journey or exercise counts

## Acquisition Plan

### Week 1: measurement and listing readiness

- Record current App Store impression, product-page-view, download, trial, paid conversion, and annual-plan baselines.
- Submit the primary metadata package only after confirming the 1.5.3 release version and legal URLs.
- Finish the first three default screenshots before expanding localizations.

### Weeks 2–3: intent-led traffic

- Start three Apple Search Ads groups aligned to the Custom Product Pages: CBT journeys, anxiety tools, and voice journal.
- Use exact-match high-intent terms first. Keep broad discovery separated so it cannot dilute learning.
- Send creator content to the matching App Store page; demonstrate one use case per video.

### Week 4: conversion learning

- Compare product-page conversion by page and campaign intent.
- Compare onboarding completion, first exercise completion, paywall view, trial start, purchase, and Day-7 return by acquisition source.
- Expand only the message that improves paid conversion without harming activation or early retention.

See [Apple Search Ads Launch Plan](./APPLE_SEARCH_ADS_LAUNCH.md) for the initial campaign structure, keyword clusters, exclusions, and launch gates.

## Event Schema

| Funnel stage | Event or metric | Decision it supports |
| --- | --- | --- |
| Store | Search impression, product-page view, download | Which keyword and creative attract qualified traffic. |
| Onboarding | onboarding_started, onboarding_completed | Whether campaign promise matches the first-run experience. |
| Activation | first_exercise_completed, first_journal_created | Whether installs reach a meaningful first win. |
| Monetization | paywall_viewed, trial_started, purchase_completed | Whether the Premium message converts after value is understood. |
| Retention | Day-1 return, Day-7 return, trial-to-paid, renewal | Whether paid growth is sustainable. |

Use the existing onboarding analytics and RevenueCat purchase events. Validate final event names and delivery before making decisions from them.

## Release Checklist

- [ ] Confirm every feature and claim in the screenshots exists in the released build.
- [ ] Confirm the trial, price, renewal, restore path, and legal links against the active RevenueCat offering and App Store Connect.
- [ ] Confirm final screenshot copy and the first three screenshots for the US product page.
- [ ] Verify metadata character limits and keyword duplication before upload.
- [ ] Establish a baseline before running campaigns or a Product Page Optimization test.
