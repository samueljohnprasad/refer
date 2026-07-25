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
