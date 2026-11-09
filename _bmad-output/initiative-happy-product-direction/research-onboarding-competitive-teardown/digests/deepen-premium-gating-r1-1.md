# Deepen: premium gating teardown — round 1 digest
Accessed 2026-10-31. One round run; 20/20 tool calls used, so no round 2.

## Method & coverage
- Mobbin MCP (`mcp__mobbin__search_screens` / `search_flows`) was NOT available in this session's toolset. No paywall screens were examined. **Paywall hero copy / first-listed benefit could not be observed for any app** — every "lead benefit" below is inferred from what the vendor's own help/FAQ docs list as the premium differentiator, not from the paywall screen. Treat "lead" classifications as medium-to-low.
- Web: 12 WebSearch + 8 WebFetch. Primary sources fetched successfully: Bearable support, Calm support, Headspace help, Finch help (subscribe article only). Failed fetches: Daylio FAQ (ECONNRESET), stoic help (404), rosebud.app/pricing and /llms.txt (404). Adapty paywall library had a Reflectly screenshot (captured 2023-11-12) but no transcribed copy.
- Freshness: almost no source carried a pub date ≤3 months. Prices below mostly come from search-snippet summaries of vendor/app-store pages or aggregators; flag as unverified-live.

## Per-app findings
| App | Free | Paid | Inferred lead premium benefit | Class |
|---|---|---|---|---|
| Finch | Core pet/self-care loop | Finch Plus: expanded journals & daily prompts, extra relaxation exercises, more customization (search snippet of help center; "Benefits of Finch Plus" article not fetched) | More guided content/prompts | content/journeys (low) |
| Headspace | Help center lists only off-app free resources (YouTube, podcast, articles, Netflix) after trial; aggregators still cite free "Basics" course — contradiction | Full library; trial 7d monthly / 14d annual (aggregators) | Full content library | content/journeys |
| Calm | Day 1 of programs, a few Sleep Stories, Breathe Bubble, some scenes; mood check-ins free (aggregator) | Daily Calm, 300+ Sleep Stories, full music, Masterclasses; 7+ day trial (vendor) | Full content library | content/journeys |
| stoic. | Basic journaling | Premium: more question sets, trend data, PIN lock, iCloud sync. Premium+AI: personalized prompts, smart notifications, reflective analysis (search snippet of help + App Store) | Two-tier: content+sync, then AI analysis | content + AI (low) |
| Rosebud | Free journaling | Bloom ($12.99/mo, $107.99/yr): long-term memory, Ask Rosebud, weekly reports, personality insights, voice; "connect today's entry to your history / patterns across months" premium-only (third-party reviews) | AI memory + pattern insights over history | AI/chat + insights |
| Bearable | Unlimited tracking of symptoms/mood/meds, 30-day trends & comparison graphs, calendar/timeline, CSV export (vendor) | Impacts tab (correlation reports), correlations grid, 60/90/365-day reports, unlimited goals/experiments/notes (vendor) | Correlation insights | insights/analytics |
| Daylio | Mood/activity logging & entries | Advanced stats, Year in Pixels, unlimited moods, 2000+ icons, PIN lock, auto backup, PDF export, templates, no ads; 7-day trial; $4.99/mo, $35.99/yr, $59.99 lifetime (search snippet of vendor FAQ; fetch failed) | Advanced stats (listed first among "most important") + backup | insights/analytics (+continuity) |
| Reflectly | Basic journaling + mood tracking | Full prompt library, personalized insights, advanced mood analytics, ad-free; 1-week trial (aggregators; app store) | Prompts + insights | mixed: content + insights (low) |
| Wysa | AI chatbot (free core) | Premium ~$99.99/yr: 150+ CBT exercises/tools, SOS/safety plan; Premium Plus ~$99.99/mo adds human coach (aggregators) | Guided CBT exercise library; human coach upsell | content/journeys (+human) |
| How We Feel | Everything: lessons, exercises, journaling, mood analysis — nonprofit, no IAP/ads/subscription (App Store/aggregator) | n/a | n/a | none (free) |
| Duolingo | Lessons with ads + energy limit; "Explain My Answer" made free Jan 2026 (third-party) | Super ($6.99/mo): no ads, unlimited energy. Max (~$30/mo): AI Video Call + Roleplay (third-party) | Super: friction removal; Max: AI | other (friction) / AI |

Pattern: journaling/history logging is free in every tracker/journal app checked (Bearable, Daylio, Reflectly, stoic., Rosebud, How We Feel). What gets gated is the *derived layer* — correlations/advanced stats/long-range trends (Bearable, Daylio, Reflectly, stoic. trends) or AI memory/analysis (Rosebud, stoic. AI tier). Continuity (backup/sync/export) is gated only as a secondary perk (Daylio backup/PDF, stoic. iCloud) and Bearable keeps CSV export free. Content-library apps (Calm, Headspace, Wysa, Finch) lead with more content.

## Claims
- {claim: Bearable free tier includes unlimited symptom/mood/medication tracking, 30-day trends, calendar/timeline, CSV export; Premium adds Impacts tab correlation reports, correlations grid, 60/90/365-day reports, unlimited goals/notes, source: https://bearable.app/support/common-questions/bearable-free-vs-premium-features/, publisher: Bearable, pub_date: unavailable, accessed 2026-10-31, confidence: high, class: feature-gating}
- {claim: Calm Premium unlocks Daily Calm, 300+ Sleep Stories, full music, Masterclasses; free has limited items; trial 7+ days, source: https://support.calm.com/hc/en-us/articles/360008536834, publisher: Calm, pub_date: unavailable, accessed 2026-10-31, confidence: high, class: feature-gating}
- {claim: Headspace full library unlocked during free trial; after trial only off-app free resources listed (YouTube, podcast, articles, Netflix), source: https://help.headspace.com/hc/en-us/articles/115008192928-What-s-included-for-free, publisher: Headspace, pub_date: unavailable, accessed 2026-10-31, confidence: medium (contradicts aggregators citing free Basics course), class: feature-gating}
- {claim: Headspace $12.99/mo with 7-day trial, $69.99/yr with 14-day trial, source: https://carepaths.com/headspace-pricing/, publisher: CarePaths (aggregator), pub_date: March 2026, accessed 2026-10-31, confidence: medium, class: pricing}
- {claim: Calm $14.99/mo or $69.99/yr, 7-day trial, source: https://carepaths.com/calm-app-pricing/, publisher: CarePaths (aggregator), pub_date: 2026, accessed 2026-10-31, confidence: medium, class: pricing}
- {claim: Daylio Premium: advanced stats, unlimited moods, 2000+ icons, reminders, PIN, PDF export, templates, auto backup, Year in Pixels; $4.99/mo, $35.99/yr, $59.99 lifetime; 7-day trial, source: https://daylio.net/faq/docs/daylio-faq/about/daylio-premium-features/ (snippet only; fetch failed), publisher: Daylio, pub_date: unavailable, accessed 2026-10-31, confidence: medium, class: feature-gating}
- {claim: Finch Plus adds expanded journals & daily prompts, extra relaxation exercises, more customization; monthly/yearly via app stores, source: https://help.finchcare.com/hc/en-us/articles/37780175015693-How-to-Subscribe-to-Finch-Plus (updated 2025-09-22; features from search snippet of help center), publisher: Finch, pub_date: 2025-09-22, accessed 2026-10-31, confidence: low-medium (older than 12mo-ish; features not fetched), class: feature-gating}
- {claim: stoic. Premium = more question sets, trend data, PIN, iCloud sync; Premium+AI adds personalized prompts, smart notifications, reflective analysis; $6.99/mo/$39.99/yr and $12.99/mo/$99.99/yr, source: https://apps.apple.com/us/app/stoic/id1312926037 + help.getstoic.com (snippets; fetch 404), publisher: stoic./Apple, pub_date: unavailable, accessed 2026-10-31, confidence: low-medium, class: feature-gating}
- {claim: Rosebud Bloom $12.99/mo or $107.99/yr; premium = long-term memory, Ask Rosebud, weekly reports, personality insights; cross-history pattern noticing is premium-only, source: https://blog.mylifenote.ai/rosebud-review/, publisher: Life Note (competitor blog), pub_date: 2026, accessed 2026-10-31, confidence: low-medium (competitor source; vendor page 404), class: feature-gating}
- {claim: Reflectly Premium = full prompt library, personalized insights, advanced mood analytics, ad-free; 1-week trial, source: https://makeheadway.com/blog/reflectly-review/, publisher: Headway (aggregator), pub_date: unavailable, accessed 2026-10-31, confidence: low, class: feature-gating}
- {claim: Reflectly paywall screenshot exists in Adapty library, captured 2023-11-12; IAP $4.99–$9.99/mo, $35.99–$59.99/yr, source: https://adapty.io/paywall-library/reflectly/, publisher: Adapty, pub_date: 2023-11-12 (capture), accessed 2026-10-31, confidence: medium (stale), class: paywall-mechanics}
- {claim: Wysa Premium ~$99.99/yr (150+ CBT exercises, SOS); Premium Plus ~$99.99/mo adds coach, source: https://www.choosingtherapy.com/wysa-app-review/, publisher: ChoosingTherapy (aggregator), pub_date: unavailable, accessed 2026-10-31, confidence: low, class: pricing}
- {claim: How We Feel is fully free (nonprofit; no IAP, ads, subscription), incl. mood analysis, source: https://apps.apple.com/us/app/how-we-feel/id1562706384, publisher: Apple App Store, pub_date: unavailable, accessed 2026-10-31, confidence: medium-high, class: positioning}
- {claim: Duolingo Super removes ads + energy limit; Max adds AI Video Call and Roleplay; Explain My Answer free since Jan 2026, source: https://nibble-app.com/blog/is-duolingo-max-worth-it, publisher: Nibble (third-party), pub_date: 2026, accessed 2026-10-31, confidence: low-medium, class: feature-gating}

## Leads worth chasing (round 2 / other agents)
- Mobbin: search_screens for each app's paywall to get actual hero copy — the core of Q1 is unanswered.
- Finch "Benefits of Finch Plus" and "Finch Plus Pricing" help articles (linked from subscribe article).
- Headspace contradiction: does in-app Basics remain free in 2026? Check App Store listing / headspace.com/subscriptions.
- Rosebud vendor pricing page (current URL unknown; /pricing 404) to verify insights-vs-memory gating from primary.
- stoic. help center (URL changed) for current tiering and whether trends are in base Premium or AI tier.
- Adapty / RevenueCat paywall libraries for Finch, Daylio, Bearable screenshots with capture dates.

## Looked for, not found
- Paywall hero/first-benefit copy for all 11 apps (no screen access).
- Dismissibility and onboarding-vs-in-app timing for any app.
- Any pricing/packaging change dated within the last 3 months; only Duolingo "Explain My Answer" free (Jan 2026, ~10 months, third-party) surfaced.
- Primary-source pricing for Rosebud, Reflectly, Wysa, stoic.
