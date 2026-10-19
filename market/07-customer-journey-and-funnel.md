# 07 — Customer Journey & Funnel Strategy

> **Target App**: Happy (`com.samuelprasad.happy` • Apple ID: `6755650433`)  
> **Source Telemetry**: PostHog Physical Cohort Data ([`docs/telemetry/2026-10-16/`](file:///Users/samuelprasad/Desktop/happy/journals/docs/telemetry/2026-10-16/))  
> **Target Conversion Standard**: Duolingo-style activation $\rightarrow$ Finch-tier D30 retention ($>30\%$) $\rightarrow$ RevenueCat trial conversion ($>45\%$)

---

## 1. End-to-End Customer Journey Map

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ STAGE 1: THE ACUTE TRIGGER (Pre-App)                                                             │
│ • User experiences late-night catastrophizing, work burnout, or therapy unaffordability.          │
│ • Searches App Store: "CBT Journal", "Thought Diary", "Anxiety Relief".                          │
└─────────────────────────────────┬────────────────────────────────────────────────────────────────┘
                                  │
┌─────────────────────────────────▼────────────────────────────────────────────────────────────────┐
│ STAGE 2: STOREFRONT CONVERSION (App Store)                                                       │
│ • Screenshot Slot 1: Happi the Panda waving + "CBT Made Playful & Simple".                       │
│ • Value Promise: "3-minute daily journeys to tame runaway thoughts."                             │
│ • Conversion Rate Target: 8.5% (Store view to install).                                          │
└─────────────────────────────────┬────────────────────────────────────────────────────────────────┘
                                  │
┌─────────────────────────────────▼────────────────────────────────────────────────────────────────┐
│ STAGE 3: THE 90-SECOND FIRST RELIEF (Onboarding)                                                 │
│ • Anonymous Supabase session established instantly (zero login wall).                            │
│ • 2-tap intake: Focus area (Anxiety/Overthinking) + Stress level.                                │
│ • "Building Your Custom Plan..." animated checklist (perceived personalization value).            │
│ • First interactive cognitive reframe with Happi: Physical tension drops < 90 seconds.           │
└─────────────────────────────────┬────────────────────────────────────────────────────────────────┘
                                  │
┌─────────────────────────────────▼────────────────────────────────────────────────────────────────┐
│ STAGE 4: THE TRUST-BACKED VALUE GATE (Monetization & Auth)                                       │
│ • Value-Backed Soft Paywall: "You felt the shift in 60s. Unlock full 14-day path."               │
│ • Mandatory "✕" Close Button: Non-buyers continue free without friction.                          │
│ • Account Continuity: Apple Sign-In sheet with 320pt detent and prominent "Skip for now".        │
└─────────────────────────────────┬────────────────────────────────────────────────────────────────┘
                                  │
┌─────────────────────────────────▼────────────────────────────────────────────────────────────────┐
│ STAGE 5: CORE LOOP ACTIVATION (Day 1 – Day 7)                                                    │
│ • Home Dashboard shows 1 clear next action (Next 3-min lesson or 60s Coping Card).               │
│ • Core Loop: Learn (Lesson) ──► Practice (Tool) ──► Journal (Reflect) ──► Insight (Pattern).    │
│ • Push Notification at user's chosen hour: "Happi is ready for your 3-min check-in."            │
└─────────────────────────────────┬────────────────────────────────────────────────────────────────┘
                                  │
┌─────────────────────────────────▼────────────────────────────────────────────────────────────────┐
│ STAGE 6: LONG-TERM HABIT & REVENUE LOCK-IN (Day 7 – Day 30+)                                     │
│ • Day-5 Trial Expiration Notification: Transparent warning ("Your trial ends in 2 days").        │
│ • Weekly & Monthly Insights Engine: Narrative summary reveals cognitive distortion trends.       │
│ • Streak milestones ignite XP rewards in Rewards Shop.                                           │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Funnel Stage Matrix

| Stage | User Mindset / Intent | Primary Touchpoint | User Objection | Solution / Content Needed | Primary CTA | Benchmark Target |
|---|---|---|---|---|---|---|
| **1. Search** | "I can't sleep. My mind won't stop spiraling." | App Store Search & Custom Product Pages | "Is this another boring medical form or meditation app?" | Visual preview of 3D Duolingo path + Happi mascot. | **GET (Install)** | **8.5% CVR** |
| **2. Intake** | "Please don't make me fill out a 20-page questionnaire." | Welcome Splash & 2-Question Motivation Quiz | "How long is this going to take?" | Top segmented progress bar + 1-tap option cards. | **"LET'S BEGIN"** | **100% Completion** *(Observed)* |
| **3. Reframe** | "Does this app actually do anything right now?" | Interactive Thought Catcher preview | "Reading text doesn't stop my panic." | 1-tap before/after cognitive restructuring swap. | **"REFRAME WITH HAPPI"** | **95% Completion** |
| **4. Paywall** | "I'm not paying $80 before I see if this works." | RevenueCat V2 Soft Paywall | "Will I be trapped or charged without my consent?" | Clear "7-Day Free Trial", prominent "✕" dismiss button. | **"START 7-DAY FREE TRIAL"** | **45% Trial Start** |
| **5. Auth** | "I don't want to create an account yet." | `SignInBottomSheet` (Apple / Google) | "Why do they need my email?" | "Save your progress across devices" + prominent "Skip for now". | **"CONTINUE WITH APPLE"** | **40% Link / 60% Skip** |
| **6. Day-1 Return** | "Oh yeah, I downloaded that app yesterday." | Scheduled Push Notification | "I don't have time today." | "Happi has your 3-min anxiety lesson ready." | **Open App** | **45% D1 Retention** |
| **7. Day-7 Trial Conv** | "Did this app provide real value this week?" | In-App Weekly Summary Card | "Is it worth the annual price?" | Weekly Mood Volatility & Top Distortion Insights report. | **Maintain Subscription** | **65% Paid Conversion** |

---

## 3. Touchpoint & Leakage Forensics (PostHog Real Data)

Based on physical device telemetry across 19 physical devices, three critical funnel leaks were identified and resolved:

```
[ Step 0-6: Intake & Plan ] ──► [ Step 7: Pact Signing ] ──► [ Step 8: Soft Paywall ] ──► [ Step 9: Home ]
        100% Pass                     90% (-10%)                   57.2% (-42.8%)              40% Net
```

### Leak 1: The Soft Paywall Trap (-42.8% Drop-off)
* **Root Cause**: RevenueCat native modal rendered with hidden header and no bottom dismiss button. Non-purchasing users were trapped and force-closed the app.
* **Resolution**: Added permanent dismissible "✕" close header on `soft_paywall` step. Declining trial seamlessly advances user into Home as free user.

### Leak 2: Apple Sign-In Bottom Sheet Detent Clipping (-60% Auth Abandonment)
* **Root Cause**: Modal height was hardcoded at 245pt. On standard iPhones, the Google button was cut in half and "Maybe later" was invisible below the fold.
* **Resolution**: Increased detent heights to 320pt (standard) and 410pt (recovery). Defaulted `showSkipButton = true`.

### Leak 3: Cupertino Reviewer Pact Signing Loop (-10% Drop-off)
* **Root Cause**: Hold-to-commit required continuous 1,200ms press. Rapid taps reset progress bar, prompting Apple reviewer to hit back button in an endless loop.
* **Resolution**: Single tap now triggers smooth 250ms completion animation; disabled back button on pact step.

---

## 4. Retention & Habit Architecture: The Push Notification Engine

Push notifications are the #1 driver of D1 $\rightarrow$ D7 return rates in self-care apps.

1. **Permission Timing**: Requested on Step 9 of Onboarding (immediately after Plan Reveal, *never* on cold launch).
2. **Contextual Hook**: "When can Happi check in with you tomorrow?"
   * **Morning (8:00 AM)**: "Set daily calm intention (2 min)"
   * **Afternoon (1:00 PM)**: "Mid-day reset & stress check"
   * **Evening (8:00 PM)**: "Unwind runaway thoughts before sleep"
3. **Notification Copy Rules**:
   * ✅ *"Happi is ready. 3 minutes to clear your mind before bed."*
   * ❌ *"You haven't logged your mood today! Don't lose your streak!"* (Banned: causes anxiety).

---

## 5. Funnel Optimization Experiments Backlog

| Priority | Hypothesis | Implementation | Success Metric |
|:---:|---|---|---|
| **P0** | Adding a "Day 5 Trial Expiration Reminder" push notification reduces involuntary cancellations and chargebacks. | Schedule local notification 48 hours before trial converts: *"Your trial ends soon. Manage your subscription anytime in Settings."* | +12% post-trial retention; -35% refund requests. |
| **P1** | Offering an annual discount to free-tier users on Day 7 increases LTV without cannibalizing onboarding revenue. | Display [`PostTrialDiscountBanner.tsx`](file:///Users/samuelprasad/Desktop/happy/journals/src/components/premium/PostTrialDiscountBanner.tsx) (30% off annual) on Day 7 for active non-subscribers. | +8% free-to-paid conversion. |
| **P2** | Dynamic Island & Lock Screen Live Activity for Box Breathing increases daily tool usage. | Implement 4-4-4-4 breathing timer on iOS Lock Screen widget. | +22% repeat exercise sessions per week. |

---

## 6. Specialist Handoff Protocols

* **ASO & Creative Team**: Align Screenshot 1 headline with Funnel Stage 1 search intent: `"CBT Made Playful: 3-Minute Daily Reframes"`.
* **Frontend Engineering**: Ensure `ensureAnonymousSession()` never blocks UI render on poor network connections (offline guest fallback active).
* **CRM & Lifecycle Marketer**: Trigger weekly narrative summary email / in-app notification every Sunday evening at 7:00 PM local time.
