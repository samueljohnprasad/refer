# App Marketing Context: Happy

## App Overview
- **App Name:** Happy
- **App ID (Apple):** 6755650433 (Bundle ID: `com.samuelprasad.happy`)
- **App ID (Google Play):** `com.samuelprasad.happy`
- **Category:** Health & Fitness
- **Secondary Category:** Lifestyle / Medical
- **Platform:** iOS (iOS 26+ target architecture)
- **Price Model:** Freemium (Free core exercises + Premium subscription)
- **Launch Date:** Active
- **Current Version:** 1.5.3

## Value Proposition
- **Problem:** Millions struggle with anxiety, overwhelming thoughts, and negative mental loops, but traditional CBT worksheets feel dry, clinical, and difficult to stick to. Most mood apps only log raw numbers without teaching therapeutic skills or uncovering long-term patterns.
- **Target Audience:** Adults and young adults seeking accessible, structured, non-judgmental CBT tools, daily reflection, and anxiety management with high engagement.
- **Unique Differentiator:** "Calm meets Duolingo with deep health intelligence." 
  1. **Gamified CBT Journey Courses:** Interactive roadmaps, bite-sized lessons, checkpoints, XP chests, and panda mascot companions.
  2. **Multi-Timeframe Insights Engine:** Daily timeline breakdowns, Weekly mood trends, Monthly emotional pattern detection, and Yearly mental wellness rewind.
  3. **Multimodal Voice & Photo Journaling:** AI voice-to-reflection synthesis (Gemini 2.5 Flash STT) + photo OCR of handwritten journal notes.
  4. **Holistic Habit & Lifestyle Tracking:** Correlates daily mental states with nutrition, habits, and coping mechanisms.
- **Elevator Pitch:** Happy turns practical CBT journaling into short, guided journeys for working with anxious thoughts and building a steadier daily practice.

## Competitors
| App | App ID | Strengths | Weaknesses |
|-----|--------|-----------|------------|
| MindShift CBT | 634690188 | Trusted clinical backing, free tools | Dated UI, clinical tone, no courses or long-term trend insights |
| Finch: Self Care Pet | 1528665409 | Hyper-gamified, beloved mascot, strong retention | Lacks deep clinical CBT course progression, shallow analytics |
| Headspace | 493145008 | Huge brand awareness, rich audio library | High price, passive meditation rather than CBT thought restructuring |
| Daylio Journal | 1194023242 | Fast micro-entry mood tracking | Pure logging, no therapeutic course curriculum or guided CBT reframing |
| Fabulous: Daily Habit Tracker | 1203637303 | Strong journey-based coaching | Overwhelming notifications, heavy paywall pressure, not CBT-focused |

## Current ASO State
- **Title:** Happy: CBT Journal & Courses (28/30 chars)
- **Subtitle:** Gamified Mental Health & Mood (29/30 chars)
- **Keyword Field:** Version-scoped metadata is current through 1.5.2; the 1.5.3 package is staged locally.
- **Ratings and Keyword Rankings:** Not verified in this repository. Do not present targets as live performance.
- **Primary Search Intent:** CBT journaling, anxiety tools, thought reframing, voice journaling, mood insights.

## Goals & KPIs
1. **Qualified downloads:** Increase App Store search impressions, product-page conversion, and installs for CBT and anxiety-management intent.
2. **Subscriptions:** Increase first paywall view, trial start, trial-to-paid, and annual-plan selection without lowering early activation.
3. **Activation and retention:** Protect onboarding completion, first exercise completion, Day-1 return, Day-7 return, and paid retention while optimizing acquisition.

Record current baselines before setting targets. The repository does not contain verified ranking, rating, or conversion data.

## Resources & Constraints
- **Budget:** Organic ASO plus small Apple Search Ads campaigns.
- **Team:** Agile product & engineering team.
- **Stack:** Expo / React Native, Supabase, Gemini 2.5 Flash STT, NativeWind.
- **Design Language:** Physical 3D buttons, Nunito typography, cheerful panda mascot, zero decorative UI slop.

## Markets
- **Primary:** United States (US), Canada (CA), United Kingdom (GB), Australia (AU)
- **Secondary (Metadata Live / Staged):** Germany (DE), France (FR), Japan (JA), South Korea (KO)
- **Languages:** English (US, GB, CA, AU), French (FR, CA), German (DE), Japanese (JA), Korean (KO), Spanish (MX multiplier)

## Marketing Claim Rules

- Promote only capabilities that are available in the released build.
- Do not use outcome statistics, awards, expert endorsements, encryption guarantees, or refund promises without current evidence and owner approval.
- Keep health-language educational and supportive. Happy helps people practice CBT tools; it does not diagnose, replace professional care, or promise clinical outcomes.

## 10-Slot Storyboard Summary

| Slot | Headline (Nunito 800) | Subheadline (Nunito 600) | Screen / Asset | Visual Hook |
|:---:|:---|:---|:---|:---|
| **1 (Hook)** | **CBT Made Simple & Playful** | 5-minute interactive courses that fit your day | Roadmap ([`journey-map.tsx`](file:///Users/samuelprasad/Desktop/happy/journals/app/tabs/screens/(journey)/journey-map.tsx)) | 3D Duolingo-style path, chapter nodes, XP chests, waving panda mascot |
| **2 (Retention)** | **Daily to Yearly Life Insights** | Understand your mood triggers and real progress | Insights Overview ([`InsightsScreen.tsx`](file:///Users/samuelprasad/Desktop/happy/journals/src/screens/InsightsScreen/InsightsScreen.tsx)) | Weekly curved mood graph, 7d/30d/1y time range selector pills, narrative card |
| **3** | **Speak Your Mind Freely** | Voice notes turned into structured reflections | Voice Recording ([`record.tsx`](file:///Users/samuelprasad/Desktop/happy/journals/app/tabs/(tabs)/record.tsx)) | Glowing audio waveform, instant reflection synthesis card, physical 3D button |
| **4** | **Break Thinking Traps** | Challenge catastrophizing and anxiety spirals | Thought Reframing ([`cbt-step-preview.tsx`](file:///Users/samuelprasad/Desktop/happy/journals/app/tabs/screens/(exercises)/cbt-step-preview.tsx)) | Physical 3D choice buttons, before/after cognitive restructuring swap |
| **5** | **Paper Journaling Meets AI** | Snap a photo to digitize your handwritten notes | Camera OCR View | Real paper notebook page with green laser scan converting to digital reflection |
| **6** | **Uncover Hidden Triggers** | Detailed reports on anxiety, stress, and overthinking | Category Deep Dive ([`anxiety-deep-dive.tsx`](file:///Users/samuelprasad/Desktop/happy/journals/app/tabs/(tabs)/insights/anxiety-deep-dive.tsx)) | Trigger factor breakdown cards (sleep, work, habits) and category health score |
| **7** | **Instant Anxiety Relief** | 40+ guided exercises ready when you need them | Coping Cards Carousel ([`CopingCardsScreen.tsx`](file:///Users/samuelprasad/Desktop/happy/journals/src/screens/CopingCardsScreen.tsx)) | High-contrast calming cards: Box Breathing (4-4-4-4), Grounding (5-4-3-2-1) |
| **8** | **Build Habits That Stick** | Keep your streak alive and unlock panda rewards | Streak Flame + Rewards Shop ([`RewardsShopScreen.tsx`](file:///Users/samuelprasad/Desktop/happy/journals/src/screens/RewardsShopScreen.tsx)) | Fire streak counter with celebratory haptics, confetti, and unlockable mascot items |
| **9** | **100% Private & Protected** | Your reflections stay strictly yours | Security & Settings ([`SettingsScreen.tsx`](file:///Users/samuelprasad/Desktop/happy/journals/src/screens/SettingsScreen/SettingsScreen.tsx)) | Minimalist lock shield, Sign in with Apple badge, on-device encryption guarantee |
| **10 (CTA)** | **Start Your Calmer Journey** | 5 minutes a day for lasting mental clarity | Mascot Hero CTA Screen | Big cheerful waving panda mascot, bold typography, 3D "Get Started Free" button |
