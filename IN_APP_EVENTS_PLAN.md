# App Store In-App Events Plan: Happy

> Executed following the [appeeky/aso-skills](https://github.com/appeeky/aso-skills) in-app-events workflow.  
> Target: Apple App Store Connect -> In-App Events  
> App Scheme: `happy://`

---

## 1. Why Run In-App Events?

1. **Today Tab Feature:** Apple algorithmically surfaces active event cards on the Today tab.
2. **Search Results Card:** Search results for "anxiety", "CBT", or "reset" show an interactive event card with video/image next to the app icon.
3. **Automatic Re-Engagement Notification:** Apple automatically notifies lapsed users who installed Happy in the past without requiring in-app push permissions.
4. **Search Keyword Indexing:** Apple indexes Event Name (30 chars) and Short Description (50 chars) for search rankings.

---

## 2. Event Package 1: The 7-Day Challenge (High Re-engagement & Organic Search)

| Field | Apple Constraint | Value (Copy & Paste) | Char Count |
|:---|:---|:---|:---:|
| **Event Name** | Max 30 chars | `7-Day Anxiety Reset Quest` | 25 / 30 |
| **Short Description** | Max 50 chars | `Break worry loops and unlock rare panda rewards` | 47 / 50 |
| **Long Description** | Max 120 chars | `Join the 7-day CBT challenge. Complete daily 5-minute reframing exercises, build your streak, and unlock rare XP chests.` | 120 / 120 |
| **Badge Type** | Predefined | **Challenge** | — |
| **Deep Link URL** | Valid URL / URI | `happy://tabs/journeys` | — |
| **Recommended Duration** | 7 to 31 days | 14 days (allows rolling 7-day completion window) | — |
| **Card Image Spec** | `2160 x 1080 px` (2:1 ratio) | Panda mascot waving next to a glowing golden streak chest on sage background | — |

---

## 3. Event Package 2: Feature Premiere (New Users & Feature Discovery)

| Field | Apple Constraint | Value (Copy & Paste) | Char Count |
|:---|:---|:---|:---:|
| **Event Name** | Max 30 chars | `CBT Journey Courses Unlock` | 26 / 30 |
| **Short Description** | Max 50 chars | `Explore new interactive mental wellness roadmaps` | 48 / 50 |
| **Long Description** | Max 120 chars | `Discover new step-by-step CBT paths. Master thought reframing, level up your resilience, and celebrate with your panda.` | 119 / 120 |
| **Badge Type** | Predefined | **Premiere** or **Major Update** | — |
| **Deep Link URL** | Valid URL / URI | `happy://tabs/journeys` | — |
| **Recommended Duration** | Up to 31 days | 21 days | — |
| **Card Image Spec** | `2160 x 1080 px` (2:1 ratio) | 3D progression roadmap with glowing checkpoint nodes and panda explorer | — |

---

## 4. Step-by-Step Submission Guide in App Store Connect

1. Log into [App Store Connect](https://appstoreconnect.apple.com).
2. Go to **Apps** -> Select **Happy**.
3. In the left sidebar, click **In-App Events** (under the Features section).
4. Click the blue **`+` (Create Event)** button.
5. Fill the Setup form:
   - **Reference Name (Internal):** `7-Day Anxiety Reset Quest`
   - **Event Badge:** Select `Challenge`
   - **Event Name:** Paste `7-Day Anxiety Reset Quest`
   - **Short Description:** Paste `Break worry loops and unlock rare panda rewards`
   - **Long Description:** Paste `Join the 7-day CBT challenge. Complete daily 5-minute reframing exercises, build your streak, and unlock rare XP chests.`
   - **Event Card Image:** Upload `2160 x 1080 px` asset.
   - **Event Deep Link:** Enter `happy://tabs/journeys`
   - **Event Purpose:** Select `Attract new users` and `Keep active users informed`.
   - **Schedule:** Set start date 3-5 days in the future (to allow Apple review) and set duration for 14-21 days.
6. Click **Save**, then click **Submit for Review**. (Review typically takes 24–48 hours).
