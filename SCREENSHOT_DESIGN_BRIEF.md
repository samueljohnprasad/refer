# App Store Screenshot Design Brief: Happy

**Target Audience:** Adults & young adults struggling with anxiety, overthinking, and daily stress who want practical CBT and journaling without feeling bored or overwhelmed.  
**Design Direction:** "Calm meets Duolingo" — premium, approachable, cheerful, physical 3D depth, zero AI slop gradients.  
**Primary Brand Mascot:** Friendly panda companion (`assets/icons/icon-panda.png`).

---

## 1. Technical Specifications

| Property | Requirement |
|:---|:---|
| **Primary Dimensions (6.7" iPhone)** | `1290 x 2796 px` (Portrait) |
| **Secondary Dimensions (6.5" iPhone)** | `1284 x 2778 px` (Portrait) |
| **File Format** | 24-bit PNG (no transparency) or high-quality JPEG |
| **Color Space** | Display P3 or sRGB |
| **Top Safe Margin** | `180 px` (keep headlines below status bar / notch overlap) |
| **Bottom Safe Margin** | `160 px` (keep UI above home bar) |
| **Device Frame Style** | Minimalist iPhone 16 Pro bezel (Titanium Silver / Dark Graphite) or clean frameless card float with soft physical drop shadow (`0 20px 40px rgba(20, 36, 20, 0.08)`). |

---

## 2. Visual Style Guide & Brand Tokens

### Color Palette
- **Canvas / Background:** `#F8FAF7` (Warm calming sage canvas)
- **Alternate Card Tint:** `#EEF2E8` (Light sage container)
- **Primary Text (Ink):** `#142414` (Deep forest ink, high contrast)
- **Secondary Text (Ink-Soft):** `#556855` (Subdued readable green-gray)
- **Brand Primary Green:** `#5F7F58` (Sage 500)
- **Gamification & Highlight Accents:**
  - Gold / XP / Stars: `#FFD900`
  - Streak Fire / Alert: `#FF4B4B`
  - Calm Sky Blue: `#1CB0F6`
  - Journey Milestone Purple: `#CE82FF`

### Typography (Nunito)
- **Headline (Benefit Hook):** Nunito ExtraBold (800), `72-80 px`, line-height `88 px`, color `#142414`. Maximum 4-6 words.
- **Subheadline (Context):** Nunito SemiBold (600), `36-40 px`, line-height `48 px`, color `#556855`. Maximum 8-12 words.
- **Rules:**
  - NO all-caps tracked-out eyebrow headers (per `PRODUCT.md` anti-references).
  - High contrast on tinted backgrounds at all times.
  - Left-aligned or centered depending on slot layout.

---

## 3. The 10-Slot Storyboard

### Slot 1: The Hook — Gamified CBT Courses (Conversion Critical)
- **Goal:** Instantly communicate that CBT is no longer a boring clinical worksheet—it is an engaging, gamified journey.
- **Headline (800):** CBT Made Simple & Playful
- **Subheadline (600):** 5-minute interactive courses that fit your day
- **Screen to Capture:** Journey Map Screen (`app/tabs/screens/(journey)/journey-map.tsx`)
- **Key Visual Elements:**
  - Duolingo-style curved roadmap with numbered circular milestone nodes.
  - Panda mascot sitting near the active unlocked node with a cheerful waving pose.
  - Golden milestone chest floating with sparkle / XP badge.
- **Layout:** Headline top centered (2 lines). Phone frame tilted or centered upright showing the lush progression map.

---

### Slot 2: Multi-Timeframe Life Insights (Retention Driver)
- **Goal:** Show that Happy connects the dots across daily, weekly, monthly, and yearly emotional trends.
- **Headline (800):** Daily to Yearly Life Insights
- **Subheadline (600):** Understand your mood triggers and real progress
- **Screen to Capture:** Insights Overview (`src/screens/InsightsScreen/InsightsScreen.tsx`)
- **Key Visual Elements:**
  - Time range pill selector active: `7d | 30d | 90d | 1y`.
  - Smooth curved Weekly Mood Chart (`WeeklyMoodChart.tsx`).
  - Narrative Insight Card ("You felt 24% calmer on days with outdoor walks").
- **Layout:** Headline top left-aligned. Device angled slightly up with floating callout badge on the positive trend curve.

---

### Slot 3: Multimodal Voice Journaling
- **Goal:** Remove the friction of staring at a blank page—just speak out loud.
- **Headline (800):** Speak Your Mind Freely
- **Subheadline (600):** Voice notes turned into structured reflections
- **Screen to Capture:** Voice Recording & Reflection Screen (`app/tabs/(tabs)/record.tsx`)
- **Key Visual Elements:**
  - Pulsing animated green audio waveform.
  - Clean card showing live transcribed speech with an highlighted insight pill ("Identified: Overthinking Loop").
  - Physical 3D "Reflect" button at bottom.
- **Layout:** Headline centered top. Audio waveform visual centered with high contrast.

---

### Slot 4: Interactive Thought Reframing
- **Goal:** Show the core CBT mechanism—catching and rewriting automatic negative thoughts.
- **Headline (800):** Break Thinking Traps
- **Subheadline (600):** Challenge catastrophizing and anxiety spirals
- **Screen to Capture:** CBT Step Preview (`app/tabs/screens/(exercises)/cbt-step-preview.tsx` & `ThoughtReframingScreen.tsx`)
- **Key Visual Elements:**
  - Before/After thought card: "Everyone is judging me" -> Reframe: "People are focused on their own tasks".
  - 3D physical choice pill buttons.
- **Layout:** Split card comparison or clean device frame with floating "Reframe Complete" badge.

---

### Slot 5: Handwritten Journal Photo OCR Scanner
- **Goal:** Appeal to paper notebook lovers who don't want to give up handwritten journaling.
- **Headline (800):** Paper Journaling Meets AI
- **Subheadline (600):** Snap a photo to digitize your handwritten notes
- **Screen to Capture:** Photo Journal Scanner / Camera OCR View
- **Key Visual Elements:**
  - Visual of a real notebook page with handwriting inside a subtle camera viewfinder frame.
  - Green scan-line effect transforming handwritten lines into digital structured bullet points.
- **Layout:** Split layout: real notebook photo on left blending into app reflection card on right.

---

### Slot 6: Deep Dive Analytics (Anxiety & Overthinking)
- **Goal:** Prove clinical depth beyond superficial 1-10 mood counters.
- **Headline (800):** Uncover Hidden Triggers
- **Subheadline (600):** Detailed reports on anxiety, stress, and overthinking
- **Screen to Capture:** Deep Dive Screen (`app/tabs/(tabs)/insights/anxiety-deep-dive.tsx` or `overthinking-deep-dive.tsx`)
- **Key Visual Elements:**
  - Factor breakdown bars (Work, Sleep, Social, Physical activity).
  - Category summary card with green score badge.
- **Layout:** Clean upright device frame with spotlight effect on top trigger factors.

---

### Slot 7: Emergency Coping Cards (Immediate Relief)
- **Goal:** Show instant utility for panic attacks, overwhelm, and sleepless nights.
- **Headline (800):** Instant Anxiety Relief
- **Subheadline (600):** 40+ guided exercises ready when you need them
- **Screen to Capture:** Coping Cards Carousel (`src/screens/CopingCardsScreen.tsx`)
- **Key Visual Elements:**
  - High-contrast calming cards: "Box Breathing (4-4-4-4)", "5-4-3-2-1 Grounding", "Worry Decision Tree".
  - Clean breath pacer ring visual.
- **Layout:** Fanned card stack effect or horizontal carousel float.

---

### Slot 8: Daily Habits, Streaks & Rewards
- **Goal:** Leverage Duolingo-style streak psychology to prove daily stickiness.
- **Headline (800):** Build Habits That Stick
- **Subheadline (600):** Keep your streak alive and unlock panda rewards
- **Screen to Capture:** Gamification Shop & Streak View (`src/screens/RewardsShopScreen.tsx` & `src/components/Streak`)
- **Key Visual Elements:**
  - Orange flame streak counter ("🔥 14 Day Streak!").
  - Confetti burst with celebratory haptic visual cue.
  - Panda mascot wearing an unlockable cozy scarf or hat from the Rewards Shop.
- **Layout:** Headline centered top. Large energetic streak badge floating above the habit checklist.

---

### Slot 9: Privacy & Sanctuary Guarantee
- **Goal:** Eliminate mental health data privacy fears.
- **Headline (800):** 100% Private & Protected
- **Subheadline (600):** Your reflections stay strictly yours
- **Screen to Capture:** Security & Settings View (`src/screens/SettingsScreen/SettingsScreen.tsx`)
- **Key Visual Elements:**
  - Minimalist security shield icon with subtle green glow.
  - "Sign in with Apple" badge.
  - "Local On-Device Encryption" checkmark card.
  - Zero third-party ad trackers guarantee.
- **Layout:** Elegant card presentation centered in the frame.

---

### Slot 10: The Invitation (Call to Action)
- **Goal:** Final emotional push to download.
- **Headline (800):** Start Your Calmer Journey
- **Subheadline (600):** 5 minutes a day for lasting mental clarity
- **Screen to Capture:** Welcome / Onboarding Finale Screen with Panda
- **Key Visual Elements:**
  - Big cheerful Panda mascot waving with both hands.
  - Big green 3D action button: "Get Started Free".
  - Social proof pill: "Designed by mental health experts".
- **Layout:** Full screen hero celebration, bold typography, warm sage background.

---

## 4. Designer Deliverable Checklist

- [ ] 10 PNG files named `01_cbt_courses.png` through `10_cta_panda.png`.
- [ ] Exported at `1290 x 2796 px` (iPhone 6.7" Super Retina).
- [ ] Exported at `1284 x 2778 px` (iPhone 6.5" Super Retina).
- [ ] Checked on both light and dark App Store appearance.
- [ ] All typography in **Nunito** (weights 800 and 600 only).
- [ ] Text overlays maintain at least 4.5:1 WCAG contrast ratio against background.
- [ ] No placeholder text (lorem ipsum) or truncated copy.
- [ ] Mascot assets taken directly from [`assets/icons/icon-panda.png`](file:///Users/samuelprasad/Desktop/happy/journals/assets/icons/icon-panda.png).
