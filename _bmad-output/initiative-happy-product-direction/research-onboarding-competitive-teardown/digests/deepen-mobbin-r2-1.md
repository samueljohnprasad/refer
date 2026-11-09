# Deepen r2 — Mobbin paywall and progress screens

**Access date:** 2026-10-31. Run by lead after Mobbin MCP reconnected (subagents in r1 had no Mobbin access).

## Method and coverage

8 `search_screens` calls, iOS, mode standard: "mood tracker journal paywall", "meditation app paywall", "Finch paywall", "Duolingo streak freeze", "weekly goal progress tracker", "Headspace subscription screen", "Calm premium paywall", "mood insights locked premium". Every screen below was visually inspected. Mobbin exposes no capture dates — all observations are "observed in Mobbin", not verified against live App Store builds.

**Absence finding:** Finch, Daylio, Bearable, Rosebud, stoic., How We Feel returned no screens for paywall/premium queries ("Finch paywall" returned only other apps). Their paywall hero copy remains unobserved.

## Observations

### Paywall and trial mechanics

- **Headspace — "How your trial works"** [screen a9bf58c3]: timeline Today (unlock library) → In 12 days (reminder that trial is ending) → In 14 days (charged on date, "cancel anytime before"). 14 days free then $69.99/yr. Close X present, Restore Purchase link. Benefit copy is content: "library of meditations, sleep sounds, and more."
- **Headspace — cancellation flow** [c995f167, ab864429, aa9503b0]: reason survey ("I don't use Headspace enough", "It costs too much"), save offer 50% off, and explicit "you'll still be able to use Headspace until Sep 1, 2025" with "Continue with cancellation" always visible. Value list "Here's what your mind gets" = meditations, sleepcasts, music, videos, workouts — all content.
- **Calm** [ef1a6269, fe887a6f]: lock icons on content tiles in Home; dedicated Premium tab; Calm Sleep upsell ($19.99/yr) shows an Insights chart preview. Profile shows Mindful Days / Total Sessions / Longest Streak as stats, not a front-page streak.
- **Brilliant** [4769fa19] (adjacent: learning): "Unlock Premium with a 7 day free trial", "You won't be charged until after your free trial ends", auto-renew stated, "Cancel anytime in the App Store", X dismiss.
- **Cal AI** [e145982d], **Bevel** [87ac5af9], **BitePal** [19ffa622] (adjacent: health): trial length + billed amount + renewal shown under CTA; Bevel leads benefit list with AI coach then "Contextual Intelligence — insights"; BitePal leads with discount framing ("Claim 50% off now").
- **Savee** [6ebca455] (adjacent): lapse screen "Your plan expired — Everything you saved is right where you left it." Reassures saved data survives lapse.

### Insight gating

- **WHOOP — Behavior Insights** [95391958]: "Keep logging to unlock — record at least 5 yes's and no's in your journal to see how behaviors impact your Recovery." Per-behavior progress bars; honest non-result copy: "Unable to identify a significant impact. Please keep logging responses." Insight gated by **data sufficiency (count)**, not consecutive days.
- **Ahead** (mental-health) [16c5628d]: "My Emotion Profile — Reach 7-day streak to unlock… Hit a 7 day streak to uncover your patterns, triggers and personality traits. Streak days logged: 2/7." Insight gated by **consecutive daily streak**.

### Progress mechanics

- **Duolingo** [fbef2d10, f6675d16, others]: week row with a frozen day (ice icon) inside a 6-day streak — freeze shown inline; "Tomorrow makes 7 days" + "I'M COMMITTED" CTA; Streak Goal milestone bar (1 → 3 → 5…); "Streak Society" unlock at 7 days; Friend Streaks with invites.
- **WHOOP — Plan overview** [6a60b3ef]: weekly ring "0/7", per-day circles, "Your current average for this week is 5:55" — weekly accumulation framing with averages, misses shown neutrally.
- **Cal AI** [61178e40]: "Day Streak" + badge count on Progress tab.

## Claims

| # | claim | source | publisher | pub_date | accessed | confidence | class |
|---|---|---|---|---|---|---|---|
| M1 | Headspace shows a 3-step trial timeline (unlock today, reminder day 12, charge day 14) with "cancel anytime" before purchase | https://mobbin.com/screens/a9bf58c3-250a-4565-9808-c4722933ea54 | Mobbin (Headspace capture) | unavailable | 2026-10-31 | medium | paywall-mechanics |
| M2 | Headspace cancellation states access continues until the paid period ends and keeps "Continue with cancellation" visible beside a 50% save offer | https://mobbin.com/screens/c995f167-095b-40b4-b8e1-13e2a3c54cc1 | Mobbin (Headspace capture) | unavailable | 2026-10-31 | medium | paywall-mechanics |
| M3 | Headspace's subscription value list is entirely content (meditations, sleepcasts, music, videos, workouts) | https://mobbin.com/screens/ab864429-6dbb-4259-b2ca-48debdc4a81b | Mobbin (Headspace capture) | unavailable | 2026-10-31 | medium | positioning |
| M4 | Calm gates content with lock icons on tiles and keeps streak as a profile stat | https://mobbin.com/screens/ef1a6269-491a-47c4-8056-4001889880bd | Mobbin (Calm capture) | unavailable | 2026-10-31 | medium | feature-gating |
| M5 | WHOOP gates behavior insights on a minimum count of journal entries (≥5 yes/no) and shows honest "no significant impact" results | https://mobbin.com/screens/95391958-b83f-4e49-a5e7-4bd6da98ac3a | Mobbin (WHOOP capture) | unavailable | 2026-10-31 | medium | feature-gating |
| M6 | Ahead gates its Emotion Profile insights on a 7-day consecutive streak | https://mobbin.com/screens/16c5628d-f890-4c07-b647-83d9a8c04093 | Mobbin (Ahead capture) | unavailable | 2026-10-31 | medium | feature-gating |
| M7 | Duolingo shows streak freezes inline in the week row and adds milestone goals and a 7-day society reward | https://mobbin.com/screens/fbef2d10-7767-41e4-8a9f-825e022ead13 | Mobbin (Duolingo capture) | unavailable | 2026-10-31 | medium | competitor-feature |
| M8 | WHOOP frames plan progress as weekly counts (0/7) with a weekly average | https://mobbin.com/screens/6a60b3ef-32e9-4a59-80a4-bc1a1db61685 | Mobbin (WHOOP capture) | unavailable | 2026-10-31 | medium | competitor-feature |
| M9 | A lapse screen can reassure that saved data persists ("Everything you saved is right where you left it") | https://mobbin.com/screens/6ebca455-a73e-4271-8aad-8df17ab7223e | Mobbin (Savee capture, adjacent category) | unavailable | 2026-10-31 | medium | paywall-mechanics |

## Leads

- WHOOP count-threshold vs Ahead consecutive-streak gating is a direct contrast for Happy's "pattern insights after enough data" rule.
- Headspace trial timeline + cancellation honesty answers the billing-trust complaints in the user-voice digest.

## Not found

Paywall screens for Finch, Daylio, Bearable, Rosebud, stoic., How We Feel. Any Mobbin capture date.
