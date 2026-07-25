# Daily AI Date Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correctly query the `habit_completions` and `calorie_entries` tables using UTC timestamps to feed accurate context into the Daily AI generator.

**Architecture:** Modify the Supabase data fetching layer in `daily.service.ts` to query the correct tables (`habit_completions`, `calorie_entries`), select the correct columns including timestamps, and filter using local-to-UTC boundaries (`startOfDay`, `endOfDay`).

**Tech Stack:** TypeScript, Supabase, Edge Functions

## Global Constraints

- **// ponytail:** Keep the code minimal and clean. No over-fetching, only fetch what the AI prompt builder needs.
- **Timezone:** Ensure `startOfDay` and `endOfDay` boundary variables (which are derived from `getUserUtcDateRange`) are used for filtering timestamps.

---

### Task 1: Fix Habits and Meals Queries in `daily.service.ts`

**Files:**
- Modify: `supabase/functions/_shared/reflection-engine/services/daily.service.ts`

**Interfaces:**
- Consumes: `userId`, `startOfDay`, `endOfDay`
- Produces: Corrected arrays of `habits` and `meals` objects with timestamps for the AI prompt builder.

- [ ] **Step 1: Modify Data Fetching Queries**

Update the `Promise.all` block in `daily.service.ts` where habits and meals are fetched. Replace the broken `habits` and `meals` queries.

```typescript
        this.supabase
          .from("habit_completions")
          .select("completed_at, habits(name)")
          .eq("user_id", userId)
          .gte("completed_at", startOfDay)
          .lte("completed_at", endOfDay),
        this.supabase
          .from("calorie_entries")
          .select("foods, total_calories, meal_type, selected_date")
          .eq("user_id", userId)
          .gte("selected_date", startOfDay)
          .lte("selected_date", endOfDay),
```

- [ ] **Step 2: Modify Data Mapping for AI Context**

Further down in `daily.service.ts`, where the fetched data is mapped into the `habitsText` and `mealsText` (or equivalent context variables), update the mapping to use the correct fields.

```typescript
      const dailyHabits = (habits || []).map(
        // @ts-ignore - Supabase join typing
        (h) => ({ name: h.habits?.name || "Unknown Habit", completed: true, timestamp: h.completed_at })
      );
      const dailyMeals = (meals || []).map(
        (m) => ({ food: m.foods, calories: m.total_calories, meal_type: m.meal_type, timestamp: m.selected_date })
      );
```

- [ ] **Step 3: Deploy the Edge Function**

Run the Supabase CLI command to deploy the updated function and verify it compiles successfully.

```bash
npx supabase functions deploy generate-daily-ai
```
Expected: PASS (Function deployed successfully)

- [ ] **Step 4: Commit**

```bash
git add supabase/functions/_shared/reflection-engine/services/daily.service.ts
git commit -m "fix(ai): correct daily context queries for habits and meals"
```
