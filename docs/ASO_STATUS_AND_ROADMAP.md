# ASO Status, Audit & Roadmap: Happy

**App ID:** `6755650433`  
**Current Store Release:** `1.5.0`  
**Submitted / Under Review:** `1.5.1` (Build 50)  
**Primary Locale:** `en-US`  
**Categories:** Primary `Health & Fitness`, Secondary `Lifestyle`

---

## 1. Executive Summary & Status Scorecard

| Area | Current Status | State | Priority | Next Action |
| :--- | :--- | :---: | :---: | :--- |
| **Title & Subtitle** | Optimized (28/30 & 29/30 chars) across 10 locales | ✅ DONE | Low | Maintain consistency across versions |
| **In-App Events** | `7-Day CBT Mental Reset Challenge` Published | ✅ DONE | Low | Plan next seasonal challenge |
| **Custom Product Pages** | 3 pages live (`CBT Courses`, `Anxiety Relief`, `Voice Journal`) | ✅ DONE | Med | Link to ad campaigns (ASA, TikTok, Meta) |
| **Review Prompts** | `useReviewPrompt` hooked to Day 3/7/15 & unit milestone | ✅ DONE | Low | Verify live prompt appearance in production |
| **Keyword Budget** | `ja` (89/100) & `ko` (77/100) have unused characters; US-MX cross-locale duplication | ⚠️ ACTION | High | Optimize character budget & cross-index coverage |
| **Screenshots** | `en-US` (6/10), `de-DE` (2/10), remaining 8 locales have 0 screenshots | ❌ INCOMPLETE | High | Render & upload localized sets (Slots 1–10) |
| **App Preview Video** | 0 videos in App Store Connect | ⏳ PENDING | Med | Record 15-30s gameplay video for Slot 1 |
| **A/B Testing (PPO)** | 0 active experiments | ⏳ PENDING | Med | Start Icon & Slot 1 A/B test once 1.5.1 is live |

---

## 2. Text Metadata & Keyword Architecture

### Current Title & Subtitle Strategy
- **US Title:** `Happy: CBT Journal & Courses` (28/30)
- **US Subtitle:** `Gamified Mental Health & Mood` (29/30)
- **Indexed words via Title/Subtitle:** `happy`, `cbt`, `journal`, `courses`, `gamified`, `mental`, `health`, `mood`.
- **Rule:** NEVER repeat any of these words in the `keywords` field (wastes character count).

### US Cross-Locale Search Indexing (en-US + es-MX)
Apple indexes both `en-US` AND `es-MX` (Spanish Mexico) in the United States App Store:
- **`es-MX` Title:** `Happy: Meditation & Sleep`
- **`es-MX` Subtitle:** `Overthinking & Panic Care`
- **Indexed words via MX:** `meditation`, `sleep`, `overthinking`, `panic`, `care`.
- **Finding:** `en-US` keywords currently include `sleep`, `overthinking`, and `panic`, duplicating what `es-MX` already indexes in the US!
- **Opportunity:** Free up 25+ characters in `en-US` to rank for unindexed high-volume keywords: `adhd`, `ptsd`, `breathe`, `counseling`, `selfcare`, `tracker`.

### Keyword Budget Usage by Locale
| Locale | Length | Status | Recommendation |
| :--- | :---: | :---: | :--- |
| `en-US` | 100/100 | Full | Swap out MX-duplicated words (`sleep`, `panic`, `overthinking`) for `adhd`, `ptsd`, `breathe`, `tracker` |
| `en-AU` | 100/100 | Full | Optimal coverage |
| `en-CA` | 100/100 | Full | Optimal coverage |
| `en-GB` | 99/100 | Full | Optimal UK-specific terms (`wellbeing`, `burnout`, `reflection`) |
| `es-MX` | 100/100 | Full | High-volume English & Spanish crossover terms |
| `de-DE` | 100/100 | Full | German psychological terms (`achtsamkeit`, `beruhigung`, `burnout`) |
| `fr-FR` | 100/100 | Full | French mental health terms (`angoisse`, `respiration`, `phobie`) |
| `fr-CA` | 100/100 | Full | Quebec French terms matching `fr-FR` |
| `ja` | 89/100 | 11 free | Add `カウンセリング` (counseling), `メンタルヘルス`, `不眠` (insomnia) |
| `ko` | 77/100 | 23 free | Add `불면증` (insomnia), `상담` (counseling), `번아웃` (burnout), `루틴` (routine) |

---

## 3. Screenshots Gap & Plan

### Current App Store Connect State (6.5" iPhone)
- `en-US`: 6 uploaded
- `de-DE`: 2 uploaded
- `en-AU`, `en-CA`, `en-GB`, `es-MX`, `fr-CA`, `fr-FR`, `ja`, `ko`: **0 uploaded** (fallback to English)

### 10-Slot Storyboard Reference
Detailed copy and design requirements live in:
- [`SCREENSHOT_DESIGN_BRIEF.md`](file:///Users/samuelprasad/Desktop/happy/journals/SCREENSHOT_DESIGN_BRIEF.md)
- [`SCREENSHOT_LOCALIZATION_COPY.md`](file:///Users/samuelprasad/Desktop/happy/journals/SCREENSHOT_LOCALIZATION_COPY.md)

1. **Slot 1 (The Hook):** Gamified CBT Courses (`CBT Made Simple & Playful`)
2. **Slot 2 (Insights):** Daily to Yearly Life Insights (`Daily to Yearly Life Insights`)
3. **Slot 3 (Voice):** Speak Your Mind Freely (`Voice Journaling`)
4. **Slot 4 (Reframing):** Break Thinking Traps (`Thought Reframing / Decatastrophizing`)
5. **Slot 5 (Paper OCR):** Paper Journaling Meets AI (`Handwriting Scanner`)
6. **Slot 6 (Analytics):** Uncover Hidden Triggers (`Anxiety & Stress Deep Dives`)
7. **Slot 7 (Coping):** Instant Anxiety Relief (`40+ Guided Tools & Breathing`)
8. **Slot 8 (Habits):** Build Habits That Stick (`Panda Mascot & Streaks`)
9. **Slot 9 (Privacy):** 100% Private & Protected (`Confidential & Secure`)
10. **Slot 10 (CTA):** Start Your Calmer Journey (`5 Minutes a Day`)

---

## 4. Execution Roadmap

1. **Phase 1 (Immediate / Metadata Target)**:
   - Max out `ja` and `ko` keywords to 98–100 characters.
   - Refactor `en-US` keywords to capitalize on `es-MX` cross-indexing for the US Store.
   - Stage changes in `metadata/version/` canonical files.
2. **Phase 2 (Screenshots Render & Upload)**:
   - Render HTML generator (`.agents/app-store-ss-2.html`) for 10-slot story.
   - Upload full sets for `de-DE` (remaining 8) and key locales (`ja`, `ko`, `fr-FR`, `es-MX`).
3. **Phase 3 (Post 1.5.1 Live Release)**:
   - Launch PPO A/B icon experiment (Panda mascot vs minimal icon).
   - Link Custom Product Pages (CPPs) to acquisition campaigns.
