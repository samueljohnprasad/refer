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
| **Keyword Budget** | Full keyword budget achieved across all 34 supported App Store locales | ✅ DONE | Low | Maintain density on future version bumps |
| **Screenshots** | `en-US` (7/10 live), `de-DE` (2/10), 27 locales documented in copy guide | ❌ INCOMPLETE | High | Render & upload remaining sets (Slots 8–10 in en-US, full sets for de/ja/fr) |
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
| `en-US` | 100/100 | Full | US high-volume clinical & coping terms (therapy, anxiety, depression, mindfulness) |
| `en-AU` | 100/100 | Full | Optimal Australian English terms (therapy, anxiety, calm, overthinking) |
| `en-CA` | 100/100 | Full | Optimal Canadian English coverage |
| `en-GB` | 100/100 | Full | Optimal UK-specific terms (wellbeing, burnout, reflection, relax) |
| `es-MX` | 100/100 | Full | High-volume English & Spanish crossover terms |
| `es-ES` | 100/100 | Full | Castilian Spanish clinical & coping terms (terapia, estres, depresion, meditacion, sueno) |
| `de-DE` | 100/100 | Full | German psychological terms (achtsamkeit, beruhigung, burnout) |
| `fr-FR` | 100/100 | Full | French mental health terms (angoisse, respiration, phobie) |
| `fr-CA` | 100/100 | Full | Quebec French terms matching fr-FR |
| `ja` | 100/100 | Full | High-intent Japanese clinical terms (カウンセリング, 不眠, 認知行動療法, 気分, ストレス) |
| `ko` | 100/100 | Full | High-intent Korean terms (우울증, 불면증, 심리상담, 번아웃, 루틴) |
| `it` | 100/100 | Full | High-volume Italian clinical terms (terapia, meditazione, depressione, sonno, panico, respiro) |
| `pt-BR` | 100/100 | Full | Brazilian Portuguese mental health terms (terapia, depressao, panico, meditacao, sono) |
| `zh-Hant` | 100/100 | Full | Traditional Chinese wellness terms (冥想, 睡眠, 正念, 憂鬱, 心理諮商) |
| `nl-NL` | 100/100 | Full | High-intent Dutch clinical & wellness terms (therapie, stress, depressie, meditatie, slaap, paniek, piekeren) |
| `sv` | 100/100 | Full | High-intent Swedish KBT & coping terms (terapi, stress, depression, meditation, somn, oro, maende) |
| `tr` | 100/100 | Full | High-intent Turkish BDT & coping terms (terapi, anksiyete, stres, depresyon, meditasyon, panikatak, nefes) |
| `pl` | 100/100 | Full | High-intent Polish CBT & coping terms (terapia, stres, depresja, medytacja, sen, panika, oddech, nawyki) |
| `zh-Hans` | 100/100 | Full | Simplified Chinese CBT & wellness terms (冥想, 睡眠, 正念, 抑郁, 呼吸, 放松, 失眠, 恐慌, 习惯, 疗愈) |
| `no` | 100/100 | Full | High-intent Norwegian KBT & coping terms (terapi, stress, depresjon, meditasjon, søvn, pust, mindfulness, ro, panikk, uro, vaner) |
| `da` | 100/100 | Full | High-intent Danish KBT & coping terms (terapi, stress, depression, meditation, søvn, åndedræt, ro, panik, uro, vaner) |
| `fi` | 100/100 | Full | High-intent Finnish KBT & coping terms (terapia, stressi, masennus, uni, hengitys, mindfulness, rauha, paniikki, tavat, cbt) |
| `id` | 100/100 | Full | High-intent Indonesian CBT & coping terms (terapi, stres, depresi, meditasi, tidur, napas, panik, tenang, curhat, psikolog, refleksi, afirmasi, mindfulness) |
| `vi` | 100/100 | Full | High-intent Vietnamese CBT & coping terms (trị liệu, căng thẳng, trầm cảm, thiền, giấc ngủ, hít thở, thư giãn, chánh niệm, hoảng loạn, thói quen, cảm xúc) |
| `ar-SA` | 100/100 | Full | High-intent Gulf Arabic CBT & coping terms (علاج, توتر, اكتئاب, تأمل, نوم, استرخاء, تنفس, هلع, هدوء, عادات, مذكرات, وسواس, مزاج, مشاعر, فضفضة) |
| `th` | 100/100 | Full | High-intent Thai CBT & coping terms (คิดมาก, เครียด, ซึมเศร้า, แพนิค, สมาธิ, นอนไม่หลับ, จิตวิทยา, บำบัด, ฮีลใจ, ผ่อนคลาย, อารมณ์, นิสัย, ความสุข, สงบ) |
| `ru` | 100/100 | Full | High-intent Russian CBT & coping terms (психолог, терапия, депрессия, паника, сон, бессонница, привычки, осознанность, спокойствие, выгорание, дыхание) |
| `ms` | 100/100 | Full | High-intent Malay CBT & coping terms (terapi, stres, kemurungan, depresi, meditasi, tidur, panik, mood, emosi, tabiat, psikologi, nafas, syukur, jurnal) |
| `cs` | 100/100 | Full | High-intent Czech CBT & coping terms (terapie, meditace, všímavost, panika, dýchání, návyk, emoce, duševní zdraví, relaxace, pohoda, sebepéče, smutek) |
| `el` | 95/100 | Full | High-intent Greek ΓΣΘ & wellbeing terms (θεραπεία, στρες, κατάθλιψη, διαλογισμός, ύπνος, πανικός, αναπνοή, ψυχολόγος) |
| `hu` | 83/100 | Full | High-intent Hungarian CBT & wellbeing terms (terápia, stressz, depresszió, meditáció, alvás, pánik, légzés, pszichológus) |
| `ro` | 87/100 | Full | High-intent Romanian CBT & wellbeing terms (terapie, stres, depresie, meditație, somn, panică, respirație, psiholog) |
| `pt-PT` | 90/100 | Full | High-intent European Portuguese TCC & wellbeing terms (terapia, stress, depressão, meditação, sono, pânico, respiração, psicólogo) |
| `he` | 83/100 | Full | High-intent Hebrew CBT & wellbeing terms (טיפול, מתח, דיכאון, מדיטציה, שינה, פאניקה, נשימה, פסיכולוג) |

---

## 3. Screenshots Gap & Plan

### Current App Store Connect State (6.5" iPhone)
- `en-US`: 7 uploaded (Slots 1–7 live, Slots 8–10 pending)
- `de-DE`: 2 uploaded (Slots 1–2 live, Slots 3–10 pending)
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
