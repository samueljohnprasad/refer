# Independent verification: monetization and notification claims

**Access date for every source:** 2026-10-30  
**Scope:** Live-source spot-check of the six named load-bearing claims in `2026-10-30-monetization-user-voice.md`. Statuses verify the digest's precise wording; they do not turn observational benchmarks into causal product forecasts.

## Verdicts

### 1. RevenueCat hard-paywall 10.7% versus freemium 2.1%

**Status: VERIFIED.** RevenueCat labels the comparison **“Day 35 download-to-paid freemium vs. hard paywall”** and reports medians of **10.7%** and **2.1%**, respectively. Its metric definition is the share of installs producing at least one paid subscription within 35 days. The methodology describes aggregated performance data from RevenueCat-integrated apps meeting activity thresholds, with medians and percentiles; it does not describe random assignment of access model. The digest is therefore correct to call this a D35 observational association.

- **Publisher:** RevenueCat
- **Publication date:** 2026-03-19; publisher page updated 2026-04-22
- **Direct URL:** https://www.revenuecat.com/state-of-subscription-apps
- **Access date:** 2026-10-30
- **Exact mismatch:** None in the digest. A causal or “upfront paywall-view conversion” restatement would be wrong: the denominator is installs, the observation window is 35 days, and access model was not experimentally assigned.

### 2. Health & Fitness trial starts on Day 0

**Status: VERIFIED.** RevenueCat reports **82.1% of Health & Fitness trial starts on Day 0** in its time-to-trial-by-category chart.

- **Publisher:** RevenueCat
- **Publication date:** 2026-03-19; publisher page updated 2026-04-22
- **Direct URL:** https://www.revenuecat.com/state-of-subscription-apps
- **Access date:** 2026-10-30
- **Exact mismatch:** None in the digest. “Day 0” is calendar/cohort timing after download; RevenueCat does not define it as “the first session.” Adapty's independent 2026 dataset directionally corroborates the front-loading, reporting about 90% of trial starts on Day 0, but does not independently reproduce the category-specific 82.1% figure: https://adapty.io/state-of-in-app-subscriptions-report/ (Adapty, updated 2026-03-13; accessed 2026-10-30).

### 3. Generic 85–92% “immediate churn”

**Status: VERIFIED as a category-error diagnosis; the legacy benchmark is OVERTURNED.** RevenueCat defines D35 download-to-paid as installs producing a paid subscription within 35 days. The arithmetic complement of the 10.7% hard-paywall median is 89.3%, but that is **not paid-subscriber churn**, and the 35-day window is not “immediate.” The closest immediate-cancellation statistic found is **55.4% of cancellations on three-day trials occurring on Day 0**.

- **Publisher:** RevenueCat
- **Publication date:** 2026-03-19; publisher page updated 2026-04-22
- **Direct URL:** https://www.revenuecat.com/state-of-subscription-apps
- **Access date:** 2026-10-30
- **Exact mismatch:** The claimed benchmark changes all three dimensions: installs become subscribers/cancellers, nonconversion becomes churn, and “within 35 days” becomes immediate. The 55.4% figure also cannot replace it because its denominator is cancellation events among three-day trials, not installs or all trial starters. No primary source supporting a generic 85–92% immediate-churn range was found in this check.

### 4. Typical refunds are not below 2%

**Status: VERIFIED.** RevenueCat reports most category medians at **3–4%**, category medians from **2.5% to 4.7%**, price-tier medians from **2.7% to 4.5%**, and access-model medians of **2.5% and 2.9%**. An independent Adapty dataset also points above 2%: its global all-category report shows **8.3%** under its own aggregation, while its US iOS refund guide reports a **2.71% median**. These vendors' denominators and aggregation methods are not fully interchangeable, but neither supports “below 2%” as a typical general baseline.

- **Publisher:** RevenueCat
- **Publication date:** 2026-03-19; publisher page updated 2026-04-22
- **Direct URL:** https://www.revenuecat.com/state-of-subscription-apps
- **Publisher:** Adapty
- **Publication date:** 2026 report, updated 2026-03-13
- **Direct URL:** https://adapty.io/state-of-in-app-subscriptions-report/
- **Access date:** 2026-10-30
- **Exact mismatch:** “Typical refunds below 2%” sits below RevenueCat's lowest listed segment median and below Adapty's reported median. Sub-2% results can exist in a distribution; they are not the reported central baseline.

### 5. Blinkist push opt-in from 6% to 74%

**Status: VERIFIED as a disclosed first-party case result; not independently replicated.** The author identifies herself as Blinkist's Senior Product Designer and describes a cross-functional Blinkist project. The article reports an A/B test and a final increase in push-notification opt-in from **6% to 74%**. The intervention was bundled: a clearer trial timeline, reminder messaging, a post-registration opt-in screen, and a notification two days before trial end. The article supplies none of the sample size, allocation, confidence interval, test duration for the experiment, or platform-specific result split.

- **Publisher:** Jaycee Day / UX Planet; first-party Blinkist team case study
- **Publication date:** 2021-01-19
- **Direct URL:** https://uxplanet.org/how-solving-our-biggest-customer-complaint-at-blinkist-led-to-a-23-increase-in-conversion-b60ad514134b
- **Accessible full-text mirror used for the gated body:** https://readmedium.com/how-solving-our-biggest-customer-complaint-at-blinkist-led-to-a-23-increase-in-conversion-b60ad514134b
- **Access date:** 2026-10-30
- **Exact mismatch:** None in the digest. It would be a mismatch to attribute the entire lift to prompt delay alone, or to present 6%→74% as a portable benchmark. The public report does not isolate the reminder prompt from the rest of the redesigned flow.

### 6. Platform guidance recommends contextual notification prompts

**Status: VERIFIED.** Apple says to make the explicit authorization request in a context that helps people understand why notifications are needed, giving “after the person schedules a first task” as an example and contrasting this with an automatic first-launch request. Android says to let users familiarize themselves with the app, trigger the prompt from a user action, and request permission in the context where its use is clear.

- **Publisher:** Apple Developer Documentation
- **Publication date:** Continuously maintained; no stable publication date shown
- **Direct URL:** https://developer.apple.com/documentation/usernotifications/asking-permission-to-use-notifications
- **Publisher:** Android Developers / Google
- **Publication date:** Last updated 2026-10-28 UTC
- **Direct URL:** https://developer.android.com/develop/ui/compose/notifications/notification-permission
- **Access date:** 2026-10-30
- **Exact mismatch:** None in the digest. Nuance: Apple permits provisional authorization at first launch because it does not show the explicit allow/deny prompt; that exception does not contradict its contextual guidance for explicit authorization.

## Verification summary

| Claim | Digest status after live check |
|---|---|
| 10.7% vs. 2.1% is observational D35 download-to-paid | Verified |
| 82.1% of Health & Fitness trial starts occur on Day 0 | Verified |
| 85–92% immediate churn is unsupported/category error | Verified; underlying legacy benchmark overturned |
| Typical refunds are not below 2% | Verified |
| Blinkist 6%→74% is a bundled first-party case with missing method detail | Verified, not independently replicated |
| Platform guidance recommends contextual notification prompts | Verified |

