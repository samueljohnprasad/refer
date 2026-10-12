# Signup drop-off funnel

Use this funnel in PostHog to evaluate the onboarding account prompt.

## Funnel steps

Create a unique-user funnel with these steps in order:

1. `onboarding_started`
2. `onboarding_completed`
3. `signup_sheet_viewed` where `source` is `onboarding`
4. `signup_auth_succeeded` where `source` is `onboarding`
5. `journal_entry_saved`

Set the conversion window to 7 days. Use the same window for every comparison.

## Breakdowns

Break down the funnel by:

- `provider` on `signup_provider_tapped` and `signup_auth_succeeded`
- `copy_variant` on signup events
- `source` on signup events
- country or app locale
- app version

Do not send journal text, mood values, onboarding answers, or other reflective content as event properties.

## Supporting events

Use these events to explain signup loss:

- `signup_provider_tapped`
- `signup_skipped`
- `signup_sheet_dismissed`
- `onboarding_skipped`
- `onboarding_step_viewed`
- `onboarding_step_completed`

## Decision rule

The primary win is not signup rate alone. Prefer a change when it increases `journal_entry_saved` within 7 days without reducing onboarding completion or increasing signup failures.

Compare:

- onboarding completion rate
- signup sheet to successful auth rate
- successful auth to journal save rate
- skipped signup to journal save rate
- Day-1 and Day-7 retention for authenticated versus skipped users
