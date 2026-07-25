# Weekly AI Missing Days Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Automatically generate missing daily AI insights for a week before generating the weekly AI reflection, while preventing empty days from wasting Gemini API calls.

**Architecture:** 
1. Modify `DailyService` to detect when a day has zero raw data and immediately return a generic empty summary without calling the AI, saving it to the database so it isn't repeatedly generated.
2. Modify `WeeklyService` to identify any missing dates in the requested week (up to the current date), execute `DailyService.generateAndSaveDailyReflection` in parallel for those dates, and re-fetch the complete week's data before building the weekly context.

**Tech Stack:** TypeScript, Deno (Supabase Edge Functions)

## Global Constraints

- // ponytail: Keep the code minimal and clean. Avoid over-engineering the date iteration.
- Timezone handling: Ensure we do not generate daily insights for future dates relative to the user's local timezone.

---

### Task 1: Prevent empty days from calling AI in DailyService

**Files:**
- Modify: `supabase/functions/_shared/reflection-engine/services/daily.service.ts`

**Interfaces:**
- Produces: `generateAndSaveDailyReflection` will return early if no data is found, saving a generic summary and empty structured memory to `daily_ai`.

- [ ] **Step 1: Write minimal implementation to skip API call on empty data**
Update `supabase/functions/_shared/reflection-engine/services/daily.service.ts` around line 130 to check counts and short-circuit the AI call.

```typescript
      console.log(`[daily.service] Fetched data for ${date}:`, {
        journalCount: journalAIs?.length || 0,
        habitsCount: habits?.length || 0,
        mealsCount: meals?.length || 0,
        cbtCount: cbtContext.length,
        moodsCount: moods?.length || 0,
        hasPriorDaily: !!priorDaily
      });

      // ponytail: if completely empty day, skip AI call and return generic response
      if (
        (journalAIs?.length || 0) === 0 &&
        (habits?.length || 0) === 0 &&
        (meals?.length || 0) === 0 &&
        cbtContext.length === 0 &&
        (moods?.length || 0) === 0
      ) {
        console.log(`[daily.service] No data for ${date}, skipping AI generation.`);
        const emptyResult = {
          daily_reflection: "No entries recorded for this day.",
          structured_memory: {}
        };
        
        const { data, error } = await this.supabase
          .from("daily_ai")
          .upsert(
            {
              user_id: userId,
              reflection_date: date,
              summary: emptyResult.daily_reflection,
              structured_memory: emptyResult.structured_memory,
            },
            { onConflict: "user_id, reflection_date" },
          )
          .select()
          .single();

        if (error) throw error;
        return data;
      }

      // 2. Build the context string
```

- [ ] **Step 2: Commit**

```bash
git add supabase/functions/_shared/reflection-engine/services/daily.service.ts
git commit -m "feat(ai): daily service skips AI generation for completely empty days"
```

---

### Task 2: Auto-generate missing days in WeeklyService

**Files:**
- Modify: `supabase/functions/_shared/reflection-engine/services/weekly.service.ts`

**Interfaces:**
- Consumes: `DailyService.generateAndSaveDailyReflection(userId, date)`

- [ ] **Step 1: Write implementation to generate missing days**
Modify `supabase/functions/_shared/reflection-engine/services/weekly.service.ts` to instantiate `DailyService` and handle missing dates.

At the top of the file, add the import:
```typescript
import { DailyService } from "./daily.service.ts";
```

Update `generateAndSaveWeeklyReflection` around line 70, right after the first `Promise.all` fetch:

```typescript
      // Extract dates we have summaries for
      const existingDates = new Set((dailyAIs || []).map(d => d.reflection_date));
      
      // Determine what days need generating (from startDate to endDate, but not past today)
      const today = new Date().toISOString().split("T")[0]; // UTC fallback, though local would be better. For simplicity we cap at UTC today.
      const capDate = endDate < today ? endDate : today;
      
      const missingDates: string[] = [];
      let currentDate = new Date(startDate);
      const cap = new Date(capDate);
      
      while (currentDate <= cap) {
        const dStr = currentDate.toISOString().split("T")[0];
        if (!existingDates.has(dStr)) {
          missingDates.push(dStr);
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Generate missing days in parallel
      if (missingDates.length > 0) {
        console.log(`[weekly.service] Generating missing daily insights for:`, missingDates);
        const dailyService = new DailyService(this.supabase);
        await Promise.all(missingDates.map(date => 
          dailyService.generateAndSaveDailyReflection(userId, date)
            .catch(err => console.error(`Failed to generate daily AI for ${date}:`, err))
        ));

        // Refetch daily_ai to include the newly generated ones
        const { data: refreshedDailyAIs } = await this.supabase
          .from("daily_ai")
          .select("summary, structured_memory, reflection_date")
          .eq("user_id", userId)
          .gte("reflection_date", startDate)
          .lte("reflection_date", endDate)
          .order("reflection_date", { ascending: true });
          
        if (refreshedDailyAIs) {
          // Re-assign the variable
          dailyAIs = refreshedDailyAIs;
        }
      }

      console.log(`[weekly.service] Fetched data for ${startDate} to ${endDate}:`, {
```
*Note: You will need to change `const [{ data: dailyAIs }]` to `let [{ data: dailyAIs }]` in the initial `Promise.all` destructing above so it can be re-assigned.*
Wait, `reflection_date` needs to be fetched in the initial query too!
Update the select query for `daily_ai` to include `reflection_date` in both the initial fetch and refetch: `.select("summary, structured_memory, reflection_date")`.

- [ ] **Step 2: Commit**

```bash
git add supabase/functions/_shared/reflection-engine/services/weekly.service.ts
git commit -m "feat(ai): weekly service auto-generates missing daily insights"
```

- [ ] **Step 3: Test compilation / deploy**

```bash
npx supabase functions deploy generate-weekly-ai
```
Verify the function deploys successfully.
