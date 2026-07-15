# AI Reflection Engine - Low-Level Design (LLD)

## 1. Overview
The AI Reflection Engine is a scalable, hierarchically driven system designed to transform raw user activity (journals, habits, meals, CBT exercises) into meaningful daily, weekly, and monthly reflections. 

To minimize AI costs and ensure consistency, the system generates each reflection **only once**, relying heavily on summarizations of lower-level data (e.g., Weekly reflections use Daily summaries). The AI remains stateless, pulling all necessary context via deterministic Context Builders and validating all outputs using Zod schemas before persistence.

**Core Infrastructure:**
- **Frontend:** Expo (TypeScript)
- **Backend:** Supabase (Edge Functions)
- **Database:** PostgreSQL
- **AI Provider:** Gemini

---

## 2. Database Schema & Data Models

### 2.1 Tables

**`journal_ai`**
- `id` (UUID, PK)
- `journal_id` (UUID, FK to journals)
- `reflection` (Text)
- `structured_memory` (JSONB)
- `confidence` (Float)
- `prompt_version` (String)

**`daily_ai`**
- `id` (UUID, PK)
- `date` (Date)
- `daily_reflection` (Text)
- `structured_memory` (JSONB)

**`weekly_ai`**
- `id` (UUID, PK)
- `start_date` (Date)
- `end_date` (Date)
- `weekly_reflection` (Text)
- `observed_patterns` (JSONB)
- `insights` (JSONB)
- `structured_memory` (JSONB)

**`monthly_ai`**
- `id` (UUID, PK)
- `month_year` (String, e.g. "2026-07")
- `monthly_reflection` (Text)
- `defining_themes` (JSONB)
- `insights` (JSONB)
- `structured_memory` (JSONB)

**`ai_memory`**
- `id` (UUID, PK)
- `user_id` (UUID)
- `memory_type` (Enum: theme, routine, challenge, positive_experience, life_event)
- `content` (Text)

---

## 3. Backend Architecture & Folder Structure

The backend AI service will be highly modularized to act as a reusable foundation.

### Folder Structure
```text
backend/
├── ai/
│   ├── client.ts              # Gemini API client wrapper
│   ├── ai-service.ts          # Core service layer
│   ├── context-builder.ts     # Aggregates context (journals, habits, CBT)
│   ├── prompt-builder.ts      # Constructs final prompts with variables
│   ├── prompt-loader.ts       # Loads markdown prompts
│   ├── validator.ts           # Zod JSON schema validation
│   ├── scheduler.ts           # Job scheduling and idempotency checks
│   ├── reflection-engine.ts   # Core engine logic
│   └── types.ts
├── prompts/
│   ├── journal.md
│   ├── daily.md
│   ├── weekly.md
│   └── monthly.md
└── services/
    ├── journal.service.ts
    ├── daily.service.ts
    ├── weekly.service.ts
    ├── monthly.service.ts
    └── timeline.service.ts
```

---

## 4. Triggers & Schedulers

- **Journal Reflection Engine:** Triggered by `journal_completed` event.
- **Daily Reflection Engine:** Scheduled by the AI Scheduler at the `end_of_day`.
- **Weekly Reflection Engine:** Scheduled by the AI Scheduler at the `end_of_week`.
- **Monthly Reflection Engine:** Scheduled by the AI Scheduler at the `end_of_month`.

The **AI Scheduler** (`scheduler.ts`) is responsible for:
- Preventing duplicate generation (idempotency locks).
- Retrying failed generations.
- Scheduling cron-based tasks.

---

## 5. Prompt Management & Engineering

Prompts are stored as `.md` files in `backend/prompts/`.
The `prompt-loader.ts` reads these templates, and `prompt-builder.ts` injects the aggregated data from the `context-builder.ts`.

Each generated record tracks the `prompt_version` to allow traceability of AI output quality over time.

---

## 6. Output Validation (Zod)

All Gemini responses are forced into structured formats and validated using Zod schemas via `validator.ts`. This ensures that fields like `structured_memory`, `observed_patterns`, and `insights` are always reliable before being committed to PostgreSQL.

---

## 7. Frontend: Timeline APIs & UI

**Timeline APIs:**
- `GET /timeline/daily` (Get Daily Timeline)
- `POST /timeline/daily/{date}/generate-ai` (Generate missing AI reflection)
- `GET /timeline/weekly` (Get Weekly Timeline)
- `GET /timeline/monthly` (Get Monthly Timeline)
- `GET /timeline/details/{id}` (Get Reflection Details)

**Timeline UI Screens (Expo):**
- Daily Timeline, Weekly Timeline, Monthly Timeline, Reflection Details.
- **Features:** Reflection cards, expandable insights, previous period comparisons, and personalized reflection sections.

### 7.1 Daily Timeline Generation Flow
The system supports on-demand AI generation directly from the UI when a reflection is missing.

```text
User opens Days Timeline
        │
        ▼
GET /timeline/daily
        │
        ▼
Returns
[
  { date, journal, habits, aiInsight: {...} },
  { date, journal, habits, aiInsight: null }
]
        │
        ▼
UI: If aiInsight == null
Show [ Generate AI Insight ]
        │
User clicks
        │
        ▼
POST /timeline/daily/{date}/generate-ai
        │
        ▼
Gemini generates insight
        │
        ▼
Store in daily_ai table
        │
        ▼
Return 200
        │
        ▼
UI Refetches: GET /timeline/daily
        │
        ▼
Now AI insight is visible
```

---

## 8. Embeddings & Semantic Search (Phases 10-12)

The `ai_memory` and reflection tables form the basis for long-term intelligence.
- **Embeddings Provider:** Gemini
- **Storage:** `pgvector`
- **Generated for:** `journal`, `journal_ai`, `daily_ai`, `weekly_ai`, `monthly_ai`.
- **Skipped for:** Raw `meals`, `habits`, `calories`, `cbt_completion` (to save cost and noise).

These embeddings will enable Phase 11 (Semantic Search for similar journals/emotions) and Phase 12 (Timeline-aware AI Chat).
