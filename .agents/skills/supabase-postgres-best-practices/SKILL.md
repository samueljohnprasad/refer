---
name: supabase-postgres-best-practices
description: >
  Postgres performance, security, and schema best practices for Supabase projects.
  Trigger when the user is writing SQL queries, designing a schema, adding indexes,
  setting up Row-Level Security (RLS), configuring connection pooling, debugging
  slow queries, reviewing database code, or asking anything related to Supabase
  or Postgres optimization. Also trigger on phrases like "is this query good?",
  "how do I speed this up?", "set up RLS for my table", "design my schema",
  "is this schema correct?", or "how should I structure this database?".
  Covers query performance, connection management, security, schema design,
  concurrency, data access patterns, monitoring, and advanced Postgres features.
  Applies to all Supabase-hosted and self-hosted Postgres instances.
version: "1.0.0"
author: ecocee
license: MIT
tags:
  - postgres
  - supabase
  - sql
  - database
  - performance
  - security
  - rls
  - schema
  - indexing
  - vibe-coding
---

# Supabase Postgres Best Practices

A comprehensive, opinionated guide to writing secure, performant, and
maintainable Postgres code in Supabase projects. Designed for vibe coding
workflows — fast iteration without sacrificing correctness or safety.

Compatible with: Claude, Claude Code, VS Code agent extensions, Cursor,
Windsurf, Antigravity, and any agent that supports the Agent Skills standard.

---

## Philosophy

Speed of iteration and production safety are not opposites. These rules exist
to let you move fast without breaking things silently. Every rule here has
caused a real outage, a real data leak, or a real performance cliff somewhere.
Follow them by default. Deviate deliberately and with documentation.

---

## When to Apply These Rules

Apply this skill when:

- Writing new SQL queries or stored functions
- Designing or migrating a schema
- Adding or reviewing indexes
- Setting up or auditing Row-Level Security policies
- Configuring connection pooling (PgBouncer / Supavisor)
- Debugging slow queries or high database load
- Reviewing any database-related code in a PR
- Generating Supabase migrations or edge function database calls

---

## Rule Categories

Rules are ordered by impact. Address higher-priority categories before lower ones.

| Priority | Category | Impact | Prefix |
|---|---|---|---|
| 1 | Query Performance | Critical | `query-` |
| 2 | Connection Management | Critical | `conn-` |
| 3 | Security and RLS | Critical | `security-` |
| 4 | Schema Design | High | `schema-` |
| 5 | Concurrency and Locking | Medium-High | `lock-` |
| 6 | Data Access Patterns | Medium | `data-` |
| 7 | Monitoring and Diagnostics | Low-Medium | `monitor-` |
| 8 | Advanced Features | Low | `advanced-` |

---

## Category 1 — Query Performance (Critical)

Slow queries are the most common cause of Supabase project degradation.
Fix these before anything else.

### Missing Indexes

Every column used in WHERE, JOIN ON, ORDER BY, or GROUP BY needs an index
unless the table has fewer than a few hundred rows.

```sql
-- Bad: full table scan on every request
SELECT * FROM orders WHERE user_id = $1;

-- Good: index on the lookup column
CREATE INDEX idx_orders_user_id ON orders (user_id);
SELECT * FROM orders WHERE user_id = $1;
```

Run EXPLAIN ANALYZE on any query that feels slow. Look for Seq Scan on large tables.

### SELECT * in Application Queries

Never use SELECT * in application code. Fetch only the columns you need.
This reduces network payload, avoids accidentally exposing sensitive columns,
and allows index-only scans.

```sql
-- Bad
SELECT * FROM profiles WHERE id = $1;

-- Good
SELECT id, username, avatar_url FROM profiles WHERE id = $1;
```

### N+1 Queries

Never execute a query inside a loop. Batch fetches with WHERE id = ANY($1) or
use a JOIN.

```sql
-- Bad: one query per user
FOR user_id IN user_ids LOOP
  SELECT * FROM profiles WHERE id = user_id;
END LOOP;

-- Good: single batched query
SELECT * FROM profiles WHERE id = ANY($1);
```

### Non-SARGable Predicates

Avoid wrapping indexed columns in functions — it prevents index use.

```sql
-- Bad: function on indexed column defeats index
SELECT * FROM events WHERE DATE(created_at) = '2024-01-01';

-- Good: range predicate uses index
SELECT * FROM events
WHERE created_at >= '2024-01-01'
  AND created_at < '2024-01-02';
```

### Pagination with OFFSET

OFFSET scans and discards rows. Use keyset pagination for large tables.

```sql
-- Bad: slow and gets worse as page number increases
SELECT * FROM posts ORDER BY created_at DESC LIMIT 20 OFFSET 10000;

-- Good: keyset pagination — O(log n) regardless of page depth
SELECT * FROM posts
WHERE created_at < $last_seen_created_at
ORDER BY created_at DESC
LIMIT 20;
```

---

## Category 2 — Connection Management (Critical)

Postgres has a hard connection limit. Exhausting it brings your entire project down.

### Always Use a Connection Pooler

Never connect directly to Postgres from serverless functions, edge functions,
or any horizontally scaled service. Use Supavisor (Supabase's pooler) or PgBouncer.

- Direct connections: for long-lived server processes only
- Transaction mode pooling: for serverless and edge functions
- Session mode pooling: for queries that require session state

### Connection String Selection

```
-- Serverless / edge functions: use the pooler port via Supavisor
postgresql://user:pass@db.project.supabase.co:5432/postgres

-- Long-lived servers: direct connection
postgresql://user:pass@db.project.supabase.co:5432/postgres?pgbouncer=false
```

### Avoid Long-Running Transactions

Long transactions hold locks, bloat the WAL, and prevent autovacuum from
cleaning up dead rows. Set a statement timeout in application code.

```sql
-- Set at the session level for risky operations
SET statement_timeout = '30s';

-- Or per transaction
BEGIN;
SET LOCAL statement_timeout = '10s';
-- your queries
COMMIT;
```

---

## Category 3 — Security and RLS (Critical)

A misconfigured RLS policy is a data breach. Treat every RLS rule as a
security boundary, not a convenience filter.

### Enable RLS on Every User-Facing Table

```sql
-- Enable RLS immediately after creating any table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

Without this, any authenticated user can read all rows through the Supabase client.

### Write Policies That Fail Closed

```sql
-- Explicit policy: users can only read their own profile
CREATE POLICY "users can only read own profile"
ON profiles FOR SELECT
USING (auth.uid() = user_id);

-- With RLS enabled and no matching policy, Postgres denies by default
-- Always verify this with a test using a different user's JWT
```

### Avoid Volatile Functions in RLS Policies

RLS policies are evaluated per row. A subquery or volatile function in a
policy runs on every row — this is a severe performance problem.

```sql
-- Bad: subquery executes per row
CREATE POLICY "org members only"
ON documents FOR SELECT
USING (
  org_id IN (SELECT org_id FROM memberships WHERE user_id = auth.uid())
);

-- Good: security definer function with cached result
CREATE POLICY "org members only"
ON documents FOR SELECT
USING (is_org_member(org_id, auth.uid()));
```

### Service Role Key Bypasses RLS

The service role key bypasses all RLS policies. Never expose it to the client,
never include it in frontend code, and never commit it to a public repository.

```
# .env.local — Next.js example
SUPABASE_SERVICE_ROLE_KEY=...       # server-side only, never NEXT_PUBLIC_
NEXT_PUBLIC_SUPABASE_ANON_KEY=...   # safe for the browser
```

### auth.uid() Is Only Meaningful in RLS Context

Do not use auth.uid() in service role queries — it returns null outside a
user JWT context and policies will silently pass or fail unexpectedly.

---

## Category 4 — Schema Design (High)

Schema decisions are expensive to reverse after data exists.
Get these right before writing application code.

### Use UUIDs as Primary Keys

Sequential integer IDs are predictable and enumerable by attackers.

```sql
CREATE TABLE profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
```

### Always Include created_at and updated_at

```sql
-- Auto-update updated_at with a trigger
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON documents
FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);
```

### Use timestamptz, Not timestamp

timestamp stores no timezone. timestamptz stores UTC and converts on display.
Always use timestamptz — timestamp causes silent timezone bugs in production.

### Partial Indexes for Sparse Conditions

Index only the rows you actually query.

```sql
-- Bad: indexes all rows including inactive ones you never query
CREATE INDEX idx_users_email ON users (email);

-- Good: indexes only rows matching the common query condition
CREATE INDEX idx_active_users_email ON users (email)
WHERE is_active = true;
```

### Composite Indexes for Multi-Column Queries

Column order matters. Put the most selective or equality-tested column first.

```sql
-- Query: WHERE user_id = $1 AND status = 'pending'
CREATE INDEX idx_orders_user_status ON orders (user_id, status);
```

---

## Category 5 — Concurrency and Locking (Medium-High)

### Set lock_timeout on Schema Migrations

ALTER TABLE acquires AccessExclusiveLock. On a busy table, this queues behind
active queries and blocks everything that follows it.

```sql
SET lock_timeout = '2s';
ALTER TABLE large_table ADD COLUMN new_col text;
```

For large production tables, use pg_repack or phased migrations.

### Prefer Optimistic Concurrency Over SELECT FOR UPDATE

SELECT FOR UPDATE locks rows for the full transaction. Use a version column
for most application-level concurrency control instead.

```sql
-- Optimistic: check version on update
UPDATE documents
SET body = $1, version = version + 1
WHERE id = $2 AND version = $3;
-- 0 rows updated = conflict — retry or surface to user
```

---

## Category 6 — Data Access Patterns (Medium)

### Always Use Parameterised Queries

Never concatenate user input into SQL. Parameterised queries prevent SQL
injection and allow Postgres to cache the query plan.

```sql
-- Bad: SQL injection + no plan caching
query = "SELECT * FROM users WHERE email = '" + email + "'"

-- Good
SELECT * FROM users WHERE email = $1;
```

### Batch Writes

```sql
-- Bad: one round trip per row
INSERT INTO events (type, data) VALUES ('click', $1);
INSERT INTO events (type, data) VALUES ('click', $2);

-- Good: single round trip
INSERT INTO events (type, data) VALUES
  ('click', $1),
  ('click', $2),
  ('click', $3);
```

### Use RETURNING to Avoid Extra Queries

```sql
-- Bad: insert then fetch
INSERT INTO posts (title, body) VALUES ($1, $2);
SELECT * FROM posts WHERE id = lastval();

-- Good: single query
INSERT INTO posts (title, body) VALUES ($1, $2)
RETURNING id, created_at;
```

---

## Category 7 — Monitoring and Diagnostics (Low-Medium)

### Query Slowest Queries with pg_stat_statements

Supabase enables pg_stat_statements by default.

```sql
SELECT query, calls, mean_exec_time, total_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 20;
```

### Use EXPLAIN (ANALYZE, BUFFERS), Not Just EXPLAIN

EXPLAIN shows the plan. EXPLAIN ANALYZE runs the query and shows real timings.

```sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT * FROM orders WHERE user_id = $1 AND status = 'pending';
```

### Monitor Table Bloat

```sql
SELECT relname, n_dead_tup, n_live_tup,
       round(n_dead_tup::numeric / nullif(n_live_tup + n_dead_tup, 0) * 100, 2) AS dead_pct
FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC
LIMIT 20;
```

Dead rows accumulate when autovacuum cannot keep up. Tune autovacuum or
run VACUUM ANALYZE manually on write-heavy tables.

---

## Category 8 — Advanced Features (Low)

### Generated Columns for Full-Text Search

```sql
ALTER TABLE products
ADD COLUMN search_vector tsvector
GENERATED ALWAYS AS (
  to_tsvector('english', name || ' ' || coalesce(description, ''))
) STORED;

CREATE INDEX idx_products_search ON products USING GIN (search_vector);
```

### Materialised Views for Expensive Aggregations

```sql
CREATE MATERIALIZED VIEW monthly_revenue AS
SELECT
  date_trunc('month', created_at) AS month,
  sum(amount) AS total
FROM payments
WHERE status = 'completed'
GROUP BY 1;

REFRESH MATERIALIZED VIEW CONCURRENTLY monthly_revenue;
```

### Scheduled Jobs with pg_cron

```sql
SELECT cron.schedule(
  'refresh-monthly-revenue',
  '0 1 * * *',
  'REFRESH MATERIALIZED VIEW CONCURRENTLY monthly_revenue'
);
```

---

## Anti-Patterns (Always Flag)

| Anti-Pattern | Risk |
|---|---|
| SELECT * in application code | Data leakage, over-fetching, no index-only scans |
| No RLS on user-facing tables | Any authenticated user can read all rows |
| Service role key in frontend code | Full database access exposed publicly |
| Queries inside loops (N+1) | Latency grows linearly with data size |
| OFFSET on large tables | Full scan, performance degrades with page depth |
| Functions on indexed columns in WHERE | Index bypassed, full table scan |
| timestamp instead of timestamptz | Silent timezone bugs in production |
| Long transactions in request handlers | Lock contention, WAL bloat |
| String concatenation in SQL | SQL injection vulnerability |
| ALTER TABLE without lock_timeout | Blocks all queries on a busy table |
| No RETURNING on INSERT/UPDATE | Unnecessary extra database round trip |
| Volatile function in RLS policy | Per-row execution, severe performance hit |
| Missing updated_at trigger | Stale data, broken cache invalidation |

---

## Output Format

When reviewing SQL or schema code, group findings by file or query block:

```
## table_name or file.sql

file:line  [CRITICAL]  No RLS policy — all authenticated users can read this table
file:line  [CRITICAL]  Service role key referenced in client-side code
file:line  [HIGH]      Missing index on orders.user_id — full scan on JOIN
file:line  [MEDIUM]    SELECT * — specify required columns
file:line  [LOW]       timestamp → use timestamptz

## other_query_or_file

pass
```

Severity: CRITICAL (security or outage risk), HIGH (significant performance
degradation), MEDIUM (best practice violation), LOW (minor optimization).

---

## Quick Reference — Supabase-Specific

| Task | Correct Approach |
|---|---|
| Serverless DB connection | Supavisor pooler URL, transaction mode |
| Auth in RLS policy | `auth.uid()`, `auth.role()`, `auth.jwt()` |
| Safe server-side operations | Service role key, server-side only |
| Scheduled jobs | `pg_cron` via Supabase dashboard or SQL |
| Full-text search | `tsvector` generated column + GIN index |
| Soft deletes | `deleted_at timestamptz` + partial index on `deleted_at IS NULL` |
| Realtime subscriptions | Enable replication on the table in Supabase dashboard |

---

## References

- Postgres documentation: https://www.postgresql.org/docs/current/
- Supabase documentation: https://supabase.com/docs
- Supabase RLS guide: https://supabase.com/docs/guides/auth/row-level-security
- Supabase database overview: https://supabase.com/docs/guides/database/overview
- Postgres performance wiki: https://wiki.postgresql.org/wiki/Performance_Optimization
- Rule reference files:
  - `references/query-missing-indexes.md`
  - `references/schema-partial-indexes.md`
  - `references/security-rls-policies.md`
  - `references/_sections.md`
