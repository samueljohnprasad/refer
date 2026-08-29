# Interface Contract: Seed JSON Structure

The `supabase/seed/sleep_reset_section_1.sql` file utilizes PostgreSQL `jsonb_to_recordset` to map raw JSON strings into table inserts.

**Format**:
```sql
FROM jsonb_to_recordset('[
  {
    "source_id": "u1_l2_concept",
    "node_source_id": "u1_1_sleep_mechanics-n2",
    "order_index": 0,
    "type": "concept_card",
    "content": { ... }
  },
  ...
]'::jsonb)
```

**Constraints**:
- The JSON string MUST be valid JSON when single quotes are escaped.
- When generating the updated JSON using Python, ensure `json.dumps()` does not inadvertently escape Unicode characters (like `\u2013` for en-dash) in a way that breaks exact string matching or `git diff` expectations, OR be prepared to explain massive line diffs.
- Single quotes (`'`) must be double-escaped (`''`) for PostgreSQL string literal compatibility.
