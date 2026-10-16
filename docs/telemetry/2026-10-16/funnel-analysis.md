# Onboarding & Auth Funnel Forensics (Real Devices Only)

> **Timeline Date**: 2026-10-16  
> **Sample Size**: 10 Real Users Reached Onboarding

---

## 1. Onboarding Step Conversion Funnel

```
Step 0: Welcome                 [10 users]  100%
Step 1: Motivation Quiz         [10 users]  100%
Step 2: Stress Level Quiz       [10 users]  100%
Step 3: Daily Goal              [10 users]  100%
Step 4: Journey Synthesis       [10 users]  100%
Step 5: Personalized Plan       [10 users]  100%
Step 6: Micro-Lesson Complete   [10 users]  100%
Step 7: Pact Signing            [ 9 users]   90%  (-1 user / Cupertino Loop)
Step 8: Soft Paywall            [ 7 users]   70%  (-3 users / Trap Drop-off: 42.8%)
Step 9: Home Completion         [ 4 users]   40%
```

---

## 2. Friction Point Deep Dives

### 🚨 Friction Point A: The Soft Paywall Drop-off (42.8% Loss)
* **Observed Data**: 7 real users reached `soft_paywall`. Only 4 converted trial or advanced. 3 users force-closed the app.
* **Forensics**:
  * The screen rendered `RevenueCatUI.Paywall`.
  * The header was hidden (`visible: false`), and `showContinueButton: false` disabled the bottom footer.
  * Because RevenueCat V2 native paywalls ignore the JS-side `displayCloseButton: true` option unless explicitly exposed by the native sheet header, users who did not want to buy immediately were **trapped with zero dismissal affordances**.
* **Fix Implemented on 2026-10-16**:
  * Un-hid `OnboardingHeader` on `soft_paywall`.
  * Set `backButtonVariant: "close"` with a prominent "✕" icon.
  * Wired `onClose` callback to `updateTrialStarted(false)` and `goNext()`. Users can now decline and continue into the product for free.

---

### 🚨 Friction Point B: The Pact Signing "Hold-to-Commit" Loop
* **Observed Data**: Apple reviewer device from Cupertino hit Step 7 (`pact_signing`), hit back to Step 6 (`lesson_complete`), and repeated 4 times across 180 seconds.
* **Forensics**:
  * The button required holding down for 1,200ms to fill progress animation.
  * Rapid taps caused the progress bar to reset to 0 with no clear explanation.
  * Reviewer hit the active back button to restart, assuming the button was broken or unresponsive.
* **Fix Implemented on 2026-10-16**:
  * Disabled back button on `pact_signing`.
  * Added tap-completion fallback: single tap triggers rapid 250ms completion animation so quick taps never get ignored.
  * Added accessibility VoiceOver trigger support (`onPress={onPressOut}`).

---

### 🚨 Friction Point C: Apple Sign-In Abandonment (60% Loss)
* **Observed Data**:
  * `signup_provider_tapped (apple)`: 5 events
  * `signup_auth_succeeded (apple)`: 2 events
  * Abandonment / Failure Rate: 60%
* **Forensics**:
  * Bottom sheet height was capped at 245pt on iOS. On standard iPhone screen resolutions with default Dynamic Type, the Google button was cut in half and the "Maybe later" skip button was completely hidden below the fold.
  * When users cancelled the native Apple ID modal or experienced a connection timeout, the app gave zero toast feedback or error messaging, leaving them confused.
* **Fix Implemented on 2026-10-16**:
  * Increased default bottom sheet detent heights to 320pt (normal) and 410pt (account conflict / recovery).
  * Defaulted `showSkipButton = true` ("Maybe later") so users are never trapped.
  * Added error toasts and telemetry tracking for `signup_auth_cancelled`, `signup_auth_failed`, and `signup_account_conflict_detected`.
