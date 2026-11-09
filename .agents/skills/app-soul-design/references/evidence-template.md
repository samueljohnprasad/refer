# Evidence template (every phase artifact uses this shape)

The machine check (`scripts/check_phase.py`) parses these exact headings and line prefixes. Do not rename them.

```markdown
# Phase N — <title>

Pass: <integer ≥2>
Inputs: <files read>

## Summary
<5–10 lines: the decisions this phase makes>

## Findings

### F1. <short finding title>
- Claim: <one falsifiable sentence; numbers where possible>
- Evidence: [S3], [S7] | https://mobbin.com/screens/<id> | inference: <reasoning chain>
- Mechanism: <why it works — the causal link, not an adjective>
- So what for Happy: <concrete consequence for our app: screen, copy, token or rule>

### F2. ...

## Contradictions
- <Source A says X [S2]; source B says Y [S9]. Decision: ... because ...>

## Rejected ideas
- <Idea> — rejected because <evidence/reason>.

## Critique (pass 1)
- [FAIL] <checklist id>: <what was thin or wrong>
- [PASS] <checklist id>

## Revisions
- Pass 2: <what changed in response to each FAIL>

## Self-critique
- Weakest part: ...
- A further pass should: ...

## Sources
- [S1] Author, A. (Year). Title. Venue. DOI/URL
- [S2] App — Screen name. https://mobbin.com/screens/<id>
```

## Rules for entries
- **Claim** is one sentence. If it needs "and", split it into two findings.
- **Evidence** must contain at least one of: `[S#]` that exists in `## Sources`, a `mobbin.com` URL, or the literal word `inference:` followed by the reasoning chain.
- **Sources** list: one line per source, numbered `[S#]` sequentially. Peer-reviewed work gives author, year, venue, DOI or URL. Books give author, year, publisher. Mobbin entries give app, screen description, URL. Internal repo files are prefixed `internal:` and do not count toward minimums.
- **Vague words** (clean, modern, engaging, delightful, intuitive, seamless, sleek, beautiful, fun, nice, friendly, playful, premium) are banned outside quotes unless the same line carries a number. Write the mechanism instead.
- **Quotes** of copy or of other apps go in double quotes or backticks; banned-word checks skip quoted text.
