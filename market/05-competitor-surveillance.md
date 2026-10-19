# 05 — Competitor Surveillance & Tracking

> **Cadence**: Weekly Surveillance (Mondays)  
> **App**: Happy (`com.samuelprasad.happy` • ID: `6755650433`)  
> **Active Watchlist**: Finch, MindShift, Daylio, Wysa, Headspace

---

## 1. Active Surveillance Watchlist

| App | App Store ID | Tier | Surveillance Focus |
|---|---|---|---|
| **Finch: Self-Care Pet** | `1528665409` | Direct (Gamified) | Mascot loop, virality, D30 retention hooks |
| **MindShift CBT** | `634690188` | Direct (CBT Science) | Clinical keywords, thought record changes |
| **Daylio Journal** | `1194023242` | Direct (Mood Tracking) | Micro-logging UX, paywall experiment pricing |
| **Wysa: AI CBT** | `1172773475` | Adjacent (AI Reframing) | Conversational CBT positioning, ASA bids |
| **Headspace** | `493145008` | Aspirational (Market Cap) | Course bundling, corporate/enterprise B2B shifts |

---

## 2. Weekly Change Detection (Snapshot: October 18, 2026)

* **Finch (`1528665409`)**:
  * Maintained `Finch: Self-Care Pet` / `Self-Care & Positive Change`.
  * Position held at **#12 Free** in Health & Fitness.
  * Rating: 4.9★ (455K+ reviews).
  * Shift: Seasonal micro-events (Halloween pet outfits). Minor friction around Finch Plus price increases ($39.99/yr).
* **MindShift CBT (`634690188`)**:
  * Title locked: `MindShift CBT - Anxiety Relief`.
  * Position dropped -22, falling outside Top 160.
  * Rating: 4.3★ (stagnant reviews).
  * Shift: Growing 2★ reviews complaining of outdated UI and lack of modern iOS features.
* **Daylio (`1194023242`)**:
  * Testing subtitle variants emphasizing "Habits & Self-Care Goals".
  * Position stable at #38 Free in Health & Fitness.
  * Pricing: Testing $59.99 Lifetime tier vs $35.99 Annual subscription.
* **Wysa (`1172773475`)**:
  * Pushing "CBT Coaching" and "Anxiety Relief Chatbot" in keyword string.
  * Position up +11 on Grossing charts.
  * Shift: Aggressive Apple Search Ads bidding on `"CBT for anxiety"` and `"overthinking"`.

---

## 3. Opportunities & Threats

### 🟢 Opportunities to Seize
1. **MindShift UI Desertion**: Target `"MindShift CBT"` and `"CBT thought record"` in Apple Search Ads exact match. MindShift users are actively seeking modern UI alternatives.
2. **Daylio "No Action" Void**: Daylio users praise fast logging but complain nothing changes their thoughts. Highlight Happy's **"Track your mood $\rightarrow$ Reframe with Thought Catcher"** loop.
3. **Finch Price Pushback**: Finch raising Plus prices gives Happy room to position our generous free core tier + 7-day trial.

### 🔴 Threats to Defend
1. **Wysa Bidding on CBT Head Terms**: Wysa is actively pushing ASA spend on `"CBT"` and `"Thought Diary"`. We must maintain exact title indexing for `Happy: CBT Journal & Courses`.
2. **Finch Social Virality**: Finch's TikTok loop remains category benchmark. Happy's mascot **Happi** needs consistent sharing assets (milestone cards, streak celebrations).

---

## 4. Zero-Dependency Surveillance Automation Script

Run this script weekly from terminal or CI to capture metadata diffs without paid SaaS subscriptions:

```bash
#!/usr/bin/env bash
# ponytail: zero-dependency App Store competitor monitor using Apple Lookup API
COMPETITORS=("1528665409" "634690188" "1194023242" "1172773475" "493145008")

echo "=== COMPETITOR SURVEILLANCE SNAPSHOT ($(date +%Y-%m-%d)) ==="
for ID in "${COMPETITORS[@]}"; do
  curl -s "https://itunes.apple.com/lookup?id=${ID}&country=US" | jq -r '
    .results[0] | 
    "\(.trackName) | Version: \(.version) | Rating: \(.averageUserRating) (\(.userRatingCount) reviews) | Price: \(.formattedPrice)"
  '
done
```

---

## 5. Competitive Response Playbook

| Competitor Action Detected | Happy Strategy Move |
|---|---|
| Competitor bids on `"CBT Journal"` | Defend exact match in Title/Subtitle; maintain organic relevance score |
| Competitor increases subscription price | Highlight Happy's transparent pricing and 100% free first loop |
| Competitor rating drops after bad release | Mention stability and ratings in App Store promotional text |
| New competitor enters category Top 25 | Trigger full teardown via `/competitor-analysis` |
