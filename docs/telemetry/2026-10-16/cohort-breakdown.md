# Geographic & Cohort Analysis (Real Devices Only)

> **Timeline Date**: 2026-10-16  
> **Source**: PostHog HogQL Query on Project 236166 (Filtered: `$is_emulator = false` / real hardware identifiers)

---

## 1. Geographic Cohort Distribution

```
United States  ██████████████  7 users (36.8%)
Brazil         ████            2 users (10.5%)
China          ████            2 users (10.5%)
Hong Kong      ██              1 user  (5.3%)
Singapore      ██              1 user  (5.3%)
Taiwan         ██              1 user  (5.3%)
Iran           ██              1 user  (5.3%)
Other Intl     ████████        4 users (21.0%)
---------------------------------------------
Total Real Physical Devices:   19 users
```

---

## 2. Cohort Forensics

### 🇺🇸 United States (7 Users)
* **Apple App Store Reviewer (Cupertino, CA)**:
  * Hardware: iPhone physical device (Apple corporate ASN).
  * Behavior: Completed Steps 0–5 cleanly in 42 seconds. Reached Step 6 (`lesson_complete`) and Step 7 (`pact_signing`).
  * The Loop: Pressed the back button from `pact_signing` back to `lesson_complete`, then re-advanced, repeating this 4 times across 3 minutes before force-closing the app.
  * Root Cause: Lack of intuitive forward affordance on hold-to-commit button; back button was accessible when it should have been locked to complete the stage.
* **General US Consumer Users (6 Users)**:
  * 4 entered onboarding; 2 converted trial; 2 dropped at paywall.

### 🇧🇷 Brazil (2 Users)
* Both users completed entire onboarding flow.
* Portuguese localization (`pt`) rendered correctly without text overflow or layout break.
* 1 user converted 7-day trial on `soft_paywall`.

### 🇨🇳 China (2 Users — Shanghai & Guangzhou)
* **Fatal Great Firewall (GFW) Block**:
  * Both users opened the app and triggered `supabase.auth.getSession()` and `signInAnonymously()`.
  * The network request to Supabase timed out after 10,000ms with `AuthRetryableFetchError`.
  * Result: `AuthNetworkErrorScreen` mounted immediately. Because the screen only featured "Retry Connection", both users tapped retry once, failed again, and permanently churned. Zero users reached onboarding.

### 🇭🇰 Hong Kong (1 User) & 🇹🇼 Taiwan (1 User)
* High network reliability, zero connection errors.
* Both completed Steps 0–5 (motivation, daily goal, experience).
* Both abandoned session at Step 8 (`soft_paywall`) after spending 15–20 seconds viewing the pricing tiers.

### 🇸🇬 Singapore (1 User)
* Completed full onboarding.
* Tapped "Continue with Apple", successfully authorized via Face ID, and converted to registered Supabase user.

### 🇮🇷 Iran (1 User)
* Intermittent high latency on video asset downloads (`onboarding-welcome-panda.mov`), but successfully completed onboarding quiz.

---

## 3. Key Evolution Targets for Next Timeline Audit

1. **China Offline Conversion**: Monitor `onContinueOffline` tap events to confirm users in mainland China can enter guest mode without network aborts.
2. **Reviewer Pass-Through**: Zero loop events between `lesson_complete` and `pact_signing`.
3. **Paywall Exit Rate**: Verify that the newly added close button converts abandoned paywall views into active free users instead of app exits.
