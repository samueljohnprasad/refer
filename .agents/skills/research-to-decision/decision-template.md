# Decision Output Template

Use this template exactly for the final output. Caveman voice. Fragments OK. ≤ 2 pages.

Save to: `.r2d/<slug>/decision.md` and also print it in the response.

---

```
# Decision — <slug>

<One sentence. What to build.>

**Reversibility:** <one-way door | two-way door>. <If one-way, one line on what makes it sticky and what to lock in NOW.>

# Why

- <reason + source URL>
- <reason + source URL>
- <max 5 bullets>

# Rejected

- <alt 1>: <why not — one line>
- <alt 2>: <why not — one line>
- <alt 3>: <why not — one line>

# Risks

- <risk>: <mitigation — one line>
- <max 3>

# Confidence: <N>%

<One line — what would raise or lower it>

# Blueprint (dispatch-ready)

**Dispatch shape:** <single agent, single module | SDD 3-task plan | parallel: N independent modules>

Files to touch:
- <path/to/file1> — <what changes, one line>
- <path/to/file2> — <what changes, one line>

Interfaces / contracts:
- <function signature or type> — <purpose>
- <function signature or type> — <purpose>

Steps:
1. <Concrete step — name file/module/function>
2. <Concrete step>
3. <Concrete step>

Test file(s) + expected test names:
- <path/to/test.ts>:
  - `<test name — describes behavior>`
  - `<test name — describes behavior>`

Scope fence (do NOT change):
- <path or module that must stay untouched>
- <adjacent code the coding agent might drift into but shouldn't>

Dependencies to add (if any):
- <package@version> — <purpose>

Config / env changes (if any):
- <KEY> — <purpose>

Acceptance criteria (pass/fail from diff):
- <Testable pass/fail claim>
- <Testable pass/fail claim>
- <Testable pass/fail claim>

# Sources (top 5)

- <Title> — <URL> — Strong/Medium
- <Title> — <URL> — Strong/Medium
- <Title> — <URL> — Strong/Medium

# Decision-point log (if any dev input was needed)

- Q: <question>. Dev chose: <A or B>. Reason: <one line>.

# Next Action

<Exactly one. e.g. "Dispatch coding subagent with .r2d/<slug>/decision.md and .r2d/<slug>/codebase-context.md as brief.">
```

---

## Voice rules

- Fragments OK: "Use JWT. Skip sessions."
- Drop: a, an, the, just, really, basically, actually, essentially
- Drop: "you should," "make sure to," "it might be worth"
- Verb-first sentences
- Keep exact: code, URLs, file paths, commands, version numbers
- One idea per line
- No multi-paragraph analysis — bullets

## Reversibility flag rules

Every Decision carries one:

- **one-way door** — sticky. Costly or impossible to reverse later. Examples: DB schema shape, auth model, framework choice, public API contract, PII storage location.
- **two-way door** — cheap to change later. Examples: HTTP client library, log format, internal helper structure, dev tooling.

If one-way, add a short "lock in NOW" note: what needs to be right on first try because you won't easily change it (e.g. "table columns and PK type — migrations later are painful with data").

## Dispatch shape rules

Every Blueprint carries one. Tells the dev what coding-agent flow is about to fire.

- **single agent, single module** — one coding subagent, one file / small directory. No SDD needed.
- **single agent, multi-file** — one coding subagent, multiple files but coherent scope. No SDD needed.
- **parallel: N independent modules** — dispatch N coding subagents in parallel; module boundaries are truly independent.
- **SDD N-task plan** — hand to `superpowers:subagent-driven-development` with N sequential tasks. Use when tasks depend on each other or when the work touches enough surface area to warrant review loops.

## Acceptance criteria rules

Every criterion = one pass/fail claim a review agent can check by reading the diff. Examples:

Good:

- `src/auth/jwt.ts exports signToken(userId: string): string and verifyToken(token: string): {userId: string} | null`
- `test/auth.test.ts contains "rejects expired tokens" and passes with npm test`
- `no changes to files under src/legacy/`
- `package.json includes jsonwebtoken@^9 in dependencies`

Bad:

- "code is clean" — not verifiable from diff
- "auth works" — vague
- "follows best practices" — no diff-level check possible
- "user experience is good" — not a code claim

If a criterion cannot be verified from the diff, it is not a criterion — it is a wish. Cut it or rewrite it.

## Handoff prompt (append after the decision)

After writing the decision, print this to the dev:

```
Decision written to: <path>
Reversibility: <one-way/two-way>. Dispatch shape: <shape>.

Next step?
B) Dispatch coding subagent(s) with Blueprint + codebase-context.md as brief (default — small/self-contained)
A) Route through superpowers:subagent-driven-development (only if >3 tasks, novel arch, or coordination risk)
C) Iterate on decision

Your call?
```

Default: B. Solo agentic dev — dev never opens editor. Blueprint is the brief. Only escalate to A when the work is genuinely large + novel + multi-task. If C, loop.
