---
name: clean-code
description: Use for all code writing, refactoring, debugging, and review in this repo. Enforces readable names, small functions, single responsibility, clean error handling, and the repo rule that React components, hooks, and helpers stay at or below 300 lines.
---

# Clean Code

Use this skill whenever changing or reviewing code in this repo.

## Hard repo rule

- React component files, hook files, and helper files must stay at or below 300 lines.
- If a touched component, hook, or helper is already over 300 lines, split it before adding behavior.
- Do not move code from one oversized file into another oversized file.

## Working rules

- Use intention-revealing names.
- Keep functions small and focused.
- Keep components single-purpose.
- Prefer guard clauses over deep nesting.
- Extract named helpers for repeated logic.
- Avoid flag arguments when two named functions are clearer.
- Comments explain why, not what.
- Delete dead code instead of commenting it out.
- Keep error handling explicit and separate from happy-path logic.
- Return empty collections or explicit results instead of nullable surprises where possible.

## Verification

- Before finishing, check touched component/hook/helper line counts.
- Run the narrowest useful type/lint/check command available.
