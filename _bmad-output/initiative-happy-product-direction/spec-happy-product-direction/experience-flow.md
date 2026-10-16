# Happy Experience Flow

This companion defines when the existing Happy surfaces appear. It preserves the current feature set while keeping first use focused.

## First-time user

```text
Welcome
  -> silent anonymous Supabase session
  -> plain-language goal
  -> StarterPath preview
  -> one short lesson
  -> one linked CBT or coping practice
  -> one guided text reflection
  -> current-session feedback and reward
  -> Home
```

There is no separate guest mode and no signup wall before the first meaningful loop. Signup or login is an optional identity-linking action after activation or from account settings. It preserves the anonymous Supabase user id.

The first-time flow must not show the whole course catalog, all exercise categories, deep insight screens, a paywall, or notification permission before the user receives the first lesson-practice-reflection value. Optional setup can follow the first loop.

## Returning user

Home is the recurring coordinator. When a StarterPath is active, it exposes one dominant continuation action based on acknowledged progress:

- continue the next lesson;
- repeat a completed tool;
- complete the linked reflection;
- switch to another path without deleting preserved progress; or
- review an available activity summary or emerging pattern.

Journal prompts, mood check-ins, and direct navigation remain available as secondary actions; they do not compete with the active path's primary continuation.

The primary iOS shell keeps five direct destinations: Home, Journal, Insights, Journeys, and Exercises. Insights is the direct Notice destination, not a child route that users must discover through generic Tracking. Capture is launched from prominent add actions on Home and Journal rather than occupying a permanent primary destination.

The Exercises tab remains a direct library for CBT and coping tools. The Journeys tab remains a direct catalog and progress surface. The Journal tab remains the private reflection history, while capture is reached through the Home and Journal add actions.

## Existing surface map

| Surface | Role | Exposure |
| --- | --- | --- |
| Welcome and onboarding | Establish anonymous continuity and choose a first job | First launch, reduced to the activation loop |
| Journeys, course detail, journey map, journey flow | Structured mental-health education and progress | After activation or when the user explores another path |
| Exercises, exercise flow, CBT preview, coping cards | Direct and lesson-linked practice | After activation; linked practice appears in the first loop |
| Journal, journal entry, prompts, keyboard capture, voice capture | Private reflection and retrieval | Text reflection in the first loop; voice only after its release gate |
| Insights overview and deep dives | Time-bounded personal pattern read model | First-class primary destination after activation; insufficient-data state until thresholds pass |
| Home, rewards, achievements, challenges, XP history | Continuation and non-clinical engagement | Home after activation; secondary surfaces on demand |
| Notifications and reminders | Optional return support | After the first loop or from settings |
| Paywall | Premium catalog or limit boundary | Only after activation and only when premium content is selected |
| Settings and support | Account, preferences, language, reminders, help | On demand, not first-use flow |
| Legacy tracking routes | Existing compatibility surfaces | Not part of the primary first-use or navigation contract; not the only route to Insights |

## Recurring evidence

The durable product sequence is:

```text
practice_session_started
  -> practice_completed
  -> reflection_acknowledged
  -> structured_observation_projected
  -> readiness_state_updated
  -> next_action_refreshed
```

Retries keep the same practice session identity. Unsynced work is not counted as completed evidence. Immediate feedback describes only the current session. An activity summary requires 3 distinct completed practices in a rolling 7-day window. An emerging pattern requires 5 relevant structured observations across at least 3 distinct user-local days in a rolling 30-day window. Each ready insight shows its observation count and time window and uses non-diagnostic language.

## Product boundaries

The first loop is text-only, non-diagnostic, and free of a subscription wall. StarterPath lessons use canonical course content and progress rather than a duplicate learning state. Voice, photo, free-text AI narratives, high-risk interpretation, and unsupported health claims remain outside the core experience until their privacy, safety, retention, and release gates are verified.
