# Monthly AI Insights Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade `MonthlyService` to have Empty Month Protection, Missing Weekly Recovery, Parallel Generation, and Timezone Accuracy (matching the recent `WeeklyService` upgrades).

**Architecture:** We will modify `supabase/functions/_shared/reflection-engine/services/monthly.service.ts` to calculate the user's timezone-aware "today", derive expected weeks for the target month, parallel-generate any missing weekly summaries, and bypass the Gemini API (Empty Month Protection) if there are no meaningful weekly insights to summarize.

**Tech Stack:** TypeScript, Supabase Edge Functions, `date-fns`, `date-fns-tz`

## Global Constraints

- Never call Gemini API if there is no real data (Empty Month Protection).
- Always use `Promise.all` with `.catch` for parallel generation so one failure doesn't crash the whole pipeline.
- Use `getUserTimezone` and `date-fns-tz` to ensure "today" is strictly local time.

---

### Task 1: Add Timezone Accuracy and Parallel Missing Weekly Recovery

**Files:**
- Modify: `supabase/functions/_shared/reflection-engine/services/monthly.service.ts`

**Interfaces:**
- Consumes: `getUserTimezone` (from `../../timezone.ts`), `date-fns` (`getWeek`, `eachWeekOfInterval`), `WeeklyService` (from `./weekly.service.ts`).

- [ ] **Step 1: Import dependencies**
Add imports for timezone logic, date-fns, and `WeeklyService` at the top of the file:
```typescript
import { WeeklyService } from "./weekly.service.ts";
import { getUserTimezone } from "../../timezone.ts";
import { toZonedTime, format as formatTz } from "npm:date-fns-tz@^3.0.0";
import { format, getWeek, eachWeekOfInterval } from "npm:date-fns@^4.1.0";
```

- [ ] **Step 2: Add Missing Weekly Generation Logic**
Inside `generateAndSaveMonthlyReflection`, right after the initial `await Promise.all([...])` fetch of `weeklyRecords` and `priorMonthly` (around line 91):

```typescript
      // Calculate Timezone-Aware Today
      const userTimezone = await getUserTimezone(this.supabase, userId);
      const today = formatTz(toZonedTime(new Date(), userTimezone), "yyyy-MM-dd");
      
      const capDate = lastDay < today ? lastDay : today;

      // Identify missing weeks
      const targetYearInt = parseInt(monthYear.slice(0, 4), 10);
      const existingWeeks = new Set((weeklyRecords || []).map((w: any) => w.week_number));
      
      const missingWeeks: number[] = [];
      let intervalWeeks: Date[] = [];
      
      if (firstDay <= capDate) {
        intervalWeeks = eachWeekOfInterval({
          start: new Date(`${firstDay}T00:00:00.000Z`),
          end: new Date(`${capDate}T00:00:00.000Z`)
        });
      }
      
      for (const d of intervalWeeks) {
        const wk = getWeek(d);
        if (!existingWeeks.has(wk)) {
          missingWeeks.push(wk);
        }
      }

      // Parallel generate missing weeklies
      let finalWeeklyRecords = weeklyRecords || [];
      
      if (missingWeeks.length > 0) {
        console.log(`[monthly.service] Generating missing weekly insights for weeks:`, missingWeeks);
        const weeklyService = new WeeklyService(this.supabase);
        
        await Promise.all(
          missingWeeks.map(wk => 
            weeklyService.generateAndSaveWeeklyReflection(userId, wk, targetYearInt)
              .catch(err => console.error(`Failed to generate weekly AI for week ${wk}:`, err))
          )
        );

        // Refetch after generation
        const { data: refreshedWeeklyAIs } = await this.supabase
          .from("weekly_ai")
          .select("week_number, summary, structured_memory")
          .eq("user_id", userId)
          .eq("year", targetYearInt);
          
        if (refreshedWeeklyAIs) {
          finalWeeklyRecords = refreshedWeeklyAIs;
        }
      }
```

- [ ] **Step 3: Update `forEach` array reference**
Change the loop that maps over weekly records (around line 105) to use the new `finalWeeklyRecords` array:
```typescript
      finalWeeklyRecords.forEach(record => {
```

- [ ] **Step 4: Commit**
```bash
git add supabase/functions/_shared/reflection-engine/services/monthly.service.ts
git commit -m "feat: add missing weekly recovery and timezone accuracy to monthly service"
```

### Task 2: Implement Empty Month Protection

**Files:**
- Modify: `supabase/functions/_shared/reflection-engine/services/monthly.service.ts`

**Interfaces:**
- Consumes: The `weeklyReflections` array built in the previous steps.

- [ ] **Step 1: Check for meaningful data before Gemini call**
After building the context (around line 128), check if `weeklyReflections` is empty or only contains generic placeholder text (e.g., "No entries"). If there is no real data, bypass Gemini and return a placeholder directly.

```typescript
      // 2. Build context
      const context = contextBuilder.buildMonthlyContext(
        monthYear,
        weeklyReflections,
        weeklyMemories,
        priorReflection,
      );

      console.log(`[monthly.service] Built context:`, JSON.stringify(context, null, 2));

      // EMPTY MONTH PROTECTION
      const hasMeaningfulData = weeklyReflections.some(ref => 
        ref && !ref.toLowerCase().includes("no entries recorded")
      );

      let aiResult;
      
      if (!hasMeaningfulData || weeklyReflections.length === 0) {
        console.log(`[monthly.service] No meaningful weekly data found. Bypassing Gemini API to save costs.`);
        aiResult = {
          monthly_reflection: "No entries recorded for this month.",
          insights: ["No data available to generate insights."],
          structured_memory: {
            core_beliefs: [],
            recurring_themes: [],
            unresolved_tensions: []
          }
        };
      } else {
        // 3. Generate Reflection via AI Engine
        console.log(`[monthly.service] Calling Gemini...`);
        aiResult = await reflectionEngine.generateMonthlyReflection(context);
        console.log(`[monthly.service] Gemini Output:`, JSON.stringify(aiResult, null, 2));
      }
```

- [ ] **Step 2: Commit**
```bash
git add supabase/functions/_shared/reflection-engine/services/monthly.service.ts
git commit -m "feat: add empty month protection to bypass Gemini API on missing data"
```
