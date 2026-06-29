# Product Requirements Document (PRD): AI Insights Tab

## 1. Overview
**Feature:** A dedicated "Insights" bottom navigation tab.
**Goal:** To provide users with a centralized, deeply engaging space where AI synthesizes their daily, weekly, and monthly mental health data (moods, journals, CBT exercises) into actionable insights and beautiful visualizations.
**Why it matters:** Acts as the primary retention hook ("reward for logging"), helps users discover macro-trends in their mental health, and serves as a natural gateway for Premium subscription upsells (e.g., paywalling Monthly deep-dives).

---

## 2. User Stories
1. **As a user**, I want to click an "Insights" tab on my main navigation bar so I can easily find all AI analysis without digging through my journal history.
2. **As a user**, I want to toggle between "Day", "Week", and "Month" views so I can understand both my immediate triggers and my long-term behavioral trends.
3. **As a new user**, I want to see clear "Empty States" that tell me exactly how many more entries I need to log to unlock my first insights.
4. **As a user**, I want to see a mix of high-level visual widgets (charts, theme bubbles) and a timeline feed of AI-generated summaries.

---

## 3. UI & Architecture

### 3.1 Navigation (Expo Router)
- **New Tab:** Add a new tab icon (e.g., a sparkle or brain icon) to the bottom tab bar.
- **Path:** `app/tabs/insights/index.tsx`
- **Header:** Simple, clean header titled "Insights".

### 3.2 Page Layout & Segmented Control
At the top of the Insights screen, we will have a sticky custom Segmented Control (Pill toggle) to switch views:
`[ Day ]  [ Week ]  [ Month ]`

### 3.3 Views & Content
**☀️ Day Tab:**
- **Goal:** Immediate reflection.
- **Content:** 
  - Mood score average for the day.
  - "Today's Summary" (AI generated paragraph based on today's logs).
  - Timeline list of exactly what triggered them today.

**📅 Week Tab:**
- **Goal:** Discovering emerging patterns.
- **Content:**
  - `ThoughtPatternsCard` (The bubbles with "Anxiety 3x", "Work Stress 2x").
  - A small bar chart showing mood fluctuations Monday-Sunday.
  - "Weekly AI Insight" (e.g., "You tend to feel most stressed on Tuesday mornings").

**🗓️ Month Tab (Premium Upsell Candidate):**
- **Goal:** Macro-trends and major victories.
- **Content:**
  - `XPWeeklyChart` style visualizations for consistency over the month.
  - Total CBT exercises completed.
  - "Monthly Breakthroughs" AI summary.
  - *If free tier:* Render a beautiful `LockedCard` (soft paywall) over this tab.

### 3.4 Empty States
If the data array for the selected timeframe is empty:
- Render a beautiful illustration.
- Title: "Not enough data yet"
- Subtitle: "Log your mood or write a journal entry to generate your [Daily/Weekly/Monthly] insights."
- Call-to-Action button: "Log Mood Now" (deep links to logging screen).

---

## 4. Data & Logic

### 4.1 Data Fetching
We will create a custom hook `useInsightsFeed(timeframe: 'day' | 'week' | 'month')`.
- It will query Supabase for all `mood_logs`, `journals`, and `cbt_entries` where the `created_at` falls within the selected timeframe.
- It will use `date-fns` to calculate the start and end of the current day, week, or month.

### 4.2 AI Generation Trigger
- If the logs exist for the timeframe, but the *AI Summary* hasn't been generated yet (e.g., the week just ended), we will trigger an edge function or API route to generate and save the summary to an `insights` table so we don't regenerate it on every render.

---

## 5. Implementation Plan (Tasks)

- [ ] **Phase 1: Foundation & Navigation**
  - Create the `app/tabs/insights.tsx` file (or update the existing routing if it's already there but hidden).
  - Update `app/tabs/_layout.tsx` to add the Insights tab to the bottom bar with an appropriate icon.
  - Build the `SegmentedControl` component for switching between Day/Week/Month.

- [ ] **Phase 2: Empty States & Layout Skeleton**
  - Create the `InsightsEmptyState` component.
  - Setup the state management (`const [timeframe, setTimeframe] = useState<'day'|'week'|'month'>('week')`).

- [ ] **Phase 3: Data Hooks**
  - Write `useInsightsFeed(timeframe)`.
  - Wire up the date filtering logic so it only returns relevant data for the active tab.

- [ ] **Phase 4: UI Components Assembly**
  - **Day View:** Build the daily summary card.
  - **Week View:** Integrate the existing `ThoughtPatternsCard`.
  - **Month View:** Build the monthly macro-trend widgets and implement the Premium Lock if they don't have a subscription.

- [ ] **Phase 5: Polish & Animations**
  - Add Reanimated layout transitions when switching between Day/Week/Month tabs so the content fades/slides gracefully.
