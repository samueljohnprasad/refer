# Daily AI Context Data Integrity Fix

## Context & Problem
The Edge Function `generate-daily-ai` (`daily.service.ts`) currently attempts to query two non-existent / incorrectly named tables (`habits` and `meals`) using an incorrect date filtering schema (`date` vs UTC timestamps). This results in missed context (empty arrays) when the Gemini AI generates the Daily Reflection.

## Goals
1. Accurately fetch daily user habits and meals data.
2. Filter data using strict `startOfDay` and `endOfDay` local-converted-to-UTC boundaries (`getUserUtcDateRange`).
3. Include the exact completion/logging timestamp for each habit and meal to give the AI accurate chronological context.

## Design Details

### 1. Habit Completions Retrieval
- **Table**: `habit_completions`
- **Query Structure**:
  ```typescript
  this.supabase
    .from("habit_completions")
    .select("completed_at, habits(name)")
    .eq("user_id", userId)
    .gte("completed_at", startOfDay)
    .lte("completed_at", endOfDay)
  ```
- **Context Output for AI**: Maps to `[{ name: "Habit Name", completed: true, timestamp: "2026-07-31T09:15:00Z" }]`

### 2. Meal (Calorie Entries) Retrieval
- **Table**: `calorie_entries`
- **Query Structure**:
  ```typescript
  this.supabase
    .from("calorie_entries")
    .select("foods, total_calories, meal_type, selected_date")
    .eq("user_id", userId)
    .gte("selected_date", startOfDay)
    .lte("selected_date", endOfDay)
  ```
- **Context Output for AI**: Maps to `[{ food: "Oatmeal", calories: 350, meal_type: "breakfast", timestamp: "2026-07-31T08:30:00Z" }]`

## Tradeoffs / Ponytail Notes
- **// ponytail**: Utilizing foreign key join `habits(name)` directly in the Supabase query prevents an N+1 secondary fetch or client-side mapping overhead. We fetch exactly what is required for the prompt context builder, nothing more.
